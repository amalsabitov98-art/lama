import 'package:flutter/material.dart';

/// Typography for Turon Tour.
///
/// Phase 1 uses the platform default type family, which renders both Cyrillic
/// (ru/uz) and Latin (uz/en) cleanly across iOS and Android — so no font
/// assets are bundled yet. To adopt a branded family later, add the font files
/// under `assets/fonts/`, declare them in `pubspec.yaml`, and pass the family
/// name to [build] via `fontFamily`.
abstract final class AppTypography {
  /// Builds a [TextTheme] tuned for the brand, tinted for the given [onSurface]
  /// color so it works in both light and dark schemes.
  static TextTheme build(Color onSurface, {String? fontFamily}) {
    final base = Typography.material2021().black.apply(
          fontFamily: fontFamily,
          bodyColor: onSurface,
          displayColor: onSurface,
        );

    return base.copyWith(
      displaySmall: base.displaySmall?.copyWith(
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
      ),
      headlineMedium: base.headlineMedium?.copyWith(
        fontWeight: FontWeight.w700,
        letterSpacing: -0.25,
      ),
      headlineSmall: base.headlineSmall?.copyWith(
        fontWeight: FontWeight.w600,
      ),
      titleLarge: base.titleLarge?.copyWith(
        fontWeight: FontWeight.w600,
      ),
      titleMedium: base.titleMedium?.copyWith(
        fontWeight: FontWeight.w600,
      ),
      labelLarge: base.labelLarge?.copyWith(
        fontWeight: FontWeight.w600,
        letterSpacing: 0.3,
      ),
      bodyLarge: base.bodyLarge?.copyWith(height: 1.4),
      bodyMedium: base.bodyMedium?.copyWith(height: 1.4),
    );
  }
}
