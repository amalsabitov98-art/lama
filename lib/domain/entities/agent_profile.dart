/// Agency-specific data attached to a user with the agent role.
class AgentProfile {
  const AgentProfile({
    required this.agencyName,
    required this.creditLimit,
    required this.creditUsed,
    required this.commissionRate,
  });

  final String agencyName;

  /// Total credit the agency is allowed to use, in the operator's currency.
  final double creditLimit;

  /// Portion of [creditLimit] already consumed.
  final double creditUsed;

  /// Commission share for the agency, expressed as a fraction (e.g. 0.10 = 10%).
  final double commissionRate;

  double get creditAvailable => creditLimit - creditUsed;
}
