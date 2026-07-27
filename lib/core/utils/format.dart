import 'package:intl/intl.dart';

/// Formats a monetary amount using the given [localeCode]'s grouping.
String formatMoney(double amount, String localeCode) {
  return NumberFormat.decimalPattern(localeCode).format(amount);
}

/// Formats a date like `12 Aug 2026` in the given locale.
String formatDate(DateTime date, String localeCode) {
  return DateFormat.yMMMd(localeCode).format(date);
}
