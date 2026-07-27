import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/localization/localized_x.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';
import 'package:turon_tour/core/utils/format.dart';
import 'package:turon_tour/core/widgets/price_tag.dart';
import 'package:turon_tour/core/widgets/rating_stars.dart';
import 'package:turon_tour/core/widgets/status_chip.dart';
import 'package:turon_tour/core/widgets/tour_image.dart';
import 'package:turon_tour/domain/entities/tour.dart';
import 'package:turon_tour/features/tourist/application/tourist_providers.dart';

/// Full tour details: gallery, sections, meeting point, reviews, departures.
class TourDetailsScreen extends ConsumerWidget {
  const TourDetailsScreen({required this.tourId, super.key});

  final int tourId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final detailsAsync = ref.watch(tourDetailsProvider(tourId));

    return Scaffold(
      body: detailsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('$e')),
        data: (details) {
          if (details == null) {
            return Center(child: Text(l10n.noToursTitle));
          }
          return _DetailsBody(details: details);
        },
      ),
      bottomNavigationBar: detailsAsync.valueOrNull == null
          ? null
          : _BookingBar(tourId: tourId),
    );
  }
}

class _DetailsBody extends StatelessWidget {
  const _DetailsBody({required this.details});
  final TourDetails details;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final tour = details.tour;

    return CustomScrollView(
      slivers: [
        SliverAppBar(
          pinned: true,
          expandedHeight: 280,
          flexibleSpace: FlexibleSpaceBar(
            background: _Gallery(images: tour.images),
          ),
          actions: [_WishlistAction(tourId: tour.id)],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(tour.title.of(context), style: theme.textTheme.headlineSmall),
                AppSpacing.gapSm,
                Row(
                  children: [
                    Icon(Icons.place_outlined,
                        size: 16, color: theme.colorScheme.onSurfaceVariant),
                    const SizedBox(width: 4),
                    Text(tour.region, style: theme.textTheme.bodyMedium),
                    const SizedBox(width: AppSpacing.md),
                    Icon(Icons.schedule,
                        size: 16, color: theme.colorScheme.onSurfaceVariant),
                    const SizedBox(width: 4),
                    Text(l10n.durationDaysLabel(tour.durationDays),
                        style: theme.textTheme.bodyMedium),
                  ],
                ),
                AppSpacing.gapSm,
                RatingStars(rating: tour.rating, reviewsCount: tour.reviewsCount),
                const Divider(height: AppSpacing.xl),

                _Section(
                  title: l10n.highlightsTitle,
                  child: _BulletList(items: tour.highlights.of(context)),
                ),
                _Section(
                  title: l10n.aboutTitle,
                  child: Text(tour.fullDescription.of(context),
                      style: theme.textTheme.bodyLarge),
                ),
                _Section(
                  title: l10n.includedTitle,
                  child: _BulletList(
                      items: tour.included.of(context), icon: Icons.check_circle,
                      color: theme.colorScheme.primary),
                ),
                _Section(
                  title: l10n.notIncludedTitle,
                  child: _BulletList(
                      items: tour.excluded.of(context), icon: Icons.cancel_outlined,
                      color: theme.colorScheme.onSurfaceVariant),
                ),
                _Section(
                  title: l10n.meetingPointTitle,
                  child: _MeetingPoint(tour: tour),
                ),
                _Section(
                  title: l10n.reviewsTitle,
                  child: _Reviews(details: details),
                ),
                _Section(
                  title: l10n.departuresTitle,
                  child: _Departures(departures: details.departures),
                ),
                const SizedBox(height: AppSpacing.xxl),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _Gallery extends StatelessWidget {
  const _Gallery({required this.images});
  final List<String> images;

  @override
  Widget build(BuildContext context) {
    if (images.isEmpty) return const TourImage(url: '');
    return PageView(
      children: [for (final url in images) TourImage(url: url)],
    );
  }
}

class _WishlistAction extends ConsumerWidget {
  const _WishlistAction({required this.tourId});
  final int tourId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saved = ref.watch(wishlistControllerProvider).valueOrNull ?? <int>{};
    final isSaved = saved.contains(tourId);
    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.sm),
      child: CircleAvatar(
        backgroundColor: Colors.black.withValues(alpha: 0.35),
        child: IconButton(
          icon: Icon(isSaved ? Icons.favorite : Icons.favorite_border,
              color: isSaved ? Colors.redAccent : Colors.white),
          onPressed: () =>
              ref.read(wishlistControllerProvider.notifier).toggle(tourId),
        ),
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.child});
  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xl),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: theme.textTheme.titleLarge),
          AppSpacing.gapMd,
          child,
        ],
      ),
    );
  }
}

