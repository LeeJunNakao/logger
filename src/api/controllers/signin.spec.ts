import { SigninController } from './signin';
import { MissingParamError, ServerError, AuthError } from '../errors';
import { authError } from '../helpers/http-hepers';
import { EmailValidator, PasswordValidator, Token } from '../protocols';
import { IUserService } from '../../domain/protocols/user-service';
import { AddUserDto, LoginUserDto } from '../../domain/usecases/dto/user';

const validData = {
  email: 'valid_email@email.com',
  password: 'valid_password',
};

interface SutTypes{
  sut: SigninController,
  emailValidatorSut: EmailValidator,
  passwordValidatorSut: PasswordValidatorSut,
  userServiceSut: IUserService,
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

const makeUserService = (): IUserService => {
  class Service implements IUserService {
    async add(dto: AddUserDto): Promise<Token> {
      return await new Promise(resolve => resolve({ token: 'valid_token' }));
    }

    async login(dto: LoginUserDto): Promise<Token> {
      return await new Promise(resolve => resolve({ token: 'valid_token' }));
    }
  }

  return new Service();
};

const makeSut = (): SutTypes => {
  const emailValidatorSut = new EmailValidatorSut();
  const passwordValidatorSut = new PasswordValidatorSut();
  const userServiceSut = makeUserService();
  const sut = new SigninController(emailValidatorSut, passwordValidatorSut, userServiceSut);
  return { sut, emailValidatorSut, passwordValidatorSut, userServiceSut };
};

describe('Signin Controller', () => {
  test('Should return 400 if no email is provided', async() => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { ...validData, email: null },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: new MissingParamError('email').message,
    });
  });

  test('Should return 400 if no password is provided', async() => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { ...validData, password: null },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: new MissingParamError('password').message,
    });
  });

  test('Should return 400 if email is not valid', async() => {
    const { sut, emailValidatorSut } = makeSut();
    jest.spyOn(emailValidatorSut, 'validate').mockReturnValueOnce(false);
    const httpRequest = {
      body: { ...validData, email: 'invalid_email@email.com' },
    };
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(authError());
  });

  test('Should return 400 if password is not valid', async() => {
    const { sut, passwordValidatorSut } = makeSut();
    jest.spyOn(passwordValidatorSut, 'validate').mockReturnValueOnce(false);
    const httpRequest = {
      body: { ...validData, password: 'invalid_password' },
    };
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(authError());
  });

  test('Should call emailValidator with correct email', async() => {
    const { sut, emailValidatorSut } = makeSut();
    const validateSpy = jest.spyOn(emailValidatorSut, 'validate');
    const httpRequest = {
      body: { ...validData, email: 'correct_email@email.com' },
    };
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith('correct_email@email.com');
  });

  test('Should call passwordValidator with correct password', async() => {
    const { sut, passwordValidatorSut } = makeSut();
    const validateSpy = jest.spyOn(passwordValidatorSut, 'validate');
    const httpRequest = {
      body: { ...validData, password: 'correct_password' },
    };
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith('correct_password');
  });

  test('Should call login with correct data', async() => {
    const { sut, userServiceSut } = makeSut();
    const httpRequest = {
      body: validData,
    };
    const serviceSpy = jest.spyOn(userServiceSut, 'login');
    await sut.handle(httpRequest);
    expect(serviceSpy).toHaveBeenCalledWith(validData);
  });

  test('Should return 500 if service throws', async() => {
    const { sut, userServiceSut } = makeSut();
    jest.spyOn(userServiceSut, 'login').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: { ...validData },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  test('Should return 400 if service throws AuthError', async() => {
    const { sut, userServiceSut } = makeSut();
    jest.spyOn(userServiceSut, 'login').mockImplementationOnce(() => {
      throw new AuthError();
    });
    const httpRequest = {
      body: { ...validData },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: new AuthError().message });
  });

  test('Should return token if all data is valid', async() => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { ...validData },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: 'valid_token' });
  });
});
