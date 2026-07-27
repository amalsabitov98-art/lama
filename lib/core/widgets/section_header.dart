import 'package:flutter/material.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';

/// A titled section header with an optional trailing action.
class SectionHeader extends StatelessWidget {
  const SectionHeader({
    required this.title,
    this.action,
    super.key,
  });

  final String title;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
      child: Row(
        children: [
          Expanded(
            child: Text(title, style: theme.textTheme.titleLarge),
          ),
          if (action != null) action!,
        ],
      ),
    );
  }
}
