import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/theme/app_colors.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';
import 'package:turon_tour/core/widgets/role_card.dart';
import 'package:turon_tour/domain/entities/user_role.dart';
import 'package:turon_tour/features/auth/application/auth_controller.dart';

/// Role picker / mock login. One tap per card signs in with the seeded account
/// for that role — no passwords in Phase 1.
class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final authState = ref.watch(authControllerProvider);
    final isBusy = authState.isLoading;

    Future<void> signIn(UserRole role) =>
        ref.read(authControllerProvider.notifier).signIn(role);

    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 480),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      AppSpacing.gapXxl,
                      Icon(
                        Icons.terrain,
                        size: 56,
                        color: theme.colorScheme.primary,
                      ),
                      AppSpacing.gapLg,
                      Text(
                        l10n.loginTitle,
                        textAlign: TextAlign.center,
                        style: theme.textTheme.headlineMedium,
                      ),
                      AppSpacing.gapSm,
                      Text(
                        l10n.loginSubtitle,
                        textAlign: TextAlign.center,
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                      AppSpacing.gapXxl,
                      RoleCard(
                        icon: Icons.luggage_outlined,
                        title: l10n.roleTourist,
                        subtitle: l10n.roleTouristDesc,
                        color: AppColors.turquoise,
                        onTap: isBusy ? _noop : () => signIn(UserRole.tourist),
                      ),
                      AppSpacing.gapMd,
                      RoleCard(
                        icon: Icons.business_center_outlined,
                        title: l10n.roleAgent,
                        subtitle: l10n.roleAgentDesc,
                        color: AppColors.terracotta,
                        onTap: isBusy ? _noop : () => signIn(UserRole.agent),
                      ),
                      AppSpacing.gapMd,
                      RoleCard(
                        icon: Icons.dashboard_customize_outlined,
                        title: l10n.roleOperator,
                        subtitle: l10n.roleOperatorDesc,
                        color: AppColors.saffron,
                        onTap: isBusy ? _noop : () => signIn(UserRole.operator),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            if (isBusy)
              const Positioned.fill(
                child: ColoredBox(
                  color: Color(0x33000000),
                  child: Center(child: CircularProgressIndicator()),
                ),
              ),
          ],
        ),
      ),
    );
  }

  static void _noop() {}
}
