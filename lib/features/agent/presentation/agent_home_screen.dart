import 'package:flutter/material.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/widgets/section_placeholder.dart';
import 'package:turon_tour/features/shared/presentation/role_home_scaffold.dart';

/// Agent home — placeholder for Phase 1.
class AgentHomeScreen extends StatelessWidget {
  const AgentHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return RoleHomeScaffold(
      homeTitle: l10n.roleAgent,
      homeTab: SectionPlaceholder(
        icon: Icons.business_center_outlined,
        title: l10n.sectionInDevelopment(l10n.roleAgent),
        message: l10n.comingInNextPhases,
      ),
    );
  }
}
