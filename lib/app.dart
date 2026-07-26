import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/router/app_router.dart';
import 'package:turon_tour/core/theme/app_theme.dart';
import 'package:turon_tour/features/shared/application/locale_controller.dart';
import 'package:turon_tour/features/shared/application/theme_controller.dart';

/// Root widget. Wires theme, live locale and the role-aware router together.
class TuronTourApp extends ConsumerWidget {
  const TuronTourApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final themeMode = ref.watch(themeControllerProvider);
    final locale = ref.watch(localeControllerProvider);

    return MaterialApp.router(
      title: 'Turon Tour',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: themeMode,
      locale: locale,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      routerConfig: router,
    );
  }
}
