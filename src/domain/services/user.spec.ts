import { UserService } from './user';
import { AddUserDto, UserDto, LoginUserDto, UpdateUserDto } from '../usecases/dto/user';
import { UserRepo } from '../../infra/db/repo/protocols/user-repo';
import { Encrypter, Jwt, PasswordGenerator } from 'src/utils/protocols';
import { Token } from 'src/api/protocols';
import { EmailSender } from 'src/email-sender/protocols';

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
  passwordGeneratorSut: PasswordGenerator,
  emailSenderSut: EmailSender,
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

  async update(dto: UpdateUserDto): Promise<UserDto> {
    return await new Promise(resolve => resolve({
      id: 1,
      name: dto.name ?? userInfo.name,
      email: dto.email ?? userInfo.email,
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

class PasswordGeneratorSut implements PasswordGenerator {
  generate(): string {
    return 'Nova_senha';
  }
}

class EmailSenderSut implements EmailSender {
  async send(email: string, subject: string, message: string): Promise<Boolean> {
    return await new Promise((resolve) => resolve(true));
  }
}

const makeSut = (): SutTypes => {
  const repoSut = new UserRepoSut();
  const encrypterSut = new EncrypterSut();
  const jwtSut = new JwtSut();
  const passwordGeneratorSut = new PasswordGeneratorSut();
  const emailSenderSut = new EmailSenderSut();
  const sut = new UserService(repoSut, encrypterSut, jwtSut, passwordGeneratorSut, emailSenderSut);
  return { sut, repoSut, encrypterSut, jwtSut, passwordGeneratorSut, emailSenderSut };
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

describe('User service recover password', () => {
  test('Should throw if email is not provided', async() => {
    const { sut } = makeSut();
    const promise = sut.recoverPassword('');
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if password generator throws', async() => {
    const { sut, passwordGeneratorSut } = makeSut();
    jest.spyOn(passwordGeneratorSut, 'generate').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.recoverPassword('email@email.com');
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if encrypter throws', async() => {
    const { sut, encrypterSut } = makeSut();
    jest.spyOn(encrypterSut, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.recoverPassword('email@email.com');
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if repo throws', async() => {
    const { sut, repoSut } = makeSut();
    jest.spyOn(repoSut, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.recoverPassword('email@email.com');
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if email sender throws', async() => {
    const { sut, emailSenderSut } = makeSut();
    jest.spyOn(emailSenderSut, 'send').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.recoverPassword('email@email.com');
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if email sender return false', async() => {
    const { sut, emailSenderSut } = makeSut();
    jest.spyOn(emailSenderSut, 'send').mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const promise = sut.recoverPassword('email@email.com');
    await expect(promise).rejects.toThrow();
  });

  test('Should send email successfully', async() => {
    const { sut, passwordGeneratorSut, encrypterSut, repoSut, emailSenderSut } = makeSut();
    const passwordGenSpy = jest.spyOn(passwordGeneratorSut, 'generate');
    const encrypterSpy = jest.spyOn(encrypterSut, 'hash');
    const repoSpy = jest.spyOn(repoSut, 'update');
    const emailSenderSpy = jest.spyOn(emailSenderSut, 'send');
    await sut.recoverPassword('email@email.com');
    expect(passwordGenSpy).toHaveLastReturnedWith('Nova_senha');
    expect(encrypterSpy).toHaveBeenLastCalledWith('Nova_senha');
    expect(repoSpy).toHaveBeenLastCalledWith({ email: 'email@email.com', password: 'hash' });
    expect(emailSenderSpy).toHaveBeenLastCalledWith('email@email.com', 'Recuperação de email', 'Seu novo password é Nova_senha');
  });
});
