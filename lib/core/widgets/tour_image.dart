import 'package:flutter/material.dart';

/// Network image with graceful loading and error placeholders.
///
/// Tour photos are placeholder URLs; when offline or blocked, a soft branded
/// block is shown instead of a broken-image icon.
class TourImage extends StatelessWidget {
  const TourImage({
    required this.url,
    this.fit = BoxFit.cover,
    this.height,
    this.width,
    super.key,
  });

  final String url;
  final BoxFit fit;
  final double? height;
  final double? width;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final placeholder = Container(
      height: height,
      width: width,
      color: theme.colorScheme.secondaryContainer,
      alignment: Alignment.center,
      child: Icon(
        Icons.landscape_outlined,
        color: theme.colorScheme.onSecondaryContainer.withValues(alpha: 0.6),
        size: 40,
      ),
    );

    if (url.isEmpty) return placeholder;

    return Image.network(
      url,
      height: height,
      width: width,
      fit: fit,
      loadingBuilder: (context, child, progress) {
        if (progress == null) return child;
        return Container(
          height: height,
          width: width,
          color: theme.colorScheme.surfaceContainerHighest,
          alignment: Alignment.center,
          child: const SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
        );
      },
      errorBuilder: (context, error, stack) => placeholder,
    );
  }
}
