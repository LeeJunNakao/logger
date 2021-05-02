import { UserService } from './user';
import { EncrypterAdapter, JwtAdapter, PasswordGeneratorAdapter } from 'src/utils';
import { UserRepo } from 'src/infra/db/repo/user-repo';
import { truncateDatabase } from 'src/infra/db/helpers/query-helpers';
import { HttpClient as IHttpClient } from 'src/email-sender/protocols';
import { EmailSender } from 'src/email-sender/email-sender';
import { HttpResponse } from 'src/api/protocols';

const userDto = {
  name: 'Alguém de Oliveira',
  email: 'alguem@email.com',
  password: 'alguma_senha',
};

class HttpClient implements IHttpClient {
  private readonly httpClientStatus?: number;

  constructor(httpClientStatus?: number) {
    this.httpClientStatus = httpClientStatus;
  }

  async post(data: any): Promise<HttpResponse> {
    const status = this.httpClientStatus ?? 200;
    const message = this.httpClientStatus ? 'Failed to sent email' : 'Email sent succesfully';
    return await new Promise(resolve => resolve({
      status,
      body: { message },
    }));
  }
}

const interceptedValues = {
  password: '',
};

class PasswordGeneratorIntercepter extends PasswordGeneratorAdapter {
  generate(len: number = 8): string {
    const password = super.generate(len);
    interceptedValues.password = password;
    return password;
  }
}

const makeSut = (httpClientStatus?: number): UserService => {
  const encypter = new EncrypterAdapter();
  const jwt = new JwtAdapter();
  const repo = new UserRepo();
  const passwordGenerator = new PasswordGeneratorIntercepter();
  const emailSender = new EmailSender(new HttpClient(httpClientStatus));
  return new UserService(repo, encypter, jwt, passwordGenerator, emailSender);
};

describe('User Test Integration', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should get token if all data is provided', async() => {
    const sut = makeSut();
    const token = await sut.add(userDto);
    expect(token.token).toBeTruthy();
  });
});

describe('User Test Integration - Recover password', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should recover password successfully', async() => {
    const sut = makeSut();
    await sut.add(userDto);
    await sut.recoverPassword(userDto.email);
    const { token } = await sut.login({ email: userDto.email, password: interceptedValues.password });
    expect(token).toBeTruthy();
    expect(userDto.password).not.toEqual(interceptedValues.password);
  });

  test('Should throws if http client status code is not 200', async() => {
    const sut = makeSut(400);
    await sut.add(userDto);
    const promise = sut.recoverPassword(userDto.email);
    await expect(promise).rejects.toThrow();
  });
});
