import { SignupController } from './signup';
import { SigninController } from './signin';
import { EmailValidatorAdapter, PasswordValidatorAdapter, EncrypterAdapter, JwtAdapter } from '../../utils';
import { UserService } from '../../domain/services/user';
import { UserRepo } from '../../infra/db/repo/user-repo';
import { ValidateTokenController } from './validate-token';

export const makeSignupController = (): SignupController => {
  const repo = new UserRepo();
  const encrypter = new EncrypterAdapter();
  const jwt = new JwtAdapter();
  const service = new UserService(repo, encrypter, jwt);
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  return new SignupController(emailValidator, passwordValidator, service);
};

export const makeSigninController = (): SigninController => {
  const repo = new UserRepo();
  const encrypter = new EncrypterAdapter();
  const jwt = new JwtAdapter();
  const service = new UserService(repo, encrypter, jwt);
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  return new SigninController(emailValidator, passwordValidator, service);
};

export const makeValidateTokenController = (): ValidateTokenController => {
  const repo = new UserRepo();
  const encrypter = new EncrypterAdapter();
  const jwt = new JwtAdapter();
  const service = new UserService(repo, encrypter, jwt);
  return new ValidateTokenController(service);
};
