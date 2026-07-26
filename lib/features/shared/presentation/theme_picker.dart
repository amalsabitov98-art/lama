import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/features/shared/application/theme_controller.dart';

/// Human-readable label for a [ThemeMode].
String themeModeLabel(AppLocalizations l10n, ThemeMode mode) {
  return switch (mode) {
    ThemeMode.light => l10n.themeLight,
    ThemeMode.dark => l10n.themeDark,
    ThemeMode.system => l10n.themeSystem,
  };
}

/// Bottom sheet to switch the theme. Applies immediately.
Future<void> showThemePicker(BuildContext context, WidgetRef ref) {
  final l10n = AppLocalizations.of(context);
  final current = ref.read(themeControllerProvider);

  return showModalBottomSheet<void>(
    context: context,
    showDragHandle: true,
    builder: (context) {
      return SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              title: Text(
                l10n.appearance,
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
            for (final mode in ThemeMode.values)
              RadioListTile<ThemeMode>(
                value: mode,
                groupValue: current,
                title: Text(themeModeLabel(l10n, mode)),
                onChanged: (value) {
                  if (value == null) return;
                  ref
                      .read(themeControllerProvider.notifier)
                      .setThemeMode(value);
                  Navigator.of(context).pop();
                },
              ),
          ],
        ),
      );
    },
  );
}
