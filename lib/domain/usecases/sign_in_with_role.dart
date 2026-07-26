import 'package:turon_tour/domain/entities/user.dart';
import 'package:turon_tour/domain/entities/user_role.dart';
import 'package:turon_tour/domain/repositories/auth_repository.dart';

/// Signs a user in with the mock account for the given [UserRole].
class SignInWithRole {
  const SignInWithRole(this._repository);

  final AuthRepository _repository;

  Future<User> call(UserRole role) => _repository.signInWithRole(role);
}
