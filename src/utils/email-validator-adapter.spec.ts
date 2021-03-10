import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';

const email = 'correct_email@email.com';

describe('Email Validator', () => {
  test('Should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter();
    const validatorSpy = jest.spyOn(validator, 'isEmail');
    sut.validate(email);
    expect(validatorSpy).toBeCalledWith(email);
  });

  test('Should return true if email is valid', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.validate(email);
    expect(isValid).toBe(true);
  });

  test('Should return false if email is not valid', () => {
    const sut = new EmailValidatorAdapter();
    const invalidEmail = 'invalid_email.com';
    const isValid = sut.validate(invalidEmail);
    expect(isValid).toBe(false);
    const otherInvalidEmail = 'invalid_email@email';
    const otherIsvalid = sut.validate(otherInvalidEmail);
    expect(otherIsvalid).toBe(false);
  });
});
