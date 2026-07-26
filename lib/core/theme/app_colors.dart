import 'package:flutter/material.dart';

/// Brand palette for Turon Tour.
///
/// A warm, Uzbekistan-inspired identity: terracotta and sand tones paired with
/// a turquoise accent (a nod to Samarkand tilework). These raw tokens feed the
/// Material 3 [ColorScheme]s in `app_theme.dart`; prefer reading colors from
/// `Theme.of(context).colorScheme` in widgets rather than using these directly.
abstract final class AppColors {
  // Primary — terracotta / clay.
  static const Color terracotta = Color(0xFFB84A2E);
  static const Color terracottaLight = Color(0xFFD9694A);
  static const Color terracottaDark = Color(0xFF8C3419);

  // Secondary — turquoise (Samarkand tile).
  static const Color turquoise = Color(0xFF1B9AAA);
  static const Color turquoiseLight = Color(0xFF52BFCB);
  static const Color turquoiseDark = Color(0xFF0E6F7C);

  // Tertiary — saffron / gold accent.
  static const Color saffron = Color(0xFFE0A02E);

  // Sand neutrals (light surfaces).
  static const Color sand50 = Color(0xFFFBF5EC);
  static const Color sand100 = Color(0xFFF4E9DA);
  static const Color sand200 = Color(0xFFE8D6BF);

  // Deep clay-brown neutrals (dark surfaces & text).
  static const Color clay900 = Color(0xFF241A14);
  static const Color clay800 = Color(0xFF32251C);
  static const Color clay700 = Color(0xFF443328);
  static const Color clayText = Color(0xFF3A2A20);

  // Semantic.
  static const Color success = Color(0xFF3B8C57);
  static const Color warning = Color(0xFFCB8A16);
  static const Color error = Color(0xFFBA1A1A);

  /// Light Material 3 color scheme built from the brand palette.
  static const ColorScheme light = ColorScheme(
    brightness: Brightness.light,
    primary: terracotta,
    onPrimary: Color(0xFFFFFFFF),
    primaryContainer: Color(0xFFFFDBCF),
    onPrimaryContainer: terracottaDark,
    secondary: turquoise,
    onSecondary: Color(0xFFFFFFFF),
    secondaryContainer: Color(0xFFB9EBF2),
    onSecondaryContainer: turquoiseDark,
    tertiary: saffron,
    onTertiary: Color(0xFF3A2A00),
    tertiaryContainer: Color(0xFFFFE0A6),
    onTertiaryContainer: Color(0xFF443100),
    error: error,
    onError: Color(0xFFFFFFFF),
    errorContainer: Color(0xFFFFDAD6),
    onErrorContainer: Color(0xFF410002),
    surface: sand50,
    onSurface: clayText,
    surfaceContainerHighest: sand200,
    onSurfaceVariant: clay700,
    outline: Color(0xFF8A7A6C),
    outlineVariant: sand200,
    inverseSurface: clay800,
    onInverseSurface: sand100,
    inversePrimary: terracottaLight,
    shadow: Color(0xFF000000),
    scrim: Color(0xFF000000),
    surfaceTint: terracotta,
  );

  /// Dark Material 3 color scheme built from the brand palette.
  static const ColorScheme dark = ColorScheme(
    brightness: Brightness.dark,
    primary: terracottaLight,
    onPrimary: Color(0xFF551700),
    primaryContainer: Color(0xFF722400),
    onPrimaryContainer: Color(0xFFFFDBCF),
    secondary: turquoiseLight,
    onSecondary: Color(0xFF00363D),
    secondaryContainer: turquoiseDark,
    onSecondaryContainer: Color(0xFFB9EBF2),
    tertiary: Color(0xFFF0C264),
    onTertiary: Color(0xFF3F2E00),
    tertiaryContainer: Color(0xFF5B4300),
    onTertiaryContainer: Color(0xFFFFE0A6),
    error: Color(0xFFFFB4AB),
    onError: Color(0xFF690005),
    errorContainer: Color(0xFF93000A),
    onErrorContainer: Color(0xFFFFDAD6),
    surface: clay900,
    onSurface: sand100,
    surfaceContainerHighest: clay700,
    onSurfaceVariant: sand200,
    outline: Color(0xFF9C8B7B),
    outlineVariant: clay700,
    inverseSurface: sand100,
    onInverseSurface: clay800,
    inversePrimary: terracotta,
    shadow: Color(0xFF000000),
    scrim: Color(0xFF000000),
    surfaceTint: terracottaLight,
  );
}
