from __future__ import annotations

import subprocess
import hashlib
import os
import urllib.request
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from threading import Event
from typing import Callable, Deque, Optional

import cv2
import imageio_ffmpeg
import numpy as np


LAMA_MODEL_URL = (
    "https://huggingface.co/opencv/inpainting_lama/resolve/main/"
    "inpainting_lama_2025jan.onnx?download=true"
)
LAMA_MODEL_SHA256 = "7df918ac3921d3daf0aae1d219776cf0dc4e4935f035af81841b40adcf74fdf2"
LAMA_MODEL_NAME = "inpainting_lama_2025jan.onnx"


ProgressCallback = Callable[[int, int, str], None]


class ProcessingCancelled(RuntimeError):
    pass


@dataclass(frozen=True)
class VideoInfo:
    width: int
    height: int
    fps: float
    frame_count: int
    duration: float


def _default_model_path() -> Path:
    local_data = os.environ.get("LOCALAPPDATA")
    base = Path(local_data) if local_data else Path.home() / "AppData" / "Local"
    return base / "WatermarkCleaner" / "models" / LAMA_MODEL_NAME


def _file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ensure_lama_model(model_path: str | Path | None = None) -> Path:
    path = Path(model_path) if model_path else _default_model_path()
    if path.exists() and _file_sha256(path) == LAMA_MODEL_SHA256:
        return path
    path.parent.mkdir(parents=True, exist_ok=True)
    partial = path.with_suffix(path.suffix + ".part")
    try:
        with urllib.request.urlopen(LAMA_MODEL_URL, timeout=60) as response, partial.open("wb") as target:
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                target.write(chunk)
        if _file_sha256(partial) != LAMA_MODEL_SHA256:
            raise RuntimeError("Контрольная сумма AI-модели не совпала.")
        partial.replace(path)
    except Exception as exc:
        if partial.exists():
            try:
                partial.unlink()
            except OSError:
                pass
        raise RuntimeError(
            "Не удалось скачать AI-модель LaMa (92,6 МБ). "
            "Проверьте интернет и повторите запуск."
        ) from exc
    return path


def _reflect_pad_to(image: np.ndarray, height: int, width: int) -> np.ndarray:
    """Reflect-pad right/bottom to the target size, even past the image size."""
    while image.shape[0] < height or image.shape[1] < width:
        pad_bottom = min(max(0, height - image.shape[0]), image.shape[0] - 1)
        pad_right = min(max(0, width - image.shape[1]), image.shape[1] - 1)
        if pad_bottom == 0 and pad_right == 0:
            break
        image = cv2.copyMakeBorder(image, 0, pad_bottom, 0, pad_right, cv2.BORDER_REFLECT_101)
    if image.shape[0] < height or image.shape[1] < width:
        image = cv2.copyMakeBorder(
            image, 0, height - image.shape[0], 0, width - image.shape[1], cv2.BORDER_REPLICATE
        )
    return image


