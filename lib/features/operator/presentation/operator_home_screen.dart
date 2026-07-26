import 'package:flutter/material.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/widgets/section_placeholder.dart';
import 'package:turon_tour/features/shared/presentation/role_home_scaffold.dart';

/// Operator home — placeholder for Phase 1.
class OperatorHomeScreen extends StatelessWidget {
  const OperatorHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return RoleHomeScaffold(
      homeTitle: l10n.roleOperator,
      homeTab: SectionPlaceholder(
        icon: Icons.dashboard_customize_outlined,
        title: l10n.sectionInDevelopment(l10n.roleOperator),
        message: l10n.comingInNextPhases,
      ),
    );
  }
}
