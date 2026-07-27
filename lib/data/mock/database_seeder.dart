import 'package:drift/drift.dart';
import 'package:turon_tour/data/db/app_database.dart';
import 'package:turon_tour/data/db/tables.dart';
import 'package:turon_tour/data/mock/mock_accounts.dart';
import 'package:turon_tour/data/mock/mock_tours.dart';
import 'package:turon_tour/domain/entities/user_role.dart';

/// Seeds the mock data into Drift the first time the app runs (or after a
/// destructive schema upgrade).
///
/// Idempotent: if any users already exist the seeder does nothing, so it is
/// safe to call on every startup.
class DatabaseSeeder {
  const DatabaseSeeder(this._db);

  final AppDatabase _db;

  Future<void> seedIfEmpty() async {
    final existing = await _db.userDao.countUsers();
    if (existing > 0) return;

    await _db.transaction(() async {
      final touristId = await _seedAccounts();
      final tourIds = await _seedTours();
      await _seedTouristData(touristId, tourIds);
    });
  }

  /// Seeds the three role accounts. Returns the tourist's user id.
  Future<int> _seedAccounts() async {
    var touristId = 0;
    for (final account in kMockAccounts) {
      final userId = await _db.userDao.insertUser(
        UsersCompanion.insert(
          fullName: account.fullName,
          email: account.email,
          role: account.role.asDbValue,
        ),
      );

      if (account.role == UserRole.tourist) touristId = userId;

      if (account.role == UserRole.agent) {
        await _db.agentDao.insertAgent(
          AgentsCompanion.insert(
            userId: userId,
            agencyName: account.agencyName ?? 'Agency',
            creditLimit: Value(account.creditLimit),
            creditUsed: Value(account.creditUsed),
            commissionRate: Value(account.commissionRate),
          ),
        );
      }
    }
    return touristId;
  }

  /// Seeds the tour catalogue with departures and reviews.
  /// Returns the inserted tour ids, indexed like [kMockTours].
  Future<List<int>> _seedTours() async {
    final now = DateTime.now();
    final tourIds = <int>[];

    for (final tour in kMockTours) {
      final tourId = await _db.into(_db.tours).insert(
            ToursCompanion.insert(
              title: tour.title,
              shortDescription: tour.shortDescription,
              fullDescription: tour.fullDescription,
              aiSummary: tour.aiSummary,
              images: tour.images,
              highlights: tour.highlights,
              included: tour.included,
              excluded: tour.excluded,
              meetingLat: tour.meetingLat,
              meetingLng: tour.meetingLng,
              meetingAddress: tour.meetingAddress,
              meetingPhoto: tour.meetingPhoto,
              retailPrice: tour.retailPrice,
              netPrice: tour.netPrice,
              rating: Value(tour.rating),
              reviewsCount: Value(tour.reviewsCount),
              durationDays: tour.durationDays,
              category: tour.category,
              region: tour.region,
            ),
          );
      tourIds.add(tourId);

      for (final dep in tour.departures) {
        await _db.into(_db.seriesDepartures).insert(
              SeriesDeparturesCompanion.insert(
                tourId: tourId,
                departureDate: now.add(Duration(days: dep.daysFromNow)),
                totalSeats: dep.totalSeats,
                seatsLeft: dep.seatsLeft,
                status: dep.status,
                pricePerPerson: dep.pricePerPerson,
              ),
            );
      }

      for (final review in tour.reviews) {
        await _db.into(_db.reviews).insert(
              ReviewsCompanion.insert(
                tourId: tourId,
                author: review.author,
                rating: review.rating,
                text: review.text,
                date: now.subtract(Duration(days: review.daysAgo)),
              ),
            );
      }
    }

    return tourIds;
  }

  /// Seeds the mock tourist's bookings, payment plans, vouchers and wishlist.
  Future<void> _seedTouristData(int touristId, List<int> tourIds) async {
    if (touristId == 0) return;
    final now = DateTime.now();

    for (final booking in kMockTouristBookings) {
      final tourId = tourIds[booking.tourIndex];

      // Resolve the departure id for this tour by its ordinal index.
      final departures = await (_db.select(_db.seriesDepartures)
            ..where((d) => d.tourId.equals(tourId)))
          .get();
      if (booking.departureIndex >= departures.length) continue;
      final departureId = departures[booking.departureIndex].id;

      final totalPrice = booking.installments
          .fold<double>(0, (sum, i) => sum + i.amount);

      final bookingId = await _db.into(_db.bookings).insert(
            BookingsCompanion.insert(
              reference: booking.reference,
              userId: touristId,
              tourId: tourId,
              departureId: departureId,
              pax: booking.pax,
              totalPrice: totalPrice,
              status: booking.status,
              createdAt: now.subtract(Duration(days: booking.createdDaysAgo)),
            ),
          );

      for (final installment in booking.installments) {
        await _db.into(_db.paymentInstallments).insert(
              PaymentInstallmentsCompanion.insert(
                bookingId: bookingId,
                amount: installment.amount,
                dueDate: now.add(Duration(days: installment.dueInDays)),
                status: installment.status,
              ),
            );
      }

      await _db.into(_db.vouchers).insert(
            VouchersCompanion.insert(
              bookingId: bookingId,
              qrData: '${booking.reference}|${_hash(booking.reference)}',
              issuedAt: now.subtract(Duration(days: booking.createdDaysAgo)),
              status: booking.voucherStatus,
            ),
          );
    }

    for (final index in kMockWishlistTourIndexes) {
      if (index >= tourIds.length) continue;
      await _db.into(_db.wishlists).insert(
            WishlistsCompanion.insert(
              userId: touristId,
              tourId: tourIds[index],
            ),
          );
    }
  }

  /// Tiny deterministic hash used only to make the mock QR payload look real.
  String _hash(String input) {
    var h = 0;
    for (final unit in input.codeUnits) {
      h = (h * 31 + unit) & 0x7fffffff;
    }
    return h.toRadixString(16).padLeft(8, '0');
  }
}
