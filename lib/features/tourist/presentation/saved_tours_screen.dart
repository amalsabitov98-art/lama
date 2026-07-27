import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';
import 'package:turon_tour/core/widgets/section_placeholder.dart';
import 'package:turon_tour/core/widgets/tour_card.dart';
import 'package:turon_tour/features/tourist/application/tourist_providers.dart';
import 'package:turon_tour/features/tourist/presentation/tour_details_screen.dart';

/// The tourist's saved (wishlisted) tours.
class SavedToursScreen extends ConsumerWidget {
  const SavedToursScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final toursAsync = ref.watch(wishlistToursProvider);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.savedTitle)),
      body: toursAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('$e')),
        data: (tours) {
          if (tours.isEmpty) {
            return SectionPlaceholder(
              icon: Icons.favorite_border,
              title: l10n.emptyWishlistTitle,
              message: l10n.emptyWishlistMessage,
            );
          }
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: [
              for (final tour in tours)
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.md),
                  child: TourCard(
                    tour: tour,
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => TourDetailsScreen(tourId: tour.id),
                      ),
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
