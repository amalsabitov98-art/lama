import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:turon_tour/core/router/route_paths.dart';
import 'package:turon_tour/features/auth/application/auth_controller.dart';
import 'package:turon_tour/features/auth/presentation/login_screen.dart';
import 'package:turon_tour/features/operator/presentation/operator_home_screen.dart';
import 'package:turon_tour/features/shared/presentation/splash_screen.dart';
import 'package:turon_tour/features/agent/presentation/agent_home_screen.dart';
import 'package:turon_tour/features/tourist/presentation/tourist_home_screen.dart';

/// The app's [GoRouter], wired with a role-aware redirect guard.
final routerProvider = Provider<GoRouter>((ref) {
  // Bridge Riverpod auth-state changes to go_router's refreshListenable so the
  // redirect below re-runs whenever the user signs in or out.
  final refresh = ValueNotifier<int>(0);
  ref.onDispose(refresh.dispose);
  ref.listen(authControllerProvider, (_, __) => refresh.value++);

  return GoRouter(
    initialLocation: RoutePaths.splash,
    refreshListenable: refresh,
    debugLogDiagnostics: kDebugMode,
    redirect: (context, state) {
      final auth = ref.read(authControllerProvider);
      final location = state.matchedLocation;

      // Still restoring the persisted session (loading with no known value yet)
      // → hold on the splash screen.
      if (auth.isLoading && !auth.hasValue) {
        return location == RoutePaths.splash ? null : RoutePaths.splash;
      }

      final user = auth.valueOrNull;
      final isLoggingIn = location == RoutePaths.login;

      // Signed out → force the login screen.
      if (user == null) {
        return isLoggingIn ? null : RoutePaths.login;
      }

      // Signed in → keep the user on their own role's home; bounce away from
      // splash, login, or another role's route.
      final home = RoutePaths.homeForRole(user.role);
      if (location == home) return null;
      return home;
    },
    routes: [
      GoRoute(
        path: RoutePaths.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: RoutePaths.login,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: RoutePaths.touristHome,
        builder: (context, state) => const TouristHomeScreen(),
      ),
      GoRoute(
        path: RoutePaths.agentHome,
        builder: (context, state) => const AgentHomeScreen(),
      ),
      GoRoute(
        path: RoutePaths.operatorHome,
        builder: (context, state) => const OperatorHomeScreen(),
      ),
    ],
  );
});
