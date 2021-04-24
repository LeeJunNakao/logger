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

  test('Should throw if email already exists', async() => {
    const repo = new UserRepo();
    await repo.add(createUserDto);
    const promise = repo.add({
      name: 'James de Oliveira',
      email: 'james@email.com',
      password: '123456'
    })

    await expect(promise).rejects.toThrowError();
  });

  test('Should insert into database successfully', async() => {
    const { name, email } = createUserDto;
    const repo = new UserRepo();
    const user = await repo.add(createUserDto);

    expect(user.name).toEqual(name);
    expect(user.email).toEqual(email);
    expect(user.id).toBeTruthy();
  });

  test('Should get user after inserted', async() => {
    const { email, password } = createUserDto;
    const repo = new UserRepo();
    const addedUser = await repo.add(createUserDto);
    const user = await repo.get({ email, password, id: '', name: '' });

    expect(user.name).toEqual(addedUser.name);
    expect(user.email).toEqual(addedUser.email);
    expect(user.id).toBeTruthy();
    expect(user.id).toEqual(addedUser.id);
  });
});
