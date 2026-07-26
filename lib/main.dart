import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:turon_tour/app.dart';
import 'package:turon_tour/core/providers/infrastructure_providers.dart';
import 'package:turon_tour/data/db/app_database.dart';
import 'package:turon_tour/data/mock/database_seeder.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load persisted settings/session and open the database up front so the
  // first frame already knows the locale, theme and auth state.
  final prefs = await SharedPreferences.getInstance();
  final database = AppDatabase();

  // Seed the 3 mock accounts on first launch (idempotent).
  await DatabaseSeeder(database).seedIfEmpty();

  runApp(
    ProviderScope(
      overrides: [
        sharedPreferencesProvider.overrideWithValue(prefs),
        appDatabaseProvider.overrideWithValue(database),
      ],
      child: const TuronTourApp(),
    ),
  );
}
