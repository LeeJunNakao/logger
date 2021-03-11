import { UserRepo } from './user-repo';
import { AddUserDto } from '../../../domain/usecases/dto/user';
import { truncateDatabase } from '../helpers/query-helpers';

const createUserDto: AddUserDto = {
  name: 'James da Silva',
  email: 'james@email.com',
  password: '123456',
};

describe('User Repo', () => {
  beforeAll(async() => await truncateDatabase());

  afterEach(async() => await truncateDatabase());

  test('Should insert into database successfully', async() => {
    const { name, email } = createUserDto;
    const repo = new UserRepo();
    const user = await repo.add(createUserDto);

    expect(user.name).toEqual(name);
    expect(user.email).toEqual(email);
    expect(user.id).toBeTruthy();
  });

  test('Should get user after inserted', async() => {
    const { name, email } = createUserDto;
    const repo = new UserRepo();
    const { id } = await repo.add(createUserDto);
    const user = await repo.get(id);

    expect(user.name).toEqual(name);
    expect(user.email).toEqual(email);
    expect(user.id).toBeTruthy();
  });
});