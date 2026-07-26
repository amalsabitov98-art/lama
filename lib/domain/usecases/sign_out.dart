import 'package:turon_tour/domain/repositories/auth_repository.dart';

/// Clears the current session.
class SignOut {
  const SignOut(this._repository);

  final AuthRepository _repository;

  Future<void> call() => _repository.signOut();
}
