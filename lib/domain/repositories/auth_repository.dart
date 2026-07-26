import 'package:turon_tour/domain/entities/user.dart';
import 'package:turon_tour/domain/entities/user_role.dart';

/// Abstract authentication contract.
///
/// The presentation and domain layers depend on this interface only; the
/// concrete implementation (Drift-backed, mock accounts) lives in the data
/// layer.
abstract interface class AuthRepository {
  /// Returns the currently signed-in user, or `null` if there is no session.
  Future<User?> currentUser();

  /// Signs in with the mock account bound to [role] and persists the session.
  ///
  /// Phase 1 has exactly one seeded account per role and no passwords.
  Future<User> signInWithRole(UserRole role);

  /// Clears the persisted session.
  Future<void> signOut();
}
