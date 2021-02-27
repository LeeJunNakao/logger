import { SignupController } from './signup';
import { MissingParamError } from '../errors/missing-param-error';

const validData = {
  name: 'valid_name',
  email: 'valid_email',
};

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignupController();
    const httpRequest = {
      body: { ...validData, name: null },
    };
    const response = sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const sut = new SignupController();
    const httpRequest = {
      body: { ...validData, email: null },
    };
    const response = sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const sut = new SignupController();
    const httpRequest = {
      body: { ...validData, password: null },
    };
    const response = sut.handle(httpRequest);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(new MissingParamError('password'));
  });
});
