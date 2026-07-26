import 'package:drift/drift.dart';
import 'package:turon_tour/data/db/app_database.dart';
import 'package:turon_tour/data/db/tables.dart';

part 'agent_dao.g.dart';

@DriftAccessor(tables: [Agents])
class AgentDao extends DatabaseAccessor<AppDatabase> with _$AgentDaoMixin {
  AgentDao(super.db);

  Future<Agent?> findByUserId(int userId) {
    return (select(agents)..where((a) => a.userId.equals(userId)))
        .getSingleOrNull();
  }

  Future<int> insertAgent(AgentsCompanion agent) => into(agents).insert(agent);
}
