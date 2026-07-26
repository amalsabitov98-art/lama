import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/providers/infrastructure_providers.dart';

/// Supported app locales, in display order.
const List<Locale> kSupportedLocales = [
  Locale('uz'),
  Locale('ru'),
  Locale('en'),
];

/// Current UI language. A `null` value means "follow the system language".
///
/// Changing it rebuilds `MaterialApp` immediately — no restart needed — and
/// persists the choice via [PreferencesStore].
class LocaleController extends Notifier<Locale?> {
  @override
  Locale? build() => ref.watch(preferencesStoreProvider).readLocale();

  Future<void> setLocale(Locale? locale) async {
    await ref.read(preferencesStoreProvider).saveLocale(locale);
    state = locale;
  }
}

final localeControllerProvider =
    NotifierProvider<LocaleController, Locale?>(LocaleController.new);
