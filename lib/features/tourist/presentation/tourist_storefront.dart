import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';
import 'package:turon_tour/core/widgets/section_header.dart';
import 'package:turon_tour/core/widgets/tour_card.dart';
import 'package:turon_tour/domain/entities/tour.dart';
import 'package:turon_tour/features/auth/application/auth_controller.dart';
import 'package:turon_tour/features/tourist/application/tourist_providers.dart';
import 'package:turon_tour/features/tourist/presentation/tour_details_screen.dart';

/// Tourist home storefront: greeting, popular & upcoming carousels, and a
/// category-filtered catalogue.
class TouristStorefront extends ConsumerStatefulWidget {
  const TouristStorefront({super.key});

  @override
  ConsumerState<TouristStorefront> createState() => _TouristStorefrontState();
}

class _TouristStorefrontState extends ConsumerState<TouristStorefront> {
  String _category = 'all';

  void _openTour(Tour tour) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => TourDetailsScreen(tourId: tour.id)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final toursAsync = ref.watch(toursProvider);
    final nextDepartures = ref.watch(nextDeparturesProvider).valueOrNull ?? {};
    final user = ref.watch(authControllerProvider).valueOrNull;

    return toursAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('$e')),
      data: (tours) {
        final popular = [...tours]..sort((a, b) => b.rating.compareTo(a.rating));
        final upcoming = [...tours]..sort((a, b) {
            final da = nextDepartures[a.id];
            final db = nextDepartures[b.id];
            if (da == null && db == null) return 0;
            if (da == null) return 1;
            if (db == null) return -1;
            return da.compareTo(db);
          });
        final filtered = _category == 'all'
            ? tours
            : tours.where((t) => t.category == _category).toList();

        return ListView(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.xxl),
          children: [
            if (user != null)
              Text(
                l10n.greeting(user.fullName.split(' ').first),
                style: theme.textTheme.headlineSmall,
              ),
            AppSpacing.gapMd,

            SectionHeader(title: l10n.sectionPopular),
            _Carousel(tours: popular.take(6).toList(), onTap: _openTour),

            AppSpacing.gapLg,
            SectionHeader(title: l10n.sectionUpcoming),
            _Carousel(tours: upcoming.take(6).toList(), onTap: _openTour),

            AppSpacing.gapLg,
            SectionHeader(title: l10n.sectionByCategory),
            _CategoryChips(
              selected: _category,
              onSelected: (c) => setState(() => _category = c),
            ),
            AppSpacing.gapMd,
            if (filtered.isEmpty)
              Padding(
                padding: const EdgeInsets.all(AppSpacing.xl),
                child: Center(child: Text(l10n.noToursTitle)),
              )
            else
              for (final tour in filtered)
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.md),
                  child: TourCard(tour: tour, onTap: () => _openTour(tour)),
                ),
          ],
        );
      },
    );
  }
}

class _Carousel extends StatelessWidget {
  const _Carousel({required this.tours, required this.onTap});
  final List<Tour> tours;
  final void Function(Tour) onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 348,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: tours.length,
        separatorBuilder: (_, __) => AppSpacing.gapMd,
        itemBuilder: (context, i) => TourCard(
          tour: tours[i],
          width: 260,
          onTap: () => onTap(tours[i]),
        ),
      ),
    );
  }
}

class _CategoryChips extends StatelessWidget {
  const _CategoryChips({required this.selected, required this.onSelected});
  final String selected;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final categories = <String, String>{
      'all': l10n.categoryAll,
      'cultural': l10n.categoryCultural,
      'nature': l10n.categoryNature,
      'adventure': l10n.categoryAdventure,
      'city': l10n.categoryCity,
    };

    return Wrap(
      spacing: AppSpacing.sm,
      children: [
        for (final entry in categories.entries)
          ChoiceChip(
            label: Text(entry.value),
            selected: selected == entry.key,
            onSelected: (_) => onSelected(entry.key),
          ),
      ],
    );
  }
}
