import 'package:turon_tour/domain/entities/user_role.dart';

/// A mock account definition used to seed the database on first launch.
class MockAccount {
  const MockAccount({
    required this.fullName,
    required this.email,
    required this.role,
    this.agencyName,
    this.creditLimit = 0,
    this.creditUsed = 0,
    this.commissionRate = 0,
  });

  final String fullName;
  final String email;
  final UserRole role;

  // Agent-only fields.
  final String? agencyName;
  final double creditLimit;
  final double creditUsed;
  final double commissionRate;
}

/// The three seeded accounts — one per role. No passwords in Phase 1.
const List<MockAccount> kMockAccounts = [
  MockAccount(
    fullName: 'Aziza Karimova',
    email: 'tourist@turontour.uz',
    role: UserRole.tourist,
  ),
  MockAccount(
    fullName: 'Bekzod Rahimov',
    email: 'agent@turontour.uz',
    role: UserRole.agent,
    agencyName: 'Silk Road Travel',
    creditLimit: 50000000, // 50 000 000 UZS
    creditUsed: 12500000, // 12 500 000 UZS
    commissionRate: 0.10, // 10%
  ),
  MockAccount(
    fullName: 'Dilnoza Yusupova',
    email: 'operator@turontour.uz',
    role: UserRole.operator,
  ),
];
