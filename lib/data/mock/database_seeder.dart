import 'package:drift/drift.dart';
import 'package:turon_tour/data/db/app_database.dart';
import 'package:turon_tour/data/db/tables.dart';
import 'package:turon_tour/data/mock/mock_accounts.dart';
import 'package:turon_tour/domain/entities/user_role.dart';

/// Seeds the mock accounts into Drift the first time the app runs.
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
      for (final account in kMockAccounts) {
        final userId = await _db.userDao.insertUser(
          UsersCompanion.insert(
            fullName: account.fullName,
            email: account.email,
            role: account.role.asDbValue,
          ),
        );

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
    });
  }
}
