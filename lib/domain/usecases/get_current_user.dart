import 'package:turon_tour/domain/entities/user.dart';
import 'package:turon_tour/domain/repositories/auth_repository.dart';

/// Returns the persisted session's user, or `null` when signed out.
class GetCurrentUser {
  const GetCurrentUser(this._repository);

  final AuthRepository _repository;

  Future<User?> call() => _repository.currentUser();
}
