import 'package:turon_tour/data/db/app_database.dart' as db;
import 'package:turon_tour/data/local/session_store.dart';
import 'package:turon_tour/domain/entities/agent_profile.dart';
import 'package:turon_tour/domain/entities/user.dart';
import 'package:turon_tour/domain/entities/user_role.dart';
import 'package:turon_tour/domain/repositories/auth_repository.dart';

/// Drift-backed [AuthRepository] using the seeded mock accounts.
///
/// There are no passwords in Phase 1: signing in with a role simply resolves
/// the single seeded account for that role and stores its id in the session.
class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl({
    required db.AppDatabase database,
    required SessionStore sessionStore,
  })  : _db = database,
        _session = sessionStore;

  final db.AppDatabase _db;
  final SessionStore _session;

  @override
  Future<User?> currentUser() async {
    final userId = _session.readUserId();
    if (userId == null) return null;

    final row = await _db.userDao.findById(userId);
    if (row == null) return null;

    return _toEntity(row);
  }

  @override
  Future<User> signInWithRole(UserRole role) async {
    final row = await _db.userDao.findByRole(role.asDbValue);
    if (row == null) {
      throw StateError('No seeded account for role ${role.asDbValue}');
    }

    await _session.saveUserId(row.id);
    return _toEntity(row);
  }

  @override
  Future<void> signOut() => _session.clear();

  Future<User> _toEntity(db.User row) async {
    final role = UserRole.fromDbValue(row.role);

    AgentProfile? agentProfile;
    if (role == UserRole.agent) {
      final agent = await _db.agentDao.findByUserId(row.id);
      if (agent != null) {
        agentProfile = AgentProfile(
          agencyName: agent.agencyName,
          creditLimit: agent.creditLimit,
          creditUsed: agent.creditUsed,
          commissionRate: agent.commissionRate,
        );
      }
    }

    return User(
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      role: role,
      agentProfile: agentProfile,
    );
  }
}
