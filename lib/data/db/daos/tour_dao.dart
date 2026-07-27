import 'package:drift/drift.dart';
import 'package:turon_tour/data/db/app_database.dart';
import 'package:turon_tour/data/db/tables.dart';

part 'tour_dao.g.dart';

@DriftAccessor(tables: [Tours, SeriesDepartures, Reviews, Wishlists])
class TourDao extends DatabaseAccessor<AppDatabase> with _$TourDaoMixin {
  TourDao(super.db);

  Future<List<Tour>> allTours() => select(tours).get();

  Future<Tour?> tourById(int id) =>
      (select(tours)..where((t) => t.id.equals(id))).getSingleOrNull();

  Future<List<Tour>> toursByIds(List<int> ids) {
    if (ids.isEmpty) return Future.value(const []);
    return (select(tours)..where((t) => t.id.isIn(ids))).get();
  }

  Future<List<SeriesDeparture>> allDepartures() {
    return (select(seriesDepartures)
          ..orderBy([(d) => OrderingTerm.asc(d.departureDate)]))
        .get();
  }

  Future<List<SeriesDeparture>> departuresForTour(int tourId) {
    return (select(seriesDepartures)
          ..where((d) => d.tourId.equals(tourId))
          ..orderBy([(d) => OrderingTerm.asc(d.departureDate)]))
        .get();
  }

  Future<List<Review>> reviewsForTour(int tourId) {
    return (select(reviews)
          ..where((r) => r.tourId.equals(tourId))
          ..orderBy([(r) => OrderingTerm.desc(r.date)]))
        .get();
  }

  Future<List<int>> wishlistTourIds(int userId) async {
    final rows =
        await (select(wishlists)..where((w) => w.userId.equals(userId))).get();
    return rows.map((w) => w.tourId).toList();
  }

  Future<bool> isWishlisted(int userId, int tourId) async {
    final row = await (select(wishlists)
          ..where((w) => w.userId.equals(userId) & w.tourId.equals(tourId)))
        .getSingleOrNull();
    return row != null;
  }

  Future<void> addWishlist(int userId, int tourId) {
    return into(wishlists).insert(
      WishlistsCompanion.insert(userId: userId, tourId: tourId),
      mode: InsertMode.insertOrIgnore,
    );
  }

  Future<void> removeWishlist(int userId, int tourId) {
    return (delete(wishlists)
          ..where((w) => w.userId.equals(userId) & w.tourId.equals(tourId)))
        .go();
  }
}
