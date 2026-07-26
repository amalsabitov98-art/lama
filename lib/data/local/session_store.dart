import 'package:shared_preferences/shared_preferences.dart';

/// Persists the current session (which user is signed in) in
/// shared_preferences. Settings such as locale and theme live in
/// [PreferencesStore].
class SessionStore {
  const SessionStore(this._prefs);

  final SharedPreferences _prefs;

  static const _kUserIdKey = 'session.user_id';

  int? readUserId() => _prefs.getInt(_kUserIdKey);

  Future<void> saveUserId(int userId) => _prefs.setInt(_kUserIdKey, userId);

  Future<void> clear() => _prefs.remove(_kUserIdKey);
}
