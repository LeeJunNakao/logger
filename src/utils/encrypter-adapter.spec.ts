import { EncrypterAdapter } from './encrypter-adapter';
import bcrypt from 'bcrypt';

const password = 'valid_password';

const saltRounds = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise(resolve => resolve('hashed_password'));
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

  test('Shoul return hashed value', async() => {
    const sut = new EncrypterAdapter();
    const hashed = await sut.hash(password);
    expect(hashed).toBe('hashed_password');
  });
});
