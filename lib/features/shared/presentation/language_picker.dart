import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/features/shared/application/locale_controller.dart';

/// Human-readable label for a locale (or system default when `null`).
String languageLabel(AppLocalizations l10n, Locale? locale) {
  return switch (locale?.languageCode) {
    'uz' => l10n.languageUzbek,
    'ru' => l10n.languageRussian,
    'en' => l10n.languageEnglish,
    _ => l10n.themeSystem, // "System" = follow device language
  };
}

/// Bottom sheet to switch the app language. Applies immediately.
Future<void> showLanguagePicker(BuildContext context, WidgetRef ref) {
  final l10n = AppLocalizations.of(context);
  final current = ref.read(localeControllerProvider);

  return showModalBottomSheet<void>(
    context: context,
    showDragHandle: true,
    builder: (context) {
      return SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(title: Text(l10n.language, style: _titleStyle(context))),
            for (final locale in kSupportedLocales)
              RadioListTile<Locale?>(
                value: locale,
                groupValue: current,
                title: Text(languageLabel(l10n, locale)),
                onChanged: (value) {
                  ref.read(localeControllerProvider.notifier).setLocale(value);
                  Navigator.of(context).pop();
                },
              ),
            RadioListTile<Locale?>(
              value: null,
              groupValue: current,
              title: Text(l10n.themeSystem),
              onChanged: (value) {
                ref.read(localeControllerProvider.notifier).setLocale(null);
                Navigator.of(context).pop();
              },
            ),
          ],
        ),
      );
    },
  );
}

TextStyle? _titleStyle(BuildContext context) =>
    Theme.of(context).textTheme.titleMedium;
