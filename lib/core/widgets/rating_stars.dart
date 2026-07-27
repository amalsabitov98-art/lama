import 'package:flutter/material.dart';
import 'package:turon_tour/core/theme/app_colors.dart';

/// A compact star-rating row with an optional numeric value / review count.
class RatingStars extends StatelessWidget {
  const RatingStars({
    required this.rating,
    this.reviewsCount,
    this.size = 16,
    this.showValue = true,
    super.key,
  });

  final double rating;
  final int? reviewsCount;
  final double size;
  final bool showValue;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final full = rating.floor();
    final hasHalf = (rating - full) >= 0.5;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 0; i < 5; i++)
          Icon(
            i < full
                ? Icons.star_rounded
                : (i == full && hasHalf
                    ? Icons.star_half_rounded
                    : Icons.star_outline_rounded),
            size: size,
            color: AppColors.saffron,
          ),
        if (showValue) ...[
          const SizedBox(width: 4),
          Text(
            rating.toStringAsFixed(1),
            style: theme.textTheme.labelMedium
                ?.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
        if (reviewsCount != null) ...[
          const SizedBox(width: 4),
          Text(
            '($reviewsCount)',
            style: theme.textTheme.labelMedium
                ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
          ),
        ],
      ],
    );
  }
}
