import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Persists user settings (locale + theme) in shared_preferences.
class PreferencesStore {
  const PreferencesStore(this._prefs);

  final SharedPreferences _prefs;

  static const _kLocaleKey = 'settings.locale';
  static const _kThemeModeKey = 'settings.theme_mode';

  /// Returns the saved locale, or `null` to follow the system language.
  Locale? readLocale() {
    final code = _prefs.getString(_kLocaleKey);
    if (code == null || code.isEmpty) return null;
    return Locale(code);
  }

  Future<void> saveLocale(Locale? locale) {
    if (locale == null) return _prefs.remove(_kLocaleKey);
    return _prefs.setString(_kLocaleKey, locale.languageCode);
  }

  ThemeMode readThemeMode() {
    final value = _prefs.getString(_kThemeModeKey);
    return switch (value) {
      'light' => ThemeMode.light,
      'dark' => ThemeMode.dark,
      _ => ThemeMode.system,
    };
  }

  Future<void> saveThemeMode(ThemeMode mode) {
    return _prefs.setString(_kThemeModeKey, mode.name);
  }
}
