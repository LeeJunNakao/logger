import { SignupController } from './signup';
import { MissingParamError, InvalidParamError } from '../errors';
import { EmailValidator, PasswordValidator } from '../protocols';

const validData = {
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password',
};

interface SutTypes{
  sut: SignupController,
  emailValidatorSut: EmailValidator,
  passwordValidatorSut: PasswordValidatorSut,
}

class EmailValidatorSut implements EmailValidator {
  validate(email: string): Boolean {
    return true;
  }
}

class PasswordValidatorSut implements PasswordValidator {
  validate(password: string): Boolean {
    return true;
  }
}

const makeSut = (): SutTypes => {
  const emailValidatorSut = new EmailValidatorSut();
  const passwordValidatorSut = new PasswordValidatorSut();
  const sut = new SignupController(emailValidatorSut, passwordValidatorSut);
  return { sut, emailValidatorSut, passwordValidatorSut };
};

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { ...validData, name: null },
    };
    const response = sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { ...validData, email: null },
    };
    const response = sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { ...validData, password: null },
    };
    const response = sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if email is not valid', () => {
    const { sut, emailValidatorSut } = makeSut();
    jest.spyOn(emailValidatorSut, 'validate').mockReturnValueOnce(false);
    const httpRequest = {
      body: { ...validData, email: 'invalid_email@email.com' },
    };
    const response = sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(new InvalidParamError('email'));
  });

  test('Should return 400 if password is not valid', () => {
    const { sut, passwordValidatorSut } = makeSut();
    jest.spyOn(passwordValidatorSut, 'validate').mockReturnValueOnce(false);
    const httpRequest = {
      body: { ...validData, password: 'invalid_password' },
    };
    const response = sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(new InvalidParamError('password'));
  });

  test('Should call emailValidator with correct email', () => {
    const { sut, emailValidatorSut } = makeSut();
    const validateSpy = jest.spyOn(emailValidatorSut, 'validate');
    const httpRequest = {
      body: { ...validData, email: 'correct_email@email.com' },
    };
    sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith('correct_email@email.com');
  });

  test('Should call passwordValidator with correct password', () => {
    const { sut, passwordValidatorSut } = makeSut();
    const validateSpy = jest.spyOn(passwordValidatorSut, 'validate');
    const httpRequest = {
      body: { ...validData, password: 'correct_password' },
    };
    sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith('correct_password');
  });
});
