import 'package:flutter/widgets.dart';
import 'package:turon_tour/domain/entities/localized.dart';

/// Presentation helpers to resolve localized content against the active locale.
extension LocalizedTextX on LocalizedText {
  String of(BuildContext context) =>
      resolve(Localizations.localeOf(context).languageCode);
}

extension LocalizedListX on LocalizedList {
  List<String> of(BuildContext context) =>
      resolve(Localizations.localeOf(context).languageCode);
}
