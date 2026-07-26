import 'package:flutter/material.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';

/// Shown while the persisted session is being restored. The router redirects
/// away from it as soon as auth state is known.
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.terrain,
              size: 72,
              color: theme.colorScheme.primary,
            ),
            AppSpacing.gapLg,
            Text(l10n.appName, style: theme.textTheme.headlineMedium),
            AppSpacing.gapXxl,
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
