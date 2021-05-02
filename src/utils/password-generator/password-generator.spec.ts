import { PasswordGenerator } from './password-generator';

describe('Password Generator', () => {
  test('Should throw if password length is lower than 4', () => {
    const sut = new PasswordGenerator();
    expect(() => sut.generate(3)).toThrow();
  });

  test('Should generated password has a lower and a upper case letter, a especial character and a number', () => {
    const sut = new PasswordGenerator();
    const password = sut.generate();
    const regex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[-#!$%^&*()_+|~=`{}[\]:";'<>?,./\\ ])/;
    expect(password).toMatch(regex);
  });

  test('Should generated password with length equals to param provided', () => {
    const sut = new PasswordGenerator();
    const password = sut.generate(10);
    expect(password).toHaveLength(10);
  });
});
