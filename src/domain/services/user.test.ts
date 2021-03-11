import { UserService } from './user';
import { EncrypterAdapter, JwtAdapter } from '../../utils/';
import { UserRepo } from '../../infra/db/repo/user-repo';
import { truncateDatabase } from '../../infra/db/helpers/query-helpers';

const userDto = {
  name: 'Alguém de Oliveira',
  email: 'alguem@email.com',
  password: 'alguma_senha',
};

const makeSut = (): UserService => {
  const encypter = new EncrypterAdapter();
  const jwt = new JwtAdapter();
  const repo = new UserRepo();
  return new UserService(repo, encypter, jwt);
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
