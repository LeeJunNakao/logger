import { SigninController } from '../signin';
import { SignupController } from '../signup';
import { EmailValidatorAdapter, PasswordValidatorAdapter } from '../../../utils';
import { serverError, badRequest, authError } from '../../helpers';
import { MissingParamError, AuthError } from '../../errors';
import { truncateDatabase } from '../../../infra/db/helpers/query-helpers';
import { makeUserService } from '../';
import { IUserService } from 'src/domain/protocols/user-service';

interface SutTypes {
  sut: SigninController,
  serviceSut: IUserService,
  signupSut: SignupController,
}

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  const serviceSut = makeUserService();
  const sut = new SigninController(emailValidator, passwordValidator, serviceSut);
  const signupSut = new SignupController(emailValidator, passwordValidator, serviceSut);
  return { sut, serviceSut, signupSut };
};

const data = {
  name: 'Fulda da Silva',
  email: 'email@email.com',
  password: 'I23%kdsa',
};

describe('SigninController Integration', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should throw error if no data is provided', async() => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: null });
    expect(response).toEqual(serverError());
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
    expect(response).toEqual(authError());
  });

  test('Should return status 400 if password is not valid', async() => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { ...data, password: 'weak_password' } });
    expect(response).toEqual(authError());
  });

  test('Should get token if all data are provided', async() => {
    const { sut, signupSut } = makeSut();
    await signupSut.handle({ body: data });
    const response = await sut.handle({ body: data });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });

  test('Should return 500 if service throws', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'login').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const response = await sut.handle({ body: data });
    expect(response).toEqual(serverError());
  });

  test('Should return 400 if service throws AuthError', async() => {
    const { sut, serviceSut } = makeSut();
    jest.spyOn(serviceSut, 'login').mockReturnValueOnce(new Promise((resolve, reject) => reject(new AuthError())));
    const response = await sut.handle({ body: data });
    expect(response).toEqual(authError());
  });

  test('Should return 400 if password is incorrect', async() => {
    const { sut, signupSut } = makeSut();
    await signupSut.handle({ body: data });
    const response = await sut.handle({ body: { ...data, password: 'z2%kJs1a' } });
    expect(response).toEqual(authError());
  });

  test('Should return 400 if email is incorrect', async() => {
    const { sut, signupSut } = makeSut();
    await signupSut.handle({ body: data });
    const response = await sut.handle({ body: { ...data, email: 'another_email@email.com' } });
    expect(response).toEqual(authError());
  });
});