class LamaInpainter:
    """Sharp local AI inpainting using OpenCV's Apache-licensed LaMa model.

    The ONNX model has a fixed 512x512 input, so feeding it a large downscaled
    crop and stretching the answer back is what produces the familiar blurry
    patch. Instead, every watermark blob is restored at native pixel scale
    inside a true 512x512 window; oversized blobs get a coarse structural pass
    followed by native-resolution tile refinement. Static scenes reuse the
    previous fill, which removes frame-to-frame flicker and speeds video up.
    """

    INPUT = 512
    CONTEXT = 48
    TILE_OVERLAP = 128
    FEATHER = 7
    CACHE_TOLERANCE = 1.7

    def __init__(self, model_path: str | Path | None = None) -> None:
        try:
            import onnxruntime as ort
        except ImportError as exc:
            raise RuntimeError("AI-компонент не установлен. Повторно запустите install_and_start.bat.") from exc

        options = ort.SessionOptions()
        options.log_severity_level = 3
        options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        cpu_count = os.cpu_count() or 4
        options.intra_op_num_threads = max(1, cpu_count - 1)
        self.session = ort.InferenceSession(
            str(ensure_lama_model(model_path)),
            sess_options=options,
            providers=["CPUExecutionProvider"],
        )
        self._cache: dict[int, dict] = {}

    def reset(self) -> None:
        self._cache.clear()

    def _run(self, image: np.ndarray, mask: np.ndarray) -> np.ndarray:
        image_blob = image.transpose(2, 0, 1)[None].astype(np.float32) / 255.0
        mask_blob = (mask[None, None] > 0).astype(np.float32)
        output = self.session.run(None, {"image": image_blob, "mask": mask_blob})[0][0]
        # This quantized OpenCV Zoo model returns pixels directly in 0..255.
        return np.clip(output.transpose(1, 2, 0), 0, 255).astype(np.uint8)

    def _crop512(self, image: np.ndarray, mask: np.ndarray, top: int, left: int):
        frame_h, frame_w = image.shape[:2]
        bottom = min(frame_h, top + self.INPUT)
        right = min(frame_w, left + self.INPUT)
        crop = image[top:bottom, left:right]
        crop_mask = mask[top:bottom, left:right]
        crop_h, crop_w = crop.shape[:2]
        if (crop_h, crop_w) != (self.INPUT, self.INPUT):
            crop = _reflect_pad_to(crop, self.INPUT, self.INPUT)
            crop_mask = cv2.copyMakeBorder(
                crop_mask,
                0,
                self.INPUT - crop_h,
                0,
                self.INPUT - crop_w,
                cv2.BORDER_CONSTANT,
                value=0,
            )
        return crop, crop_mask, crop_h, crop_w, bottom, right

    @staticmethod
    def _groups(mask: np.ndarray) -> list[tuple[np.ndarray, tuple[int, int, int, int]]]:
        merged = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41)))
        count, labels = cv2.connectedComponents((merged > 0).astype(np.uint8))
        groups = []
        for label in range(1, count):
            group = np.where((labels == label) & (mask > 0), 255, 0).astype(np.uint8)
            points = cv2.findNonZero(group)
            if points is None:
                continue
            groups.append((group, cv2.boundingRect(points)))
        return groups

    def _signature(self, frame: np.ndarray, group: np.ndarray, bbox: tuple[int, int, int, int]) -> np.ndarray:
        x, y, width, height = bbox
        frame_h, frame_w = frame.shape[:2]
        margin = 64
        top, left = max(0, y - margin), max(0, x - margin)
        bottom, right = min(frame_h, y + height + margin), min(frame_w, x + width + margin)
        crop = cv2.cvtColor(frame[top:bottom, left:right], cv2.COLOR_BGR2GRAY)
        crop = np.where(group[top:bottom, left:right] > 0, 0, crop).astype(np.uint8)
        return cv2.resize(crop, (48, 48), interpolation=cv2.INTER_AREA).astype(np.float32)

    def _fill_native(self, scratch: np.ndarray, group: np.ndarray, bbox: tuple[int, int, int, int]) -> None:
        x, y, width, height = bbox
        frame_h, frame_w = scratch.shape[:2]
        left = min(max(0, x + width // 2 - self.INPUT // 2), max(0, frame_w - self.INPUT))
        top = min(max(0, y + height // 2 - self.INPUT // 2), max(0, frame_h - self.INPUT))
        crop, crop_mask, crop_h, crop_w, bottom, right = self._crop512(scratch, group, top, left)
        generated = self._run(crop, crop_mask)
        selected = crop_mask[:crop_h, :crop_w] > 0
        region = scratch[top:bottom, left:right]
        region[selected] = generated[:crop_h, :crop_w][selected]

    def _fill_oversized(self, scratch: np.ndarray, group: np.ndarray, bbox: tuple[int, int, int, int]) -> None:
        x, y, width, height = bbox
        frame_h, frame_w = scratch.shape[:2]

        # Coarse pass: solve the whole blob at reduced scale to get plausible
        # global structure. Downscaling the mask via area averaging keeps thin
        # strokes covered — nearest-neighbour used to drop them, which left
        # watermark remnants behind on high-resolution frames.
        margin = max(64, int(0.25 * max(width, height)))
        top = max(0, y - margin)
        left = max(0, x - margin)
        bottom = min(frame_h, y + height + margin)
        right = min(frame_w, x + width + margin)
        crop = scratch[top:bottom, left:right]
        crop_mask = group[top:bottom, left:right]
        image_512 = cv2.resize(crop, (self.INPUT, self.INPUT), interpolation=cv2.INTER_AREA)
        mask_area = cv2.resize(
            crop_mask.astype(np.float32), (self.INPUT, self.INPUT), interpolation=cv2.INTER_AREA
        )
        mask_512 = np.where(mask_area > 0, 255, 0).astype(np.uint8)
        generated = self._run(image_512, mask_512)
        coarse = cv2.resize(
            generated, (crop.shape[1], crop.shape[0]), interpolation=cv2.INTER_LANCZOS4
        )
        selected = crop_mask > 0
        crop[selected] = coarse[selected]

        # Refinement: re-generate the masked pixels tile by tile at native
        # resolution. Each tile sees real pixels plus already-refined output as
        # context, so detail comes back sharp instead of upscaled-soft.
        step = self.INPUT - self.TILE_OVERLAP
        done = np.zeros(group.shape, dtype=bool)
        for window_y in range(max(0, y - self.CONTEXT), y + height, step):
            for window_x in range(max(0, x - self.CONTEXT), x + width, step):
                tile_top = min(window_y, max(0, frame_h - self.INPUT))
                tile_left = min(window_x, max(0, frame_w - self.INPUT))
                crop, crop_mask, crop_h, crop_w, tile_bottom, tile_right = self._crop512(
                    scratch, group, tile_top, tile_left
                )
                pending = np.zeros((self.INPUT, self.INPUT), dtype=np.uint8)
                pending[:crop_h, :crop_w] = crop_mask[:crop_h, :crop_w]
                pending[:crop_h, :crop_w][done[tile_top:tile_bottom, tile_left:tile_right]] = 0
                # Leave the far overlap band to the next tile, which sees it
                # with proper context, unless this window already reaches the
                # end of the blob or the frame.
                if tile_right < min(frame_w, x + width) and crop_w == self.INPUT:
                    pending[:, self.INPUT - self.TILE_OVERLAP // 2 :] = 0
                if tile_bottom < min(frame_h, y + height) and crop_h == self.INPUT:
                    pending[self.INPUT - self.TILE_OVERLAP // 2 :, :] = 0
                if not np.any(pending):
                    continue
                generated = self._run(crop, pending)
                selected = pending[:crop_h, :crop_w] > 0
                region = scratch[tile_top:tile_bottom, tile_left:tile_right]
                region[selected] = generated[:crop_h, :crop_w][selected]
                done[tile_top:tile_bottom, tile_left:tile_right][selected] = True

    def _restore_group(
        self,
        frame: np.ndarray,
        group: np.ndarray,
        bbox: tuple[int, int, int, int],
        key: int,
    ) -> tuple[np.ndarray, int, int]:
        x, y, width, height = bbox
        frame_h, frame_w = frame.shape[:2]
        pad = 24
        top, left = max(0, y - pad), max(0, x - pad)
        bottom, right = min(frame_h, y + height + pad), min(frame_w, x + width + pad)

        # When the surroundings barely change (static camera, frozen shot),
        # reuse the previous fill: it is both much faster and perfectly stable
        # in time, instead of re-generating slightly different texture noise.
        signature = self._signature(frame, group, bbox)
        cached = self._cache.get(key)
        if (
            cached is not None
            and cached["bbox"] == bbox
            and float(np.mean(np.abs(signature - cached["signature"]))) <= self.CACHE_TOLERANCE
        ):
            return cached["patch"], top, left

        scratch = frame.copy()
        if width + 2 * self.CONTEXT <= self.INPUT and height + 2 * self.CONTEXT <= self.INPUT:
            self._fill_native(scratch, group, bbox)
        else:
            self._fill_oversized(scratch, group, bbox)
        patch = scratch[top:bottom, left:right].copy()
        self._cache[key] = {"bbox": bbox, "signature": signature, "patch": patch}
        return patch, top, left

    def _blend(self, result: np.ndarray, patch: np.ndarray, group: np.ndarray, top: int, left: int) -> None:
        bottom = top + patch.shape[0]
        right = left + patch.shape[1]
        mask_window = group[top:bottom, left:right]
        # Full replacement inside the mask plus a ~2 px outward feather, which
        # hides both the paste seam and semi-transparent watermark edges.
        soft = cv2.GaussianBlur(mask_window, (self.FEATHER, self.FEATHER), 0).astype(np.float32) / 255.0
        alpha = np.maximum(soft, (mask_window > 0).astype(np.float32))[..., None]
        region = result[top:bottom, left:right].astype(np.float32)
        blended = patch.astype(np.float32) * alpha + region * (1.0 - alpha)
        result[top:bottom, left:right] = np.clip(blended + 0.5, 0, 255).astype(np.uint8)

    def infer(self, frame: np.ndarray, mask: np.ndarray) -> np.ndarray:
        if cv2.findNonZero(mask) is None:
            return frame.copy()
        result = frame.copy()
        for key, (group, bbox) in enumerate(self._groups(mask)):
            patch, top, left = self._restore_group(frame, group, bbox, key)
            self._blend(result, patch, group, top, left)
        return result


def read_video_info(path: str | Path) -> VideoInfo:
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        raise ValueError("Не удалось открыть видео. Проверьте формат файла.")
    try:
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = float(cap.get(cv2.CAP_PROP_FPS))
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    finally:
        cap.release()

    if width <= 0 or height <= 0:
        raise ValueError("Не удалось определить размер видео.")
    if not np.isfinite(fps) or fps <= 0:
        fps = 30.0
    duration = frame_count / fps if frame_count > 0 else 0.0
    return VideoInfo(width, height, fps, frame_count, duration)


def read_frame(path: str | Path, frame_index: int) -> np.ndarray:
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        raise ValueError("Не удалось открыть видео.")
    try:
        cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, int(frame_index)))
        ok, frame = cap.read()
    finally:
        cap.release()
    if not ok or frame is None:
        raise ValueError("Не удалось прочитать выбранный кадр.")
    return frame


def prepare_mask(mask: np.ndarray, width: int, height: int, margin: int) -> np.ndarray:
    if mask.ndim == 3:
        mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
    if mask.shape[:2] != (height, width):
        mask = cv2.resize(mask, (width, height), interpolation=cv2.INTER_NEAREST)
    mask = np.where(mask > 0, 255, 0).astype(np.uint8)
    if margin > 0:
        size = margin * 2 + 1
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (size, size))
        mask = cv2.dilate(mask, kernel)
    return mask


def _inpaint(
    frame: np.ndarray,
    mask: np.ndarray,
    radius: int,
    method: int = cv2.INPAINT_NS,
) -> np.ndarray:
    # Navier-Stokes with a small radius keeps edges noticeably sharper than
    # the broad Telea fill used by many simple watermark removers.
    return cv2.inpaint(frame, mask, float(max(1, radius)), method)


def _estimate_affine(
    source: np.ndarray,
    target: np.ndarray,
    source_mask: np.ndarray,
    target_mask: np.ndarray,
) -> Optional[np.ndarray]:
    """Estimate camera motion from source to target, ignoring the watermark."""
    max_side = max(target.shape[:2])
    scale = min(1.0, 960.0 / max_side)
    if scale < 1.0:
        size = (int(target.shape[1] * scale), int(target.shape[0] * scale))
        src_small = cv2.resize(source, size, interpolation=cv2.INTER_AREA)
        dst_small = cv2.resize(target, size, interpolation=cv2.INTER_AREA)
        src_mask_small = cv2.resize(source_mask, size, interpolation=cv2.INTER_NEAREST)
        dst_mask_small = cv2.resize(target_mask, size, interpolation=cv2.INTER_NEAREST)
    else:
        src_small, dst_small = source, target
        src_mask_small, dst_mask_small = source_mask, target_mask

    src_gray = cv2.cvtColor(src_small, cv2.COLOR_BGR2GRAY)
    dst_gray = cv2.cvtColor(dst_small, cv2.COLOR_BGR2GRAY)
    orb = cv2.ORB_create(nfeatures=1400, fastThreshold=12)
    kp1, des1 = orb.detectAndCompute(src_gray, cv2.bitwise_not(src_mask_small))
    kp2, des2 = orb.detectAndCompute(dst_gray, cv2.bitwise_not(dst_mask_small))
    if des1 is None or des2 is None or len(kp1) < 10 or len(kp2) < 10:
        return None

    matcher = cv2.BFMatcher(cv2.NORM_HAMMING)
    pairs = matcher.knnMatch(des1, des2, k=2)
    good = [a for a, b in pairs if a.distance < 0.72 * b.distance]
    if len(good) < 8:
        return None

    src_pts = np.float32([kp1[m.queryIdx].pt for m in good])
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good])
    affine, inliers = cv2.estimateAffinePartial2D(
        src_pts,
        dst_pts,
        method=cv2.RANSAC,
        ransacReprojThreshold=3.0,
        maxIters=2000,
        confidence=0.995,
    )
    if affine is None or inliers is None or int(inliers.sum()) < 7:
        return None

    affine = affine.astype(np.float64)
    if scale < 1.0:
        affine[0, 2] /= scale
        affine[1, 2] /= scale

    linear = affine[:, :2]
    det = float(np.linalg.det(linear))
    translation = float(np.linalg.norm(affine[:, 2]))
    if not 0.75 < det < 1.30 or translation > max(target.shape[:2]) * 0.35:
        return None
    return affine


def _temporal_restore(
    frame: np.ndarray,
    mask: np.ndarray,
    neighbours: list[np.ndarray],
    inpaint_radius: int,
) -> np.ndarray:
    fallback = _inpaint(frame, mask, inpaint_radius, cv2.INPAINT_NS)
    if not neighbours:
        return fallback

    restored = fallback.copy()
    remaining = mask > 0
    h, w = mask.shape
    ones = np.full((h, w), 255, dtype=np.uint8)

    # A thin ring checks whether a warped neighbour agrees with the current frame.
    ring_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21))
    ring = (cv2.dilate(mask, ring_kernel) > 0) & (mask == 0)

    # Neighbours are interleaved before/after the current frame. Real pixels
    # are preferred over generated fill whenever camera motion reveals them.
    for previous in neighbours:
        affine = _estimate_affine(previous, frame, mask, mask)
        if affine is None:
            continue
        warped = cv2.warpAffine(
            previous,
            affine,
            (w, h),
            flags=cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_REFLECT,
        )
        warped_mask = cv2.warpAffine(
            mask,
            affine,
            (w, h),
            flags=cv2.INTER_NEAREST,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=255,
        )
        valid_bounds = cv2.warpAffine(
            ones,
            affine,
            (w, h),
            flags=cv2.INTER_NEAREST,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=0,
        )

        ring_valid = ring & (valid_bounds > 0) & (warped_mask == 0)
        if int(ring_valid.sum()) >= 40:
            delta = cv2.absdiff(warped, frame)
            disagreement = float(np.median(delta[ring_valid]))
            if disagreement > 32.0:
                continue

        usable = remaining & (warped_mask == 0) & (valid_bounds > 0)
        if not np.any(usable):
            continue
        restored[usable] = warped[usable]
        remaining[usable] = False
        if not np.any(remaining):
            break

    # Soften only the outside edge, keeping the recovered centre sharp.
    edge = (mask > 0) & (cv2.erode(mask, np.ones((3, 3), np.uint8)) == 0)
    if np.any(edge):
        blended = (
            restored[edge].astype(np.uint16) * 3 + frame[edge].astype(np.uint16)
        ) // 4
        restored[edge] = blended.astype(np.uint8)
    return restored


