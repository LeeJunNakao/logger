import { SignupController } from './signup';
import { SigninController } from './signin';
import { ValidateTokenController } from './validate-token';
import { RecoverPasswordController } from './recover-password';
import { EmailValidatorAdapter, PasswordValidatorAdapter, EncrypterAdapter, JwtAdapter, PasswordGeneratorAdapter } from '../../utils';
import { UserService } from '../../domain/services/user';
import { UserRepo } from '../../infra/db/repo/user-repo';
import { makeEmailSenderAdapter } from 'src/email-sender';

export const makeUserService = (): UserService => {
  const repo = new UserRepo();
  const encrypter = new EncrypterAdapter();
  const jwt = new JwtAdapter();
  const passwordGenerator = new PasswordGeneratorAdapter();
  const emailSender = makeEmailSenderAdapter();
  return new UserService(repo, encrypter, jwt, passwordGenerator, emailSender);
};

export const makeSignupController = (): SignupController => {
  const service = makeUserService();
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  return new SignupController(emailValidator, passwordValidator, service);
};

export const makeSigninController = (): SigninController => {
  const service = makeUserService();
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  return new SigninController(emailValidator, passwordValidator, service);
};

export const makeValidateTokenController = (): ValidateTokenController => {
  const service = makeUserService();
  return new ValidateTokenController(service);
};

export const makeRecoverPasswordController = (): RecoverPasswordController => {
  const service = makeUserService();
  return new RecoverPasswordController(service);
};
