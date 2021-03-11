import { EncrypterAdapter } from './encrypter-adapter';
import bcrypt from 'bcrypt';

const password = 'valid_password';

const saltRounds = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise(resolve => resolve('hashed_password'));
  },
  async compare(): Promise<Boolean> {
    return await new Promise(resolve => resolve(true));
  },
}));

describe('Encrypter Adapter', () => {
  test('Should call encrypter with correct value', async() => {
    const sut = new EncrypterAdapter();
    const encrypterSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash(password);
    expect(encrypterSpy).toHaveBeenCalledWith(password, saltRounds);
  });

  test('Should throw if encrypter throws', async() => {
    const sut = new EncrypterAdapter();
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.hash(password);
    await expect(promise).rejects.toThrow();
  });

  test('Should return hashed value', async() => {
    const sut = new EncrypterAdapter();
    const hashed = await sut.hash(password);
    expect(hashed).toBe('hashed_password');
  });

  test('Should call compare function with correct data', async() => {
    const sut = new EncrypterAdapter();
    const compareSpy = jest.spyOn(sut, 'isValid');
    const hashed = await sut.hash(password);
    await sut.isValid(password, hashed);
    expect(compareSpy).toBeCalledWith(password, hashed);
  });

  test('Should return true when compared original with hash', async() => {
    const sut = new EncrypterAdapter();
    const hashed = await sut.hash(password);
    const isValid = await sut.isValid(password, hashed);
    expect(isValid).toBe(true);
  });

  test('Should return true when compared different value with hash', async() => {
    const sut = new EncrypterAdapter();
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));
    const hashed = await sut.hash(password);
    const isValid = await sut.isValid('other_password', hashed);
    expect(isValid).toBe(false);
  });
});
