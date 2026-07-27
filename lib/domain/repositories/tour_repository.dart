import 'package:turon_tour/domain/entities/tour.dart';

/// Read/write access to tours, departures, reviews and the wishlist.
abstract interface class TourRepository {
  /// All tours in the catalogue.
  Future<List<Tour>> allTours();

  /// Full details (tour + departures + reviews) for [tourId].
  Future<TourDetails?> tourDetails(int tourId);

  /// The earliest upcoming departure date per tour id.
  Future<Map<int, DateTime>> nextDepartureByTour();

  /// The set of tour ids the user has wishlisted.
  Future<Set<int>> wishlistTourIds(int userId);

  /// Tours the user has wishlisted, as full objects.
  Future<List<Tour>> wishlistTours(int userId);

  /// Toggles a tour in the user's wishlist; returns the new state
  /// (`true` = now saved).
  Future<bool> toggleWishlist(int userId, int tourId);
}
