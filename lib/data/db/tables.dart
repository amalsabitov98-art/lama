import 'package:drift/drift.dart';

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
