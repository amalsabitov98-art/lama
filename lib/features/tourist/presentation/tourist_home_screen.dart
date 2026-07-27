import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:turon_tour/core/localization/generated/app_localizations.dart';
import 'package:turon_tour/core/widgets/section_placeholder.dart';
import 'package:turon_tour/features/shared/presentation/profile_view.dart';
import 'package:turon_tour/features/tourist/presentation/saved_tours_screen.dart';
import 'package:turon_tour/features/tourist/presentation/tourist_storefront.dart';

/// Tourist shell: Home / Search / My Trips / Profile.
///
/// Home is the live storefront (Phase 2.2). Search and My Trips are
/// placeholders until sub-steps 2.3 and 2.5.
class TouristHomeScreen extends ConsumerStatefulWidget {
  const TouristHomeScreen({super.key});

  @override
  ConsumerState<TouristHomeScreen> createState() => _TouristHomeScreenState();
}

class _TouristHomeScreenState extends ConsumerState<TouristHomeScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    final titles = [
      l10n.appName,
      l10n.navSearch,
      l10n.navMyTrips,
      l10n.profileTitle,
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(titles[_index]),
        actions: [
          if (_index == 0)
            IconButton(
              icon: const Icon(Icons.favorite_border),
              tooltip: l10n.savedTitle,
              onPressed: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const SavedToursScreen()),
              ),
            ),
        ],
      ),
      body: IndexedStack(
        index: _index,
        children: [
          const TouristStorefront(),
          SectionPlaceholder(
            icon: Icons.search,
            title: l10n.navSearch,
            message: l10n.comingInNextPhases,
          ),
          SectionPlaceholder(
            icon: Icons.card_travel,
            title: l10n.navMyTrips,
            message: l10n.comingInNextPhases,
          ),
          const ProfileView(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (v) => setState(() => _index = v),
        destinations: [
          NavigationDestination(
              icon: const Icon(Icons.home_outlined),
              selectedIcon: const Icon(Icons.home),
              label: l10n.navHome),
          NavigationDestination(
              icon: const Icon(Icons.search),
              selectedIcon: const Icon(Icons.search),
              label: l10n.navSearch),
          NavigationDestination(
              icon: const Icon(Icons.luggage_outlined),
              selectedIcon: const Icon(Icons.luggage),
              label: l10n.navMyTrips),
          NavigationDestination(
              icon: const Icon(Icons.person_outline),
              selectedIcon: const Icon(Icons.person),
              label: l10n.navProfile),
        ],
      ),
    );
  }
}
