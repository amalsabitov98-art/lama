import 'package:turon_tour/data/db/app_database.dart' as db;
import 'package:turon_tour/domain/entities/tour.dart';
import 'package:turon_tour/domain/repositories/tour_repository.dart';

/// Drift-backed [TourRepository].
class TourRepositoryImpl implements TourRepository {
  TourRepositoryImpl(this._db);

  final db.AppDatabase _db;

  @override
  Future<List<Tour>> allTours() async {
    final rows = await _db.tourDao.allTours();
    return rows.map(_toTour).toList();
  }

  @override
  Future<TourDetails?> tourDetails(int tourId) async {
    final row = await _db.tourDao.tourById(tourId);
    if (row == null) return null;

    final departures = await _db.tourDao.departuresForTour(tourId);
    final reviews = await _db.tourDao.reviewsForTour(tourId);

    return TourDetails(
      tour: _toTour(row),
      departures: departures.map(_toDeparture).toList(),
      reviews: reviews.map(_toReview).toList(),
    );
  }

  @override
  Future<Map<int, DateTime>> nextDepartureByTour() async {
    final rows = await _db.tourDao.allDepartures();
    final map = <int, DateTime>{};
    for (final r in rows) {
      final existing = map[r.tourId];
      if (existing == null || r.departureDate.isBefore(existing)) {
        map[r.tourId] = r.departureDate;
      }
    }
    return map;
  }

  @override
  Future<Set<int>> wishlistTourIds(int userId) async {
    final ids = await _db.tourDao.wishlistTourIds(userId);
    return ids.toSet();
  }

  @override
  Future<List<Tour>> wishlistTours(int userId) async {
    final ids = await _db.tourDao.wishlistTourIds(userId);
    final rows = await _db.tourDao.toursByIds(ids);
    return rows.map(_toTour).toList();
  }

  @override
  Future<bool> toggleWishlist(int userId, int tourId) async {
    final isSaved = await _db.tourDao.isWishlisted(userId, tourId);
    if (isSaved) {
      await _db.tourDao.removeWishlist(userId, tourId);
      return false;
    }
    await _db.tourDao.addWishlist(userId, tourId);
    return true;
  }

  Tour _toTour(db.Tour r) => Tour(
        id: r.id,
        title: r.title,
        shortDescription: r.shortDescription,
        fullDescription: r.fullDescription,
        aiSummary: r.aiSummary,
        images: r.images,
        highlights: r.highlights,
        included: r.included,
        excluded: r.excluded,
        meetingLat: r.meetingLat,
        meetingLng: r.meetingLng,
        meetingAddress: r.meetingAddress,
        meetingPhoto: r.meetingPhoto,
        retailPrice: r.retailPrice,
        netPrice: r.netPrice,
        currency: r.currency,
        rating: r.rating,
        reviewsCount: r.reviewsCount,
        durationDays: r.durationDays,
        category: r.category,
        region: r.region,
      );

  TourDeparture _toDeparture(db.SeriesDeparture r) => TourDeparture(
        id: r.id,
        tourId: r.tourId,
        departureDate: r.departureDate,
        totalSeats: r.totalSeats,
        seatsLeft: r.seatsLeft,
        status: r.status,
        pricePerPerson: r.pricePerPerson,
      );

  TourReview _toReview(db.Review r) => TourReview(
        id: r.id,
        author: r.author,
        rating: r.rating,
        body: r.body,
        date: r.date,
      );
}