class _BulletList extends StatelessWidget {
  const _BulletList({required this.items, this.icon, this.color});
  final List<String> items;
  final IconData? icon;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (final item in items)
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(icon ?? Icons.circle,
                    size: icon == null ? 6 : 18,
                    color: color ?? theme.colorScheme.primary),
                const SizedBox(width: AppSpacing.sm),
                Expanded(child: Text(item, style: theme.textTheme.bodyLarge)),
              ],
            ),
          ),
      ],
    );
  }
}

class _MeetingPoint extends StatelessWidget {
  const _MeetingPoint({required this.tour});
  final Tour tour;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: AppRadius.mdAll,
          child: TourImage(url: tour.meetingPhoto, height: 160, width: double.infinity),
        ),
        AppSpacing.gapMd,
        Row(
          children: [
            Icon(Icons.location_on, color: theme.colorScheme.primary),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Text(tour.meetingAddress.of(context),
                  style: theme.textTheme.bodyLarge),
            ),
          ],
        ),
        AppSpacing.gapXs,
        Text(
          '${tour.meetingLat.toStringAsFixed(4)}, ${tour.meetingLng.toStringAsFixed(4)}',
          style: theme.textTheme.bodySmall
              ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
        ),
      ],
    );
  }
}

class _Reviews extends StatelessWidget {
  const _Reviews({required this.details});
  final TourDetails details;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final locale = Localizations.localeOf(context).languageCode;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // AI summary block.
        Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: theme.colorScheme.secondaryContainer,
            borderRadius: AppRadius.mdAll,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.auto_awesome,
                      size: 18, color: theme.colorScheme.onSecondaryContainer),
                  const SizedBox(width: AppSpacing.sm),
                  Text(l10n.aiSummaryTitle,
                      style: theme.textTheme.titleSmall?.copyWith(
                          color: theme.colorScheme.onSecondaryContainer)),
                ],
              ),
              AppSpacing.gapSm,
              Text(details.tour.aiSummary.of(context),
                  style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSecondaryContainer)),
            ],
          ),
        ),
        AppSpacing.gapLg,
        for (final review in details.reviews)
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(review.author, style: theme.textTheme.titleSmall),
                    Text(formatDate(review.date, locale),
                        style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant)),
                  ],
                ),
                AppSpacing.gapXxs,
                RatingStars(rating: review.rating, size: 14, showValue: false),
                AppSpacing.gapXs,
                Text(review.body, style: theme.textTheme.bodyMedium),
              ],
            ),
          ),
      ],
    );
  }
}

class _Departures extends StatelessWidget {
  const _Departures({required this.departures});
  final List<TourDeparture> departures;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final locale = Localizations.localeOf(context).languageCode;

    return Column(
      children: [
        for (final dep in departures)
          Container(
            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              borderRadius: AppRadius.mdAll,
              border: Border.all(color: theme.colorScheme.outlineVariant),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(formatDate(dep.departureDate, locale),
                          style: theme.textTheme.titleMedium),
                      AppSpacing.gapXxs,
                      Text(
                        dep.soldOut
                            ? l10n.soldOut
                            : l10n.seatsLeftShort(dep.seatsLeft),
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: dep.almostFull
                              ? theme.colorScheme.error
                              : theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    _statusChip(l10n, dep.status),
                    AppSpacing.gapXs,
                    Text('${_money(dep.pricePerPerson, locale)} UZS',
                        style: theme.textTheme.titleSmall
                            ?.copyWith(color: theme.colorScheme.primary)),
                  ],
                ),
              ],
            ),
          ),
      ],
    );
  }

  String _money(double v, String locale) => formatMoney(v, locale);

  Widget _statusChip(AppLocalizations l10n, String status) {
    final (label, tone) = switch (status) {
      'confirmed' => (l10n.statusConfirmed, StatusTone.positive),
      'closed' => (l10n.statusClosed, StatusTone.danger),
      _ => (l10n.statusRecruiting, StatusTone.info),
    };
    return StatusChip(label: label, tone: tone);
  }
}

class _BookingBar extends ConsumerWidget {
  const _BookingBar({required this.tourId});
  final int tourId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: FilledButton.icon(
          onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(l10n.bookingComingSoon)),
          ),
          icon: const Icon(Icons.event_available),
          label: Text(l10n.bookNow),
        ),
      ),
    );
  }
}
