import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:turon_tour/data/db/app_database.dart';
import 'package:turon_tour/data/local/preferences_store.dart';
import 'package:turon_tour/data/local/session_store.dart';
import 'package:turon_tour/data/repositories/auth_repository_impl.dart';
import 'package:turon_tour/data/repositories/tour_repository_impl.dart';
import 'package:turon_tour/domain/repositories/auth_repository.dart';
import 'package:turon_tour/domain/repositories/tour_repository.dart';
import 'package:turon_tour/domain/usecases/get_current_user.dart';
import 'package:turon_tour/domain/usecases/sign_in_with_role.dart';
import 'package:turon_tour/domain/usecases/sign_out.dart';

/// Overridden in `main()` once [SharedPreferences] has been loaded.
final sharedPreferencesProvider = Provider<SharedPreferences>(
  (ref) => throw UnimplementedError('sharedPreferencesProvider not overridden'),
);

/// Single Drift database instance for the app lifetime.
final appDatabaseProvider = Provider<AppDatabase>((ref) {
  final db = AppDatabase();
  ref.onDispose(db.close);
  return db;
});

final sessionStoreProvider = Provider<SessionStore>(
  (ref) => SessionStore(ref.watch(sharedPreferencesProvider)),
);

final preferencesStoreProvider = Provider<PreferencesStore>(
  (ref) => PreferencesStore(ref.watch(sharedPreferencesProvider)),
);

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepositoryImpl(
    database: ref.watch(appDatabaseProvider),
    sessionStore: ref.watch(sessionStoreProvider),
  ),
);

final tourRepositoryProvider = Provider<TourRepository>(
  (ref) => TourRepositoryImpl(ref.watch(appDatabaseProvider)),
);

// Use cases.
final signInWithRoleProvider = Provider(
  (ref) => SignInWithRole(ref.watch(authRepositoryProvider)),
);
final signOutProvider = Provider(
  (ref) => SignOut(ref.watch(authRepositoryProvider)),
);
final getCurrentUserProvider = Provider(
  (ref) => GetCurrentUser(ref.watch(authRepositoryProvider)),
);
