import 'package:flutter/material.dart';
import 'package:turon_tour/core/theme/app_colors.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';
import 'package:turon_tour/core/theme/app_typography.dart';

/// Assembles the light and dark [ThemeData] from the brand tokens.
///
/// Everything here is derived from `AppColors`, `AppSpacing`, `AppRadius` and
/// `AppTypography`, so re-skinning the app is a matter of editing those token
/// files rather than hunting through widgets.
abstract final class AppTheme {
  static ThemeData get light => _build(AppColors.light);
  static ThemeData get dark => _build(AppColors.dark);

  static ThemeData _build(ColorScheme scheme) {
    final textTheme = AppTypography.build(scheme.onSurface);

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: scheme.surface,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: scheme.surface,
        foregroundColor: scheme.onSurface,
        elevation: AppElevation.none,
        scrolledUnderElevation: AppElevation.low,
        centerTitle: false,
        titleTextStyle: textTheme.titleLarge,
      ),
      cardTheme: CardThemeData(
        elevation: AppElevation.none,
        color: scheme.surface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.lgAll,
          side: BorderSide(color: scheme.outlineVariant),
        ),
        margin: EdgeInsets.zero,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(52),
          textStyle: textTheme.labelLarge,
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.mdAll),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size.fromHeight(52),
          textStyle: textTheme.labelLarge,
          side: BorderSide(color: scheme.outline),
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.mdAll),
        ),
      ),
      listTileTheme: const ListTileThemeData(
        shape: RoundedRectangleBorder(borderRadius: AppRadius.mdAll),
        contentPadding: EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.xs,
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: scheme.surface,
        indicatorColor: scheme.secondaryContainer,
        elevation: AppElevation.low,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      ),
      dividerTheme: DividerThemeData(
        color: scheme.outlineVariant,
        space: AppSpacing.lg,
        thickness: 1,
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: const RoundedRectangleBorder(borderRadius: AppRadius.mdAll),
        backgroundColor: scheme.inverseSurface,
        contentTextStyle: textTheme.bodyMedium?.copyWith(
          color: scheme.onInverseSurface,
        ),
      ),
    );
  }
}
