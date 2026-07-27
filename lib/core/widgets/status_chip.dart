import 'package:flutter/material.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';

/// Semantic tone for a [StatusChip].
enum StatusTone { neutral, positive, warning, danger, info }

/// A small colored pill for statuses (departures, bookings, payments…).
class StatusChip extends StatelessWidget {
  const StatusChip({
    required this.label,
    this.tone = StatusTone.neutral,
    this.icon,
    super.key,
  });

  final String label;
  final StatusTone tone;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final (bg, fg) = switch (tone) {
      StatusTone.positive => (const Color(0xFF3B8C57), Colors.white),
      StatusTone.warning => (const Color(0xFFCB8A16), Colors.white),
      StatusTone.danger => (scheme.error, scheme.onError),
      StatusTone.info => (scheme.secondaryContainer, scheme.onSecondaryContainer),
      StatusTone.neutral => (scheme.surfaceContainerHighest, scheme.onSurfaceVariant),
    };

    return Container(
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm, vertical: AppSpacing.xxs),
      decoration: BoxDecoration(color: bg, borderRadius: AppRadius.pillAll),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 13, color: fg),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: Theme.of(context)
                .textTheme
                .labelSmall
                ?.copyWith(color: fg, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
