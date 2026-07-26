import 'package:turon_tour/domain/entities/user_role.dart';

/// Centralised route locations for go_router.
abstract final class RoutePaths {
  static const splash = '/';
  static const login = '/login';
  static const touristHome = '/home/tourist';
  static const agentHome = '/home/agent';
  static const operatorHome = '/home/operator';

  /// The home location for a given role — used by the router's redirect.
  static String homeForRole(UserRole role) => switch (role) {
        UserRole.tourist => touristHome,
        UserRole.agent => agentHome,
        UserRole.operator => operatorHome,
      };

  static const homeLocations = {touristHome, agentHome, operatorHome};
}