def process_video(
    input_path: str | Path,
    output_path: str | Path,
    mask: np.ndarray,
    mode: str = "quality",
    margin: int = 2,
    inpaint_radius: int = 1,
    crf: int = 18,
    progress: Optional[ProgressCallback] = None,
    cancel_event: Optional[Event] = None,
) -> None:
    input_path = Path(input_path)
    output_path = Path(output_path)
    info = read_video_info(input_path)
    mask = prepare_mask(mask, info.width, info.height, margin)
    if not np.any(mask):
        raise ValueError("Сначала закрасьте ватермарк кистью.")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    lama: LamaInpainter | None = None
    if mode == "ai":
        if progress is not None:
            progress(0, info.frame_count, "Подготовка AI-модели (при первом запуске скачивается 92,6 МБ)")
        lama = LamaInpainter()
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    command = [
        ffmpeg,
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "bgr24",
        "-s:v",
        f"{info.width}x{info.height}",
        "-r",
        f"{info.fps:.8f}",
        "-i",
        "pipe:0",
        "-i",
        str(input_path),
        "-map",
        "0:v:0",
        "-map",
        "1:a?",
        "-c:v",
        "libx264",
        "-preset",
        "medium" if mode != "fast" else "veryfast",
        "-crf",
        str(int(crf)),
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        str(output_path),
    ]

    cap = cv2.VideoCapture(str(input_path))
    if not cap.isOpened():
        raise ValueError("Не удалось открыть видео для обработки.")
    encoder = subprocess.Popen(
        command,
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        creationflags=subprocess.CREATE_NO_WINDOW if hasattr(subprocess, "CREATE_NO_WINDOW") else 0,
    )
    history: Deque[np.ndarray] = deque(maxlen=10)
    future: Deque[np.ndarray] = deque()
    lookahead = 8 if mode == "quality" else 0
    index = 0
    try:
        # A small look-ahead lets the quality mode recover from both earlier
        # and later frames without loading the whole video into memory.
        while len(future) < lookahead + 1:
            ok, buffered = cap.read()
            if not ok:
                break
            future.append(buffered)

        while True:
            if cancel_event is not None and cancel_event.is_set():
                raise ProcessingCancelled("Обработка отменена.")
            if not future:
                break
            frame = future.popleft()

            if mode == "ai":
                if lama is None:
                    raise RuntimeError("AI-модель не подготовлена.")
                result = lama.infer(frame, mask)
            elif mode == "quality":
                neighbours: list[np.ndarray] = []
                max_distance = max(len(history), len(future))
                for distance in range(1, max_distance + 1):
                    if distance <= len(history):
                        neighbours.append(history[-distance])
                    if distance <= len(future):
                        neighbours.append(future[distance - 1])
                    if len(neighbours) >= 12:
                        break
                result = _temporal_restore(frame, mask, neighbours, inpaint_radius)
                history.append(frame.copy())
            else:
                result = _inpaint(frame, mask, inpaint_radius, cv2.INPAINT_NS)

            if encoder.stdin is None:
                raise RuntimeError("Не удалось передать кадры кодировщику.")
            try:
                encoder.stdin.write(result.tobytes())
            except BrokenPipeError as exc:
                stderr = encoder.stderr.read().decode("utf-8", errors="replace") if encoder.stderr else ""
                raise RuntimeError(f"Ошибка кодирования видео: {stderr.strip() or exc}") from exc
            index += 1
            if progress is not None and (index == 1 or index % 5 == 0):
                progress(index, info.frame_count, "Обработка кадров")

            ok, buffered = cap.read()
            if ok:
                future.append(buffered)

        if encoder.stdin is not None:
            encoder.stdin.close()
        encoder.stdin = None
        stderr = encoder.stderr.read().decode("utf-8", errors="replace") if encoder.stderr else ""
        code = encoder.wait()
        if code != 0:
            raise RuntimeError(f"Ошибка сохранения видео: {stderr.strip() or code}")
        if index == 0:
            raise ValueError("В видео не найдено кадров.")
        if progress is not None:
            progress(index, info.frame_count or index, "Готово")
    except Exception:
        if encoder.poll() is None:
            if encoder.stdin is not None:
                try:
                    encoder.stdin.close()
                except OSError:
                    pass
            encoder.terminate()
            try:
                encoder.wait(timeout=3)
            except subprocess.TimeoutExpired:
                encoder.kill()
        if output_path.exists():
            try:
                output_path.unlink()
            except OSError:
                pass
        raise
    finally:
        cap.release()
