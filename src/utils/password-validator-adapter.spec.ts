import validator from 'validator';
import { PasswordValidatorAdapter } from './password-validator-adapter';

describe('Password Validator', () => {
  test('Should call validator with correct password', () => {
    const sut = new PasswordValidatorAdapter();
    const validatorSpy = jest.spyOn(validator, 'isStrongPassword');
    const correctPassword = 'correct_password';
    sut.validate(correctPassword);
    expect(validatorSpy).toBeCalledWith(correctPassword);
  });

  test('Should return false if password length is less than 8', () => {
    const sut = new PasswordValidatorAdapter();
    const password = 'Jd85&k';
    const isValid = sut.validate(password);
    expect(isValid).toBe(false);
  });

  test('Should return false if password has no symbol', () => {
    const sut = new PasswordValidatorAdapter();
    const password = 'Jd85ks09D';
    const isValid = sut.validate(password);
    expect(isValid).toBe(false);
  });

  test('Should return false if password has no upper case', () => {
    const sut = new PasswordValidatorAdapter();
    const password = 'jd85&k9z';
    const isValid = sut.validate(password);
    expect(isValid).toBe(false);
  });

  test('Should return false if password has no lower case', () => {
    const sut = new PasswordValidatorAdapter();
    const password = 'JD85&K9Z';
    const isValid = sut.validate(password);
    expect(isValid).toBe(false);
  });

  test('Should return true if password has all requirements', () => {
    const sut = new PasswordValidatorAdapter();
    const password = 'Jd85k&09';
    const isValid = sut.validate(password);
    expect(isValid).toBe(true);
  });

  test('Should return true if password has all requirements and length is higher than 8', () => {
    const sut = new PasswordValidatorAdapter();
    const password = 'Jd85k&09Kdaada';
    const isValid = sut.validate(password);
    expect(isValid).toBe(true);
  });
});
