import 'dart:convert';

/// A piece of text stored in all three supported languages.
///
/// Tour content (titles, descriptions, …) is data rather than UI copy, so it
/// lives in the database in every language and is resolved to the active locale
/// at display time via [resolve].
class LocalizedText {
  const LocalizedText({required this.uz, required this.ru, required this.en});

  final String uz;
  final String ru;
  final String en;

  /// Picks the string for [languageCode], falling back to Uzbek.
  String resolve(String languageCode) => switch (languageCode) {
        'ru' => ru,
        'en' => en,
        _ => uz,
      };

  Map<String, String> toMap() => {'uz': uz, 'ru': ru, 'en': en};

  String toJson() => jsonEncode(toMap());

  factory LocalizedText.fromMap(Map<String, dynamic> map) => LocalizedText(
        uz: (map['uz'] ?? '') as String,
        ru: (map['ru'] ?? '') as String,
        en: (map['en'] ?? '') as String,
      );

  factory LocalizedText.fromJson(String source) =>
      LocalizedText.fromMap(jsonDecode(source) as Map<String, dynamic>);
}

/// A list of strings (e.g. highlights) stored per language.
class LocalizedList {
  const LocalizedList({required this.uz, required this.ru, required this.en});

  final List<String> uz;
  final List<String> ru;
  final List<String> en;

  List<String> resolve(String languageCode) => switch (languageCode) {
        'ru' => ru,
        'en' => en,
        _ => uz,
      };

  Map<String, dynamic> toMap() => {'uz': uz, 'ru': ru, 'en': en};

  String toJson() => jsonEncode(toMap());

  factory LocalizedList.fromMap(Map<String, dynamic> map) => LocalizedList(
        uz: _asStringList(map['uz']),
        ru: _asStringList(map['ru']),
        en: _asStringList(map['en']),
      );

  factory LocalizedList.fromJson(String source) =>
      LocalizedList.fromMap(jsonDecode(source) as Map<String, dynamic>);

  static List<String> _asStringList(dynamic value) =>
      (value as List<dynamic>? ?? const []).map((e) => e as String).toList();
}
