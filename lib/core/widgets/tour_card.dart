import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/localization/localized_x.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';
import 'package:turon_tour/core/widgets/price_tag.dart';
import 'package:turon_tour/core/widgets/rating_stars.dart';
import 'package:turon_tour/core/widgets/tour_image.dart';
import 'package:turon_tour/domain/entities/tour.dart';
import 'package:turon_tour/features/tourist/application/tourist_providers.dart';

/// Large travel card used across the tourist storefront.
class TourCard extends ConsumerWidget {
  const TourCard({
    required this.tour,
    required this.onTap,
    this.width,
    super.key,
  });

  final Tour tour;
  final VoidCallback onTap;

  /// Fixed width for horizontal carousels; null = full width.
  final double? width;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final saved = ref.watch(wishlistControllerProvider).valueOrNull ?? <int>{};
    final isSaved = saved.contains(tour.id);

    return SizedBox(
      width: width,
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
                children: [
                  TourImage(url: tour.coverImage, height: 160, width: double.infinity),
                  if (tour.rating >= 4.7)
                    Positioned(
                      top: AppSpacing.sm,
                      left: AppSpacing.sm,
                      child: _Badge(text: l10n.badgeHit, color: theme.colorScheme.primary),
                    ),
                  Positioned(
                    top: AppSpacing.xs,
                    right: AppSpacing.xs,
                    child: _WishlistButton(
                      isSaved: isSaved,
                      onTap: () => ref
                          .read(wishlistControllerProvider.notifier)
                          .toggle(tour.id),
                    ),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      tour.title.of(context),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.titleMedium,
                    ),
                    AppSpacing.gapXs,
                    Row(
                      children: [
                        Icon(Icons.place_outlined,
                            size: 15, color: theme.colorScheme.onSurfaceVariant),
                        const SizedBox(width: 2),
                        Expanded(
                          child: Text(
                            tour.region,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                      ],
                    ),
                    AppSpacing.gapSm,
                    RatingStars(rating: tour.rating, reviewsCount: tour.reviewsCount),
                    AppSpacing.gapSm,
                    PriceTag(
                      amount: tour.retailPrice,
                      currency: tour.currency,
                      prefix: l10n.fromPrice,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge({required this.text, required this.color});
  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 2),
      decoration: BoxDecoration(color: color, borderRadius: AppRadius.smAll),
      child: Text(
        text,
        style: Theme.of(context)
            .textTheme
            .labelSmall
            ?.copyWith(color: Colors.white, fontWeight: FontWeight.w700),
      ),
    );
  }
}

class _WishlistButton extends StatelessWidget {
  const _WishlistButton({required this.isSaved, required this.onTap});
  final bool isSaved;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.black.withValues(alpha: 0.35),
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.sm),
          child: Icon(
            isSaved ? Icons.favorite : Icons.favorite_border,
            color: isSaved ? Colors.redAccent : Colors.white,
            size: 20,
          ),
        ),
      ),
    );
  }
}
