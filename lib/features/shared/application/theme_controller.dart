import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/providers/infrastructure_providers.dart';

/// Current theme mode (light / dark / system). Persisted and applied live.
class ThemeController extends Notifier<ThemeMode> {
  @override
  ThemeMode build() => ref.watch(preferencesStoreProvider).readThemeMode();

  Future<void> setThemeMode(ThemeMode mode) async {
    await ref.read(preferencesStoreProvider).saveThemeMode(mode);
    state = mode;
  }
}

final themeControllerProvider =
    NotifierProvider<ThemeController, ThemeMode>(ThemeController.new);
