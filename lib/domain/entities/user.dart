import 'package:turon_tour/domain/entities/agent_profile.dart';
import 'package:turon_tour/domain/entities/user_role.dart';

/// Domain entity representing an authenticated user.
///
/// A user always has a [role]. When the role is [UserRole.agent] the
/// [agentProfile] carries the agency-specific fields (credit limit, commission,
/// etc.); for every other role it is `null`.
class User {
  const User({
    required this.id,
    required this.fullName,
    required this.email,
    required this.role,
    this.agentProfile,
  });

  final int id;
  final String fullName;
  final String email;
  final UserRole role;
  final AgentProfile? agentProfile;

  bool get isAgent => role == UserRole.agent;
}
