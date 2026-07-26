import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/providers/infrastructure_providers.dart';
import 'package:turon_tour/domain/entities/user.dart';
import 'package:turon_tour/domain/entities/user_role.dart';

/// Holds the authentication state for the whole app.
///
/// `build()` restores any persisted session; the router watches this provider
/// to decide where to send the user. A `null` value means "signed out".
class AuthController extends AsyncNotifier<User?> {
  @override
  Future<User?> build() async {
    final getCurrentUser = ref.watch(getCurrentUserProvider);
    return getCurrentUser();
  }

  Future<void> signIn(UserRole role) async {
    final signInWithRole = ref.read(signInWithRoleProvider);
    // Keep the previous value while loading so the router doesn't bounce to the
    // splash screen mid sign-in — it only treats a value-less loading state as
    // "restoring session".
    state = const AsyncValue<User?>.loading().copyWithPrevious(state);
    state = await AsyncValue.guard(() => signInWithRole(role));
  }

  Future<void> signOut() async {
    final signOut = ref.read(signOutProvider);
    await signOut();
    state = const AsyncValue.data(null);
  }
}

final authControllerProvider =
    AsyncNotifierProvider<AuthController, User?>(AuthController.new);
