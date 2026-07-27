import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/providers/infrastructure_providers.dart';
import 'package:turon_tour/domain/entities/tour.dart';
import 'package:turon_tour/features/auth/application/auth_controller.dart';

/// The full tour catalogue.
final toursProvider = FutureProvider<List<Tour>>((ref) {
  return ref.watch(tourRepositoryProvider).allTours();
});

/// Full details for a single tour.
final tourDetailsProvider =
    FutureProvider.family<TourDetails?, int>((ref, tourId) {
  return ref.watch(tourRepositoryProvider).tourDetails(tourId);
});

/// Earliest upcoming departure date per tour id.
final nextDeparturesProvider = FutureProvider<Map<int, DateTime>>((ref) {
  return ref.watch(tourRepositoryProvider).nextDepartureByTour();
});

/// The current tourist's wishlist (set of tour ids), with toggling.
class WishlistController extends AsyncNotifier<Set<int>> {
  int? get _userId => ref.read(authControllerProvider).valueOrNull?.id;

  @override
  Future<Set<int>> build() async {
    final userId = _userId;
    if (userId == null) return <int>{};
    return ref.read(tourRepositoryProvider).wishlistTourIds(userId);
  }

  Future<void> toggle(int tourId) async {
    final userId = _userId;
    if (userId == null) return;

    // Optimistic update.
    final current = {...(state.valueOrNull ?? <int>{})};
    final willAdd = !current.contains(tourId);
    if (willAdd) {
      current.add(tourId);
    } else {
      current.remove(tourId);
    }
    state = AsyncValue.data(current);

    await ref.read(tourRepositoryProvider).toggleWishlist(userId, tourId);
  }
}

final wishlistControllerProvider =
    AsyncNotifierProvider<WishlistController, Set<int>>(WishlistController.new);

/// Convenience: wishlisted tours as full objects.
final wishlistToursProvider = FutureProvider<List<Tour>>((ref) async {
  // Rebuilds when the wishlist set changes.
  ref.watch(wishlistControllerProvider);
  final userId = ref.read(authControllerProvider).valueOrNull?.id;
  if (userId == null) return const [];
  return ref.read(tourRepositoryProvider).wishlistTours(userId);
});
