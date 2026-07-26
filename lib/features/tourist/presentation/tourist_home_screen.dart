import 'package:flutter/material.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/widgets/section_placeholder.dart';
import 'package:turon_tour/features/shared/presentation/role_home_scaffold.dart';

/// Tourist home — placeholder for Phase 1.
class TouristHomeScreen extends StatelessWidget {
  const TouristHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return RoleHomeScaffold(
      homeTitle: l10n.roleTourist,
      homeTab: SectionPlaceholder(
        icon: Icons.travel_explore,
        title: l10n.sectionInDevelopment(l10n.roleTourist),
        message: l10n.comingInNextPhases,
      ),
    );
  }
}
