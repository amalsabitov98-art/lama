import 'package:flutter/material.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/features/shared/presentation/profile_view.dart';

/// Shared scaffold for every role's home screen.
///
/// Provides the two Phase-1 bottom-navigation destinations — Home and Profile —
/// so each role only supplies its own [homeTab] content and title. Later phases
/// add more destinations here (or per role).
class RoleHomeScaffold extends StatefulWidget {
  const RoleHomeScaffold({
    required this.homeTitle,
    required this.homeTab,
    super.key,
  });

  final String homeTitle;
  final Widget homeTab;

  @override
  State<RoleHomeScaffold> createState() => _RoleHomeScaffoldState();
}

class _RoleHomeScaffoldState extends State<RoleHomeScaffold> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final isHome = _index == 0;

    return Scaffold(
      appBar: AppBar(
        title: Text(isHome ? widget.homeTitle : l10n.profileTitle),
      ),
      body: IndexedStack(
        index: _index,
        children: [
          widget.homeTab,
          const ProfileView(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.home_outlined),
            selectedIcon: const Icon(Icons.home),
            label: l10n.navHome,
          ),
          NavigationDestination(
            icon: const Icon(Icons.person_outline),
            selectedIcon: const Icon(Icons.person),
            label: l10n.navProfile,
          ),
        ],
      ),
    );
  }
}
