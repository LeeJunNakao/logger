import { MissingParamError, ServerError, AuthError } from '../errors';
import { authError } from '../helpers/http-hepers';
import { makeSut, user as validData } from './test-config';
import { SigninController } from './signin';

describe('Signin Controller', () => {
  test('Should return 400 if no email is provided', async() => {
    const { sut } = makeSut(SigninController);
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
    const { sut } = makeSut(SigninController);
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
    const { sut, emailValidatorSut } = makeSut(SigninController);
    jest.spyOn(emailValidatorSut, 'validate').mockReturnValueOnce(false);
    const httpRequest = {
      body: { ...validData, email: 'invalid_email@email.com' },
    };
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(authError());
  });

  test('Should return 400 if password is not valid', async() => {
    const { sut, passwordValidatorSut } = makeSut(SigninController);
    jest.spyOn(passwordValidatorSut, 'validate').mockReturnValueOnce(false);
    const httpRequest = {
      body: { ...validData, password: 'invalid_password' },
    };
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(authError());
  });

  test('Should call emailValidator with correct email', async() => {
    const { sut, emailValidatorSut } = makeSut(SigninController);
    const validateSpy = jest.spyOn(emailValidatorSut, 'validate');
    const httpRequest = {
      body: { ...validData, email: 'correct_email@email.com' },
    };
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith('correct_email@email.com');
  });

  test('Should call passwordValidator with correct password', async() => {
    const { sut, passwordValidatorSut } = makeSut(SigninController);
    const validateSpy = jest.spyOn(passwordValidatorSut, 'validate');
    const httpRequest = {
      body: { ...validData, password: 'correct_password' },
    };
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith('correct_password');
  });

  test('Should call login with correct data', async() => {
    const { sut, userServiceSut } = makeSut(SigninController);
    const httpRequest = {
      body: validData,
    };
    const serviceSpy = jest.spyOn(userServiceSut, 'login');
    await sut.handle(httpRequest);
    expect(serviceSpy).toHaveBeenCalledWith({ email: validData.email, password: validData.password });
  });

  test('Should return 500 if service throws', async() => {
    const { sut, userServiceSut } = makeSut(SigninController);
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
    const { sut, userServiceSut } = makeSut(SigninController);
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
    const { sut } = makeSut(SigninController);
    const httpRequest = {
      body: { ...validData },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: 'valid_token' });
  });
});
