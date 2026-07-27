import 'package:drift/drift.dart';
import 'package:turon_tour/data/db/converters.dart';
import 'package:turon_tour/domain/entities/localized.dart';

/// Users table — every account, regardless of role.
///
/// Later phases will add booking / tour / payment tables alongside this one;
/// Phase 1 keeps only what authentication needs.
class Users extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get fullName => text().withLength(min: 1, max: 120)();
  TextColumn get email => text().withLength(min: 3, max: 160).unique()();

  /// One of [UserRole] values, stored as its `name`.
  TextColumn get role => text().withLength(min: 1, max: 20)();
}

/// Agent-specific data, one row per user with the agent role.
class Agents extends Table {
  IntColumn get id => integer().autoIncrement()();

  /// FK → [Users.id].
  IntColumn get userId =>
      integer().references(Users, #id, onDelete: KeyAction.cascade).unique()();

  TextColumn get agencyName => text().withLength(min: 1, max: 160)();
  RealColumn get creditLimit => real().withDefault(const Constant(0))();
  RealColumn get creditUsed => real().withDefault(const Constant(0))();

  /// Commission fraction, e.g. 0.10 for 10%.
  RealColumn get commissionRate => real().withDefault(const Constant(0))();
}

// ---------------------------------------------------------------------------
// Phase 2 — Tourist domain
// ---------------------------------------------------------------------------

/// A bookable tour product. Localized fields are stored per-language via
/// [LocalizedText] / [LocalizedList] converters and resolved at display time.
class Tours extends Table {
  IntColumn get id => integer().autoIncrement()();

  TextColumn get title => text().map(const LocalizedTextConverter())();
  TextColumn get shortDescription =>
      text().map(const LocalizedTextConverter())();
  TextColumn get fullDescription =>
      text().map(const LocalizedTextConverter())();

  /// Mock "AI summary" of the reviews, shown at the top of the reviews block.
  TextColumn get aiSummary => text().map(const LocalizedTextConverter())();

  /// Gallery image references (asset paths or placeholder URLs).
  TextColumn get images => text().map(const StringListConverter())();

  TextColumn get highlights => text().map(const LocalizedListConverter())();
  TextColumn get included => text().map(const LocalizedListConverter())();
  TextColumn get excluded => text().map(const LocalizedListConverter())();

  // Meeting point.
  RealColumn get meetingLat => real()();
  RealColumn get meetingLng => real()();
  TextColumn get meetingAddress =>
      text().map(const LocalizedTextConverter())();
  TextColumn get meetingPhoto => text()();

  RealColumn get retailPrice => real()();
  RealColumn get netPrice => real()();
  TextColumn get currency => text().withDefault(const Constant('UZS'))();

  RealColumn get rating => real().withDefault(const Constant(0))();
  IntColumn get reviewsCount => integer().withDefault(const Constant(0))();

  IntColumn get durationDays => integer()();

  /// cultural / nature / adventure / city
  TextColumn get category => text()();
  TextColumn get region => text()();
}

/// A scheduled group departure (series) for a [Tours] row.
class SeriesDepartures extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get tourId =>
      integer().references(Tours, #id, onDelete: KeyAction.cascade)();

  DateTimeColumn get departureDate => dateTime()();
  IntColumn get totalSeats => integer()();
  IntColumn get seatsLeft => integer()();

  /// recruiting / confirmed / closed
  TextColumn get status => text()();
  RealColumn get pricePerPerson => real()();
}

/// A tourist booking for a specific departure.
class Bookings extends Table {
  IntColumn get id => integer().autoIncrement()();

  /// Human-facing reference, format `TT-XXXXXX`.
  TextColumn get reference => text().unique()();

  IntColumn get userId => integer().references(Users, #id)();
  IntColumn get tourId => integer().references(Tours, #id)();
  IntColumn get departureId => integer().references(SeriesDepartures, #id)();

  IntColumn get pax => integer()();
  RealColumn get totalPrice => real()();

  /// Booking channel — `direct` for tourists (agents come in a later phase).
  TextColumn get channel => text().withDefault(const Constant('direct'))();

  /// pending / confirmed / completed / cancelled
  TextColumn get status => text()();
  DateTimeColumn get createdAt => dateTime()();
}

/// One installment of a booking's payment plan.
class PaymentInstallments extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get bookingId =>
      integer().references(Bookings, #id, onDelete: KeyAction.cascade)();

  RealColumn get amount => real()();
  DateTimeColumn get dueDate => dateTime()();

  /// paid / pending / overdue
  TextColumn get status => text()();
}

/// A mobile voucher issued for a confirmed booking.
class Vouchers extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get bookingId => integer()
      .references(Bookings, #id, onDelete: KeyAction.cascade)
      .unique()();

  /// Data encoded into the QR code (reference + hash).
  TextColumn get qrData => text()();
  DateTimeColumn get issuedAt => dateTime()();

  /// active / used
  TextColumn get status => text()();
}

/// A single review left on a tour.
class Reviews extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get tourId =>
      integer().references(Tours, #id, onDelete: KeyAction.cascade)();

  TextColumn get author => text()();
  RealColumn get rating => real()();
  TextColumn get body => text()();
  DateTimeColumn get date => dateTime()();
}

/// Wishlist join table: which user saved which tour.
class Wishlists extends Table {
  IntColumn get userId =>
      integer().references(Users, #id, onDelete: KeyAction.cascade)();
  IntColumn get tourId =>
      integer().references(Tours, #id, onDelete: KeyAction.cascade)();

  @override
  Set<Column<Object>> get primaryKey => {userId, tourId};
}
