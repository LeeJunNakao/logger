import { MissingParamError, InvalidParamError, ServerError } from '../errors';
import { makeSut, user as validData } from './test-config';
import { SignupController } from './signup';

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', async() => {
    const { sut } = makeSut(SignupController);
    const httpRequest = {
      body: { ...validData, name: null },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: (new MissingParamError('name')).message,
    });
  });

  test('Should return 400 if no email is provided', async() => {
    const { sut } = makeSut(SignupController);
    const httpRequest = {
      body: { ...validData, email: null },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: (new MissingParamError('email')).message,
    });
  });

  test('Should return 400 if no password is provided', async() => {
    const { sut } = makeSut(SignupController);
    const httpRequest = {
      body: { ...validData, password: null },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: (new MissingParamError('password')).message,
    });
  });

  test('Should return 400 if email is not valid', async() => {
    const { sut, emailValidatorSut } = makeSut(SignupController);
    jest.spyOn(emailValidatorSut, 'validate').mockReturnValueOnce(false);
    const httpRequest = {
      body: { ...validData, email: 'invalid_email@email.com' },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: (new InvalidParamError('email')).message,
    });
  });

  test('Should return 400 if password is not valid', async() => {
    const { sut, passwordValidatorSut } = makeSut(SignupController);
    jest.spyOn(passwordValidatorSut, 'validate').mockReturnValueOnce(false);
    const httpRequest = {
      body: { ...validData, password: 'invalid_password' },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: (new InvalidParamError('password')).message,
    });
  });

  test('Should call emailValidator with correct email', async() => {
    const { sut, emailValidatorSut } = makeSut(SignupController);
    const validateSpy = jest.spyOn(emailValidatorSut, 'validate');
    const httpRequest = {
      body: { ...validData, email: 'correct_email@email.com' },
    };
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith('correct_email@email.com');
  });

  test('Should call passwordValidator with correct password', async() => {
    const { sut, passwordValidatorSut } = makeSut(SignupController);
    const validateSpy = jest.spyOn(passwordValidatorSut, 'validate');
    const httpRequest = {
      body: { ...validData, password: 'correct_password' },
    };
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith('correct_password');
  });

  test('Should add user with correct data', async() => {
    const { sut, userServiceSut } = makeSut(SignupController);
    const httpRequest = {
      body: validData,
    };
    const serviceSpy = jest.spyOn(userServiceSut, 'add');
    await sut.handle(httpRequest);
    expect(serviceSpy).toHaveBeenCalledWith({ name: validData.name, email: validData.email, password: validData.password });
  });

  test('Should return 500 if service throws', async() => {
    const { sut, userServiceSut } = makeSut(SignupController);
    jest.spyOn(userServiceSut, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: { ...validData },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  test('Should return token if all data is valid', async() => {
    const { sut } = makeSut(SignupController);
    const httpRequest = {
      body: { ...validData },
    };
    const response = await sut.handle(httpRequest);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: 'valid_token' });
  });
});
