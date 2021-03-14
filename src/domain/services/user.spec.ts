import { UserService } from './user';
import { AddUserDto, UserDto, LoginUserDto } from '../usecases/dto/user';
import { UserRepo } from '../../infra/db/repo/protocols/user-repo';
import { Encrypter } from '../../utils/protocols/encrypter';
import { Jwt } from '../../utils/protocols/jwt';
import { Token } from '../../api/protocols';

const userDto = {
  name: 'Some name',
  email: 'some@email.com',
  password: 'raw_password',
};

const userInfo = {
  id: 1,
  name: userDto.name,
  email: userDto.email,
};

interface SutTypes {
  sut: UserService,
  repoSut: UserRepo,
  encrypterSut: Encrypter,
  jwtSut: Jwt,
}

class UserRepoSut implements UserRepo {
  async add(dto: AddUserDto): Promise<UserDto> {
    return await new Promise((resolve) => resolve({
      id: 1,
      name: dto.name,
      email: dto.email,
      password: '',
    }));
  }

  async get(userInfo: LoginUserDto): Promise<UserDto> {
    return await new Promise(resolve => resolve({
      id: 1,
      name: userDto.name,
      email: userDto.email,
      password: 'hashed_password',
    }));
  }
}

class EncrypterSut implements Encrypter {
  async hash(value: string): Promise<string> {
    return await new Promise((resolve) => resolve('hash'));
  }

  async isValid(unhashed: string, hash: string): Promise<Boolean> {
    return await new Promise((resolve) => resolve(true));
  }
}

class JwtSut implements Jwt {
  async encode(value: any): Promise<Token> {
    return await new Promise((resolve) => resolve({ token: 'valid_token' }));
  }

  async decode(token: Token): Promise<any> {
    return await new Promise((resolve) => resolve({ data: userInfo }));
  }
}

const makeSut = (): SutTypes => {
  const repoSut = new UserRepoSut();
  const encrypterSut = new EncrypterSut();
  const jwtSut = new JwtSut();
  const sut = new UserService(repoSut, encrypterSut, jwtSut);
  return { sut, repoSut, encrypterSut, jwtSut };
};

describe('User Service add', () => {
  test('Should call encrypter with right password', async() => {
    const { sut, encrypterSut } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterSut, 'hash');
    await sut.add(userDto);
    expect(encrypterSpy).toBeCalledWith(userDto.password);
  });

  test('Should call repo with right data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'add');
    await sut.add(userDto);
    expect(repoSpy).toBeCalledWith({ ...userDto, password: 'hash' });
  });

  test('Should call jwt with right data', async() => {
    const { sut, jwtSut } = makeSut();
    const jwtSpy = jest.spyOn(jwtSut, 'encode');
    await sut.add(userDto);
    expect(jwtSpy).toBeCalledWith({ id: 1, name: userDto.name, email: userDto.email });
  });

  test('Should return token if all data is right', async() => {
    const { sut } = makeSut();
    const token = await sut.add(userDto);
    expect(token).toEqual({ token: 'valid_token' });
  });

  test('Should throw if encrypter throws', async() => {
    const { sut, encrypterSut } = makeSut();
    jest.spyOn(encrypterSut, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.add(userDto);
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.add(userDto);
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if jwt throws', async() => {
    const { sut, jwtSut } = makeSut();
    jest.spyOn(jwtSut, 'encode').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.add(userDto);
    await expect(promise).rejects.toThrow();
  });
});

describe('User Service add', () => {
  test('Should call encrypter with right password', async() => {
    const { sut, encrypterSut } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterSut, 'isValid');
    await sut.login(userDto);
    expect(encrypterSpy).toBeCalledWith(userDto.password, 'hashed_password');
  });

  test('Should call repo with right data', async() => {
    const { sut, repoSut } = makeSut();
    const repoSpy = jest.spyOn(repoSut, 'get');
    await sut.login(userDto);
    expect(repoSpy).toBeCalledWith({ email: userDto.email, name: '', id: '', password: '' });
  });

  test('Should call jwt with right data', async() => {
    const { sut, jwtSut } = makeSut();
    const jwtSpy = jest.spyOn(jwtSut, 'encode');
    await sut.login(userDto);
    expect(jwtSpy).toBeCalledWith({ id: 1, name: userDto.name, email: userDto.email });
  });

  test('Should return token if all data is right', async() => {
    const { sut } = makeSut();
    const token = await sut.login(userDto);
    expect(token).toEqual({ token: 'valid_token' });
  });

  test('Should throw if encrypter throws', async() => {
    const { sut, encrypterSut } = makeSut();
    jest.spyOn(encrypterSut, 'isValid').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.login(userDto);
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.login(userDto);
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if jwt throws', async() => {
    const { sut, jwtSut } = makeSut();
    jest.spyOn(jwtSut, 'encode').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.login(userDto);
    await expect(promise).rejects.toThrow();
  });
});

describe('User Service validateToken', () => {
  const token: Token = { token: 'valid_token' };

  test('Should throw if jwtSut throws', async() => {
    const { sut, jwtSut } = makeSut();
    jest.spyOn(jwtSut, 'decode').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.validateToken(token);
    await expect(promise).rejects.toThrow();
  });

  test('Should return user data', async() => {
    const { sut } = makeSut();
    const result = await sut.validateToken(token);
    expect(result).toEqual(userInfo);
  });
});
