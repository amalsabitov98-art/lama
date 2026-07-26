/// The three roles the application supports.
///
/// Phase 1 only wires up authentication and role-based routing; the concrete
/// screens for each role are added in later phases.
enum UserRole {
  tourist,
  agent,
  operator;

  /// Stable string used for persistence (DB + shared_preferences).
  String get asDbValue => name;

  static UserRole fromDbValue(String value) {
    return UserRole.values.firstWhere(
      (role) => role.name == value,
      orElse: () => UserRole.tourist,
    );
  }
}
