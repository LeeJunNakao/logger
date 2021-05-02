import { EncrypterAdapter } from './encrypter-adapter';
import bcrypt from 'bcrypt';

describe('Encrypter Adapter Integration', () => {
  test('Should return hash value', async() => {
    const sut = new EncrypterAdapter();
    const password = 'some_password';
    const hash = await sut.hash(password);
    expect(hash).not.toEqual(password);
  });

  test('Should hash be equal only with original value when compared', async() => {
    const sut = new EncrypterAdapter();
    const password = 'original_password';
    const hash = await sut.hash(password);
    const valid = await bcrypt.compare(password, hash);
    const invalid = await bcrypt.compare('other_password', hash);
    expect(valid).toBe(true);
    expect(invalid).toBe(false);
  });

  test('Should return true when original value is compared', async() => {
    const sut = new EncrypterAdapter();
    const password = 'original_password';
    const hash = await sut.hash(password);
    const isValid = await sut.isValid(password, hash);
    expect(isValid).toBe(true);
  });

  test('Should return false when different valuesis compared', async() => {
    const sut = new EncrypterAdapter();
    const password = 'original_password';
    const hash = await sut.hash(password);
    const isValid = await sut.isValid('wrong_password', hash);
    expect(isValid).toBe(false);
  });
});
