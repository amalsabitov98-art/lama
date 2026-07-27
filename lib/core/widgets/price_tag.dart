import 'package:flutter/material.dart';
import 'package:turon_tour/core/utils/format.dart';

/// Displays a price like `from 1 450 000 UZS`.
class PriceTag extends StatelessWidget {
  const PriceTag({
    required this.amount,
    required this.currency,
    this.prefix,
    this.emphasize = true,
    super.key,
  });

  final double amount;
  final String currency;

  /// Optional leading word, e.g. a localized "from".
  final String? prefix;
  final bool emphasize;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final locale = Localizations.localeOf(context).languageCode;
    final value = '${formatMoney(amount, locale)} $currency';

    final style = emphasize
        ? theme.textTheme.titleMedium
            ?.copyWith(color: theme.colorScheme.primary)
        : theme.textTheme.bodyMedium;

    return Text.rich(
      TextSpan(
        children: [
          if (prefix != null)
            TextSpan(
              text: '$prefix ',
              style: theme.textTheme.bodySmall
                  ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
            ),
          TextSpan(text: value, style: style),
        ],
      ),
    );
  }
}
