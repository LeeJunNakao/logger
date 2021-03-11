import { SignupController } from './signup';
import { EmailValidatorAdapter, PasswordValidatorAdapter, EncrypterAdapter, JwtAdapter } from '../../utils';
import { UserService } from '../../domain/services/user';
import { UserRepo } from '../../infra/db/repo/user-repo';
import { serverError, badRequest } from '../helpers';
import { MissingParamError, InvalidParamError } from '../errors';
import { truncateDatabase } from '../../infra/db/helpers/query-helpers';

const makeSut = (): SignupController => {
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  const repo = new UserRepo();
  const encrypter = new EncrypterAdapter();
  const jwt = new JwtAdapter();
  const service = new UserService(repo, encrypter, jwt);
  return new SignupController(emailValidator, passwordValidator, service);
};

const data = {
  name: 'Fulda da Silva',
  email: 'email@email.com',
  password: 'I23%kdsa',
};

describe('SignupController Integration', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should throw error if no data is provided', async() => {
    const sut = makeSut();
    const response = await sut.handle({ body: null });
    expect(response).toEqual(serverError());
  });

  test('Should return status 400 if no name is provided', async() => {
    const sut = makeSut();
    const response = await sut.handle({ body: { ...data, name: null } });
    expect(response).toEqual(badRequest(new MissingParamError('name')));
  });

  test('Should return status 400 if no email is provided', async() => {
    const sut = makeSut();
    const response = await sut.handle({ body: { ...data, email: null } });
    expect(response).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return status 400 if no password is provided', async() => {
    const sut = makeSut();
    const response = await sut.handle({ body: { ...data, password: null } });
    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return status 400 if email is not valid', async() => {
    const sut = makeSut();
    const response = await sut.handle({ body: { ...data, email: 'invalid_email.com' } });
    expect(response).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should return status 400 if password is not valid', async() => {
    const sut = makeSut();
    const response = await sut.handle({ body: { ...data, password: 'weak_password' } });
    expect(response).toEqual(badRequest(new InvalidParamError('password')));
  });

  test('Should get token if all data are provided', async() => {
    const sut = makeSut();
    const response = await sut.handle({ body: { ...data } });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });
});
