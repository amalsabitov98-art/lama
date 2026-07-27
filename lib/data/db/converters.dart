import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:turon_tour/domain/entities/localized.dart';

/// Stores a [LocalizedText] as a JSON string column.
class LocalizedTextConverter extends TypeConverter<LocalizedText, String> {
  const LocalizedTextConverter();

  @override
  LocalizedText fromSql(String fromDb) => LocalizedText.fromJson(fromDb);

  @override
  String toSql(LocalizedText value) => value.toJson();
}

/// Stores a [LocalizedList] as a JSON string column.
class LocalizedListConverter extends TypeConverter<LocalizedList, String> {
  const LocalizedListConverter();

  @override
  LocalizedList fromSql(String fromDb) => LocalizedList.fromJson(fromDb);

  @override
  String toSql(LocalizedList value) => value.toJson();
}

/// Stores a `List<String>` (e.g. image paths) as a JSON string column.
class StringListConverter extends TypeConverter<List<String>, String> {
  const StringListConverter();

  @override
  List<String> fromSql(String fromDb) =>
      (jsonDecode(fromDb) as List<dynamic>).map((e) => e as String).toList();

  @override
  String toSql(List<String> value) => jsonEncode(value);
}
