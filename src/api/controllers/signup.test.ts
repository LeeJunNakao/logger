import { SignupController } from './signup';
import { EmailValidatorAdapter, PasswordValidatorAdapter, EncrypterAdapter, JwtAdapter } from '../../utils';
import { UserService } from '../../domain/services/user';
import { UserRepo } from '../../infra/db/repo/user-repo';
import { serverError, badRequest, databaseError } from '../helpers';
import { MissingParamError, InvalidParamError } from '../errors';
import { truncateDatabase } from '../../infra/db/helpers/query-helpers';

interface SutTypes {
  sut: SignupController,
  serviceSut: UserService,
}

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  const repo = new UserRepo();
  const encrypter = new EncrypterAdapter();
  const jwt = new JwtAdapter();
  const serviceSut = new UserService(repo, encrypter, jwt);
  const sut = new SignupController(emailValidator, passwordValidator, serviceSut);
  return { sut, serviceSut };
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
    const { sut } = makeSut();
    const response = await sut.handle({ body: null });
    expect(response).toEqual(serverError());
  });

  test('Should return status 400 if no name is provided', async() => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { ...data, name: null } });
    expect(response).toEqual(badRequest(new MissingParamError('name')));
  });

  test('Should return status 400 if no email is provided', async() => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { ...data, email: null } });
    expect(response).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return status 400 if no password is provided', async() => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { ...data, password: null } });
    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return status 400 if email is not valid', async() => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { ...data, email: 'invalid_email.com' } });
    expect(response).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should return status 400 if email already exists', async() => {
    const { sut } = makeSut();
    await sut.handle({ body: data });
    const response = await sut.handle({ body: { ...data, name: 'outra pessoa' } });
    expect(response).toEqual(databaseError('Email already registered in database'));
  });

  test('Should return status 400 if password is not valid', async() => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { ...data, password: 'weak_password' } });
    expect(response).toEqual(badRequest(new InvalidParamError('password')));
  });

  test('Should get token if all data are provided', async() => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { ...data } });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });

  test('Should return 400 if service throws', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const response = await sut.handle({ body: { ...data } });
    expect(response).toEqual(serverError());
  });
});
