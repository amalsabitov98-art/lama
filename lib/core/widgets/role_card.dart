import 'package:flutter/material.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';

/// A tappable card used on the login screen to pick a role.
class RoleCard extends StatelessWidget {
  const RoleCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.color,
    super.key,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final accent = color ?? theme.colorScheme.primary;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: accent.withValues(alpha: 0.14),
                  borderRadius: AppRadius.mdAll,
                ),
                child: Icon(icon, color: accent, size: 28),
              ),
              AppSpacing.gapLg,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: theme.textTheme.titleMedium),
                    AppSpacing.gapXs,
                    Text(
                      subtitle,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              AppSpacing.gapSm,
              Icon(
                Icons.chevron_right,
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
