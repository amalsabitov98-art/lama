import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/domain/entities/user_role.dart';

/// Maps a [UserRole] to its localized label and description.
extension RoleL10n on UserRole {
  String label(AppLocalizations l10n) => switch (this) {
        UserRole.tourist => l10n.roleTourist,
        UserRole.agent => l10n.roleAgent,
        UserRole.operator => l10n.roleOperator,
      };

  String description(AppLocalizations l10n) => switch (this) {
        UserRole.tourist => l10n.roleTouristDesc,
        UserRole.agent => l10n.roleAgentDesc,
        UserRole.operator => l10n.roleOperatorDesc,
      };
}
