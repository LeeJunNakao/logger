import { SignupController } from './signup';
import { EmailValidatorAdapter, PasswordValidatorAdapter, EncrypterAdapter, JwtAdapter } from '../../utils';
import { UserService } from '../../domain/services/user';
import { UserRepo } from '../../infra/db/repo/user-repo';

export const makeSignupController = (): SignupController => {
  const repo = new UserRepo();
  const encrypter = new EncrypterAdapter();
  const jwt = new JwtAdapter();
  const service = new UserService(repo, encrypter, jwt);
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  return new SignupController(emailValidator, passwordValidator, service);
};
