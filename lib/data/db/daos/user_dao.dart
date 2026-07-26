import 'package:drift/drift.dart';
import 'package:turon_tour/data/db/app_database.dart';
import 'package:turon_tour/data/db/tables.dart';

part 'user_dao.g.dart';

@DriftAccessor(tables: [Users])
class UserDao extends DatabaseAccessor<AppDatabase> with _$UserDaoMixin {
  UserDao(super.db);

  Future<int> countUsers() async {
    final count = countAll();
    final query = selectOnly(users)..addColumns([count]);
    final row = await query.getSingle();
    return row.read(count) ?? 0;
  }

  Future<User?> findByRole(String role) {
    return (select(users)..where((u) => u.role.equals(role)))
        .getSingleOrNull();
  }

  Future<User?> findById(int id) {
    return (select(users)..where((u) => u.id.equals(id))).getSingleOrNull();
  }

  Future<int> insertUser(UsersCompanion user) => into(users).insert(user);
}
