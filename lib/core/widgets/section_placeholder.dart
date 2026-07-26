import 'package:flutter/material.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';

/// A friendly "under development" placeholder used by the role home screens
/// until their real content lands in later phases.
class SectionPlaceholder extends StatelessWidget {
  const SectionPlaceholder({
    required this.icon,
    required this.title,
    required this.message,
    super.key,
  });

  final IconData icon;
  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(AppSpacing.xl),
              decoration: BoxDecoration(
                color: theme.colorScheme.secondaryContainer,
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: 56,
                color: theme.colorScheme.onSecondaryContainer,
              ),
            ),
            AppSpacing.gapXl,
            Text(
              title,
              textAlign: TextAlign.center,
              style: theme.textTheme.headlineSmall,
            ),
            AppSpacing.gapSm,
            Text(
              message,
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
