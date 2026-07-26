import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/localization/role_l10n.dart';
import 'package:turon_tour/core/theme/app_spacing.dart';
import 'package:turon_tour/domain/entities/user.dart';
import 'package:turon_tour/features/auth/application/auth_controller.dart';
import 'package:turon_tour/features/shared/application/locale_controller.dart';
import 'package:turon_tour/features/shared/application/theme_controller.dart';
import 'package:turon_tour/features/shared/presentation/language_picker.dart';
import 'package:turon_tour/features/shared/presentation/theme_picker.dart';

/// Shared profile: account summary, agency info (agents only), language and
/// theme switches, and sign-out. Rendered inside [RoleHomeScaffold], so it has
/// no [Scaffold] or [AppBar] of its own.
class ProfileView extends ConsumerWidget {
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final user = ref.watch(authControllerProvider).value;

    if (user == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return ListView(
      padding: const EdgeInsets.all(AppSpacing.lg),
      children: [
        _AccountHeader(user: user),
        AppSpacing.gapXl,
        if (user.isAgent && user.agentProfile != null) ...[
          _AgencyCard(user: user),
          AppSpacing.gapXl,
        ],
        _SectionTitle(l10n.settings),
        AppSpacing.gapSm,
        _LanguageTile(),
        const Divider(),
        _ThemeTile(),
        AppSpacing.gapXl,
        FilledButton.tonalIcon(
          onPressed: () => ref.read(authControllerProvider.notifier).signOut(),
          icon: const Icon(Icons.logout),
          label: Text(l10n.logout),
        ),
      ],
    );
  }
}

class _AccountHeader extends StatelessWidget {
  const _AccountHeader({required this.user});
  final User user;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final initials = user.fullName.isNotEmpty
        ? user.fullName.trim().substring(0, 1).toUpperCase()
        : '?';

    return Row(
      children: [
        CircleAvatar(
          radius: 32,
          backgroundColor: theme.colorScheme.primaryContainer,
          child: Text(
            initials,
            style: theme.textTheme.headlineSmall?.copyWith(
              color: theme.colorScheme.onPrimaryContainer,
            ),
          ),
        ),
        AppSpacing.gapLg,
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(user.fullName, style: theme.textTheme.titleLarge),
              AppSpacing.gapXxs,
              Text(
                user.email,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              AppSpacing.gapSm,
              Chip(
                label: Text('${l10n.roleLabel}: ${user.role.label(l10n)}'),
                visualDensity: VisualDensity.compact,
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _AgencyCard extends StatelessWidget {
  const _AgencyCard({required this.user});
  final User user;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final agent = user.agentProfile!;
    final locale = Localizations.localeOf(context).toString();
    final money = NumberFormat.decimalPattern(locale);
    final percent = NumberFormat.percentPattern(locale)
      ..maximumFractionDigits = 1;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.business, color: theme.colorScheme.primary),
                AppSpacing.gapSm,
                Text(l10n.agencyInfo, style: theme.textTheme.titleMedium),
              ],
            ),
            AppSpacing.gapMd,
            Text(agent.agencyName, style: theme.textTheme.titleLarge),
            const Divider(),
            _InfoRow(
              label: l10n.creditLimit,
              value: '${money.format(agent.creditLimit)} UZS',
            ),
            _InfoRow(
              label: l10n.creditUsed,
              value: '${money.format(agent.creditUsed)} UZS',
            ),
            _InfoRow(
              label: l10n.creditAvailable,
              value: '${money.format(agent.creditAvailable)} UZS',
              emphasize: true,
            ),
            _InfoRow(
              label: l10n.commission,
              value: percent.format(agent.commissionRate),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.label,
    required this.value,
    this.emphasize = false,
  });

  final String label;
  final String value;
  final bool emphasize;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
          Text(
            value,
            style: emphasize
                ? theme.textTheme.titleMedium
                    ?.copyWith(color: theme.colorScheme.primary)
                : theme.textTheme.bodyLarge,
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Text(
      text.toUpperCase(),
      style: theme.textTheme.labelMedium?.copyWith(
        color: theme.colorScheme.primary,
        letterSpacing: 1,
      ),
    );
  }
}

class _LanguageTile extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final locale = ref.watch(localeControllerProvider);

    return ListTile(
      leading: const Icon(Icons.language),
      title: Text(l10n.language),
      subtitle: Text(languageLabel(l10n, locale)),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => showLanguagePicker(context, ref),
    );
  }
}

class _ThemeTile extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final mode = ref.watch(themeControllerProvider);

    return ListTile(
      leading: const Icon(Icons.brightness_6_outlined),
      title: Text(l10n.appearance),
      subtitle: Text(themeModeLabel(l10n, mode)),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => showThemePicker(context, ref),
    );
  }
}
