from __future__ import annotations

import queue
import threading
from pathlib import Path
from tkinter import BOTH, BOTTOM, DISABLED, END, HORIZONTAL, LEFT, NORMAL, RIGHT, TOP, X, Y
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

import cv2
import numpy as np
from PIL import Image, ImageTk

from engine import ProcessingCancelled, VideoInfo, process_video, read_frame, read_video_info


APP_NAME = "Watermark Cleaner"
BG = "#111318"
PANEL = "#1a1d24"
PANEL_2 = "#232731"
TEXT = "#f4f5f7"
MUTED = "#9ca3af"
ACCENT = "#7c5cff"
MASK_COLOR = (255, 65, 100)


class WatermarkCleanerApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title(APP_NAME)
        self.root.geometry("1180x780")
        self.root.minsize(900, 640)
        self.root.configure(bg=BG)

        self.video_path: Path | None = None
        self.video_info: VideoInfo | None = None
        self.current_frame: np.ndarray | None = None
        self.mask: np.ndarray | None = None
        self.display_photo: ImageTk.PhotoImage | None = None
        self.display_scale = 1.0
        self.display_offset = (0, 0)
        self.undo_stack: list[np.ndarray] = []
        self.last_point: tuple[int, int] | None = None
        self.is_drawing = False
        self.is_processing = False
        self.cancel_event = threading.Event()
        self.events: queue.Queue = queue.Queue()
        self.preview_job: str | None = None
        self.brush_cursor_pos: tuple[int, int] | None = None

        self.brush_size = tk.IntVar(value=9)
        self.margin = tk.IntVar(value=1)
        self.restore_radius = tk.IntVar(value=1)
        self.mode = tk.StringVar(value="quality")
        self.status = tk.StringVar(value="Открой видео и выдели ватермарк кистью")
        self.frame_value = tk.IntVar(value=0)

        self._configure_styles()
        self._build_ui()
        self.root.after(100, self._poll_events)

    def _configure_styles(self) -> None:
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("TFrame", background=BG)
        style.configure("Panel.TFrame", background=PANEL)
        style.configure("TLabel", background=BG, foreground=TEXT, font=("Segoe UI", 10))
        style.configure("Muted.TLabel", background=PANEL, foreground=MUTED, font=("Segoe UI", 9))
        style.configure("Title.TLabel", background=BG, foreground=TEXT, font=("Segoe UI Semibold", 20))
        style.configure("Panel.TLabel", background=PANEL, foreground=TEXT, font=("Segoe UI", 10))
        style.configure("TButton", font=("Segoe UI Semibold", 10), padding=(14, 9))
        style.configure("Accent.TButton", background=ACCENT, foreground="white")
        style.map("Accent.TButton", background=[("active", "#9278ff"), ("disabled", "#464259")])
        style.configure("TScale", background=PANEL)
        style.configure("TProgressbar", background=ACCENT, troughcolor=PANEL_2, borderwidth=0)
        style.configure("TCombobox", fieldbackground=PANEL_2, background=PANEL_2, foreground=TEXT)

    def _build_ui(self) -> None:
        header = ttk.Frame(self.root, padding=(22, 18, 22, 12))
        header.pack(side=TOP, fill=X)
        ttk.Label(header, text=APP_NAME, style="Title.TLabel").pack(side=LEFT)
        ttk.Label(header, text="локально • бесплатно • без загрузки в облако", foreground=MUTED).pack(side=LEFT, padx=18, pady=(8, 0))
        self.open_button = ttk.Button(header, text="Открыть видео", command=self.open_video)
        self.open_button.pack(side=RIGHT)

        body = ttk.Frame(self.root, padding=(22, 0, 22, 14))
        body.pack(fill=BOTH, expand=True)

        canvas_wrap = ttk.Frame(body, style="Panel.TFrame", padding=10)
        canvas_wrap.pack(side=LEFT, fill=BOTH, expand=True)
        self.canvas = tk.Canvas(canvas_wrap, bg="#090a0d", highlightthickness=0, cursor="arrow")
        self.canvas.pack(fill=BOTH, expand=True)
        self.canvas.bind("<ButtonPress-1>", self._start_stroke)
        self.canvas.bind("<B1-Motion>", self._continue_stroke)
        self.canvas.bind("<ButtonRelease-1>", self._end_stroke)
        self.canvas.bind("<ButtonPress-3>", self._start_erase)
        self.canvas.bind("<B3-Motion>", self._continue_erase)
        self.canvas.bind("<ButtonRelease-3>", self._end_stroke)
        self.canvas.bind("<Motion>", self._track_brush)
        self.canvas.bind("<Leave>", self._hide_brush)
        self.canvas.bind("<MouseWheel>", self._brush_wheel)
        self.canvas.bind("<Configure>", lambda _event: self.render_frame())
        self.canvas.create_text(400, 280, text="Здесь появится кадр из видео", fill=MUTED, font=("Segoe UI", 16))

        sidebar = ttk.Frame(body, style="Panel.TFrame", width=290, padding=18)
        sidebar.pack(side=RIGHT, fill=Y, padx=(14, 0))
        sidebar.pack_propagate(False)

        ttk.Label(sidebar, text="1. Выделение", style="Panel.TLabel", font=("Segoe UI Semibold", 12)).pack(anchor="w")
        ttk.Label(sidebar, text="Левая кнопка — рисовать\nПравая кнопка — стирать", style="Muted.TLabel", justify=LEFT).pack(anchor="w", pady=(5, 14))
        self._brush_control(sidebar)
        self._slider_row(sidebar, "Запас вокруг маски", self.margin, 0, 12, " px")

        mask_buttons = ttk.Frame(sidebar, style="Panel.TFrame")
        mask_buttons.pack(fill=X, pady=(6, 22))
        self.undo_button = ttk.Button(mask_buttons, text="Отменить", command=self.undo, state=DISABLED)
        self.undo_button.pack(side=LEFT, fill=X, expand=True, padx=(0, 5))
        self.clear_button = ttk.Button(mask_buttons, text="Очистить", command=self.clear_mask, state=DISABLED)
        self.clear_button.pack(side=RIGHT, fill=X, expand=True, padx=(5, 0))

        ttk.Separator(sidebar).pack(fill=X, pady=(0, 18))
        ttk.Label(sidebar, text="2. Восстановление", style="Panel.TLabel", font=("Segoe UI Semibold", 12)).pack(anchor="w")
        ttk.Label(
            sidebar,
            text="Основной режим берёт детали из видео.\nAI дорисовывает текстуру, но работает медленно.",
            style="Muted.TLabel",
            justify=LEFT,
        ).pack(anchor="w", pady=(5, 10))
        modes = ttk.Combobox(
            sidebar,
            state="readonly",
            values=("Соседние кадры — основной", "AI-текстура — медленно", "Локальный — быстро"),
        )
        modes.current(0)
        modes.pack(fill=X)
        mode_values = ("quality", "ai", "fast")
        modes.bind("<<ComboboxSelected>>", lambda _e: self.mode.set(mode_values[modes.current()]))
        self._slider_row(sidebar, "Радиус восстановления", self.restore_radius, 1, 5, " px")
        ttk.Label(sidebar, text="1 px — самый резкий результат", style="Muted.TLabel").pack(anchor="w", pady=(0, 4))

        ttk.Separator(sidebar).pack(fill=X, pady=18)
        ttk.Label(sidebar, text="3. Сохранение", style="Panel.TLabel", font=("Segoe UI Semibold", 12)).pack(anchor="w")
        ttk.Label(sidebar, text="MP4 (H.264), звук сохраняется", style="Muted.TLabel").pack(anchor="w", pady=(5, 12))
        self.process_button = ttk.Button(sidebar, text="Удалить ватермарк", style="Accent.TButton", command=self.start_processing, state=DISABLED)
        self.process_button.pack(fill=X)
        self.cancel_button = ttk.Button(sidebar, text="Остановить", command=self.cancel_processing, state=DISABLED)
        self.cancel_button.pack(fill=X, pady=(8, 0))

        timeline = ttk.Frame(self.root, style="Panel.TFrame", padding=(22, 12))
        timeline.pack(side=BOTTOM, fill=X)
        self.frame_label = ttk.Label(timeline, text="Кадр 0 / 0", style="Panel.TLabel")
        self.frame_label.pack(side=LEFT, padx=(0, 12))
        self.frame_slider = ttk.Scale(timeline, from_=0, to=0, orient=HORIZONTAL, command=self._timeline_changed)
        self.frame_slider.pack(side=LEFT, fill=X, expand=True)
        self.progress = ttk.Progressbar(timeline, mode="determinate", length=190)
        self.progress.pack(side=RIGHT, padx=(18, 0))
        ttk.Label(timeline, textvariable=self.status, style="Panel.TLabel").pack(side=RIGHT, padx=(18, 0))

    def _slider_row(self, parent, title, variable, minimum, maximum, suffix) -> None:
        row = ttk.Frame(parent, style="Panel.TFrame")
        row.pack(fill=X, pady=(0, 10))
        value_label = ttk.Label(row, text=f"{variable.get()}{suffix}", style="Panel.TLabel")
        value_label.pack(side=RIGHT)
        ttk.Label(row, text=title, style="Panel.TLabel").pack(side=LEFT)
        scale = ttk.Scale(parent, from_=minimum, to=maximum, orient=HORIZONTAL)
        scale.set(variable.get())
        scale.pack(fill=X, pady=(0, 12))

        def changed(raw):
            value = int(round(float(raw)))
            variable.set(value)
            value_label.configure(text=f"{value}{suffix}")

        scale.configure(command=changed)

    def _brush_control(self, parent) -> None:
        header = ttk.Frame(parent, style="Panel.TFrame")
        header.pack(fill=X)
        ttk.Label(header, text="Диаметр кисти", style="Panel.TLabel").pack(side=LEFT)
        self.brush_value_label = ttk.Label(
            header, text=f"{self.brush_size.get()} px", style="Panel.TLabel"
        )
        self.brush_value_label.pack(side=RIGHT)

        controls = ttk.Frame(parent, style="Panel.TFrame")
        controls.pack(fill=X, pady=(5, 12))
        ttk.Button(controls, text="−", width=3, command=lambda: self._change_brush(-1)).pack(side=LEFT)
        self.brush_slider = ttk.Scale(
            controls,
            from_=2,
            to=60,
            orient=HORIZONTAL,
            command=self._brush_scale_changed,
        )
        self.brush_slider.set(self.brush_size.get())
        self.brush_slider.pack(side=LEFT, fill=X, expand=True, padx=8)
        ttk.Button(controls, text="+", width=3, command=lambda: self._change_brush(1)).pack(side=RIGHT)

    def _brush_scale_changed(self, raw_value: str) -> None:
        value = max(2, min(60, int(round(float(raw_value)))))
        self.brush_size.set(value)
        self.brush_value_label.configure(text=f"{value} px")
        self._draw_brush_cursor()

    def _change_brush(self, delta: int) -> None:
        value = max(2, min(60, self.brush_size.get() + delta))
        self.brush_slider.set(value)
        self._brush_scale_changed(str(value))

    def _brush_wheel(self, event):
        self._change_brush(1 if event.delta > 0 else -1)
        return "break"

    def _track_brush(self, event) -> None:
        self.brush_cursor_pos = (event.x, event.y)
        self._draw_brush_cursor()

    def _hide_brush(self, _event) -> None:
        self.brush_cursor_pos = None
        self.canvas.delete("brush_cursor")

    def _draw_brush_cursor(self) -> None:
        self.canvas.delete("brush_cursor")
        if self.brush_cursor_pos is None or self.current_frame is None:
            return
        x, y = self.brush_cursor_pos
        if self._canvas_to_frame(x, y) is None:
            return
        radius = self.brush_size.get() / 2.0
        bounds = (x - radius, y - radius, x + radius, y + radius)
        self.canvas.create_oval(*bounds, outline="#000000", width=3, tags="brush_cursor")
        self.canvas.create_oval(*bounds, outline="#ffffff", width=1, tags="brush_cursor")

    def open_video(self) -> None:
        path = filedialog.askopenfilename(
            title="Выберите видео",
            filetypes=[("Видео", "*.mp4 *.mov *.mkv *.avi *.m4v *.webm"), ("Все файлы", "*.*")],
        )
        if not path:
            return
        try:
            info = read_video_info(path)
            frame = read_frame(path, 0)
        except Exception as exc:
            messagebox.showerror(APP_NAME, str(exc))
            return
        self.video_path = Path(path)
        self.video_info = info
        self.current_frame = frame
        self.mask = np.zeros((info.height, info.width), dtype=np.uint8)
        self.undo_stack.clear()
        self.frame_slider.configure(to=max(0, info.frame_count - 1))
        self.frame_slider.set(0)
        self.frame_label.configure(text=f"Кадр 1 / {info.frame_count or '?'}")
        self.status.set(f"{info.width}×{info.height} • {info.fps:.2f} FPS • {info.duration:.1f} сек")
        self.process_button.configure(state=NORMAL)
        self.clear_button.configure(state=NORMAL)
        self.undo_button.configure(state=DISABLED)
        self.render_frame()

    def _timeline_changed(self, raw_value: str) -> None:
        if self.video_path is None or self.is_processing:
            return
        index = int(round(float(raw_value)))
        total = self.video_info.frame_count if self.video_info else 0
        self.frame_label.configure(text=f"Кадр {index + 1} / {total or '?'}")
        if self.preview_job is not None:
            self.root.after_cancel(self.preview_job)
        self.preview_job = self.root.after(120, lambda: self._load_preview(index))

    def _load_preview(self, index: int) -> None:
        self.preview_job = None
        if self.video_path is None:
            return
        try:
            self.current_frame = read_frame(self.video_path, index)
            self.render_frame()
        except Exception as exc:
            self.status.set(str(exc))

    def _canvas_to_frame(self, x: int, y: int) -> tuple[int, int] | None:
        if self.current_frame is None:
            return None
        ox, oy = self.display_offset
        fx = int(round((x - ox) / self.display_scale))
        fy = int(round((y - oy) / self.display_scale))
        h, w = self.current_frame.shape[:2]
        if 0 <= fx < w and 0 <= fy < h:
            return fx, fy
        return None

    def _push_undo(self) -> None:
        if self.mask is not None:
            self.undo_stack.append(self.mask.copy())
            if len(self.undo_stack) > 30:
                self.undo_stack.pop(0)
            self.undo_button.configure(state=NORMAL)

    def _start_stroke(self, event) -> None:
        point = self._canvas_to_frame(event.x, event.y)
        if point is None or self.mask is None or self.is_processing:
            return
        self._push_undo()
        self.is_drawing = True
        self.last_point = point
        self._paint_line(point, point, 255)

    def _continue_stroke(self, event) -> None:
        if not self.is_drawing or self.last_point is None:
            return
        point = self._canvas_to_frame(event.x, event.y)
        if point is not None:
            self._paint_line(self.last_point, point, 255)
            self.last_point = point

    def _start_erase(self, event) -> None:
        point = self._canvas_to_frame(event.x, event.y)
        if point is None or self.mask is None or self.is_processing:
            return
        self._push_undo()
        self.is_drawing = True
        self.last_point = point
        self._paint_line(point, point, 0)

    def _continue_erase(self, event) -> None:
        if not self.is_drawing or self.last_point is None:
            return
        point = self._canvas_to_frame(event.x, event.y)
        if point is not None:
            self._paint_line(self.last_point, point, 0)
            self.last_point = point

    def _end_stroke(self, _event) -> None:
        self.is_drawing = False
        self.last_point = None

    def _paint_line(self, a: tuple[int, int], b: tuple[int, int], value: int) -> None:
        if self.mask is None:
            return
        # Brush size is expressed in preview pixels, matching familiar web editors.
        diameter = max(1, int(round(self.brush_size.get() / max(self.display_scale, 0.01))))
        cv2.line(self.mask, a, b, int(value), thickness=diameter, lineType=cv2.LINE_AA)
        cv2.circle(self.mask, b, max(1, diameter // 2), int(value), thickness=-1, lineType=cv2.LINE_AA)
        self.render_frame()

    def undo(self) -> None:
        if not self.undo_stack:
            return
        self.mask = self.undo_stack.pop()
        self.undo_button.configure(state=NORMAL if self.undo_stack else DISABLED)
        self.render_frame()

    def clear_mask(self) -> None:
        if self.mask is None or not np.any(self.mask):
            return
        self._push_undo()
        self.mask.fill(0)
        self.render_frame()

    def render_frame(self) -> None:
        if self.current_frame is None:
            return
        rgb = cv2.cvtColor(self.current_frame, cv2.COLOR_BGR2RGB)
        if self.mask is not None and np.any(self.mask):
            overlay = rgb.copy()
            selected = self.mask > 0
            overlay[selected] = MASK_COLOR
            rgb = cv2.addWeighted(rgb, 0.62, overlay, 0.38, 0)

        canvas_w = max(1, self.canvas.winfo_width())
        canvas_h = max(1, self.canvas.winfo_height())
        h, w = rgb.shape[:2]
        self.display_scale = min(canvas_w / w, canvas_h / h)
        draw_w = max(1, int(w * self.display_scale))
        draw_h = max(1, int(h * self.display_scale))
        self.display_offset = ((canvas_w - draw_w) // 2, (canvas_h - draw_h) // 2)
        image = Image.fromarray(rgb).resize((draw_w, draw_h), Image.Resampling.LANCZOS)
        self.display_photo = ImageTk.PhotoImage(image)
        self.canvas.delete("all")
        self.canvas.create_image(*self.display_offset, anchor="nw", image=self.display_photo)
        self._draw_brush_cursor()

    def start_processing(self) -> None:
        if self.video_path is None or self.mask is None or self.video_info is None:
            return
        if not np.any(self.mask):
            messagebox.showinfo(APP_NAME, "Сначала закрась ватермарк кистью.")
            return
        suggested = self.video_path.with_name(f"{self.video_path.stem}_clean.mp4")
        output = filedialog.asksaveasfilename(
            title="Куда сохранить готовое видео",
            defaultextension=".mp4",
            initialfile=suggested.name,
            filetypes=[("MP4 video", "*.mp4")],
        )
        if not output:
            return

        self.is_processing = True
        self.cancel_event.clear()
        self.progress.configure(value=0, maximum=max(1, self.video_info.frame_count))
        self.status.set("Подготовка…")
        self.process_button.configure(state=DISABLED)
        self.open_button.configure(state=DISABLED)
        self.cancel_button.configure(state=NORMAL)
        selected_mode = self.mode.get()
        selected_margin = self.margin.get()
        selected_radius = self.restore_radius.get()
        worker = threading.Thread(
            target=self._worker,
            args=(Path(output), self.mask.copy(), selected_mode, selected_margin, selected_radius),
            daemon=True,
        )
        worker.start()

    def _worker(
        self,
        output: Path,
        mask: np.ndarray,
        selected_mode: str,
        selected_margin: int,
        selected_radius: int,
    ) -> None:
        try:
            process_video(
                self.video_path,
                output,
                mask,
                mode=selected_mode,
                margin=selected_margin,
                inpaint_radius=selected_radius,
                progress=lambda current, total, text: self.events.put(("progress", current, total, text)),
                cancel_event=self.cancel_event,
            )
            self.events.put(("done", output))
        except ProcessingCancelled:
            self.events.put(("cancelled",))
        except Exception as exc:
            self.events.put(("error", str(exc)))

    def cancel_processing(self) -> None:
        self.cancel_event.set()
        self.status.set("Останавливаю…")
        self.cancel_button.configure(state=DISABLED)

    def _poll_events(self) -> None:
        try:
            while True:
                event = self.events.get_nowait()
                kind = event[0]
                if kind == "progress":
                    _, current, total, text = event
                    self.progress.configure(maximum=max(1, total), value=current)
                    percent = int(current * 100 / total) if total else 0
                    self.status.set(f"{text}: {percent}%")
                elif kind == "done":
                    self._finish_processing()
                    output = event[1]
                    self.status.set("Готово")
                    messagebox.showinfo(APP_NAME, f"Видео сохранено:\n{output}")
                elif kind == "cancelled":
                    self._finish_processing()
                    self.status.set("Обработка отменена")
                elif kind == "error":
                    self._finish_processing()
                    self.status.set("Ошибка")
                    messagebox.showerror(APP_NAME, event[1])
        except queue.Empty:
            pass
        self.root.after(100, self._poll_events)

    def _finish_processing(self) -> None:
        self.is_processing = False
        self.process_button.configure(state=NORMAL)
        self.open_button.configure(state=NORMAL)
        self.cancel_button.configure(state=DISABLED)


def main() -> None:
    root = tk.Tk()
    app = WatermarkCleanerApp(root)
    root.protocol("WM_DELETE_WINDOW", lambda: (app.cancel_event.set(), root.destroy()))
    root.mainloop()


if __name__ == "__main__":
    main()
