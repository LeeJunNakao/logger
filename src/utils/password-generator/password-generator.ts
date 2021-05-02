import { PasswordGenerator as IPasswordGenerator } from '../protocols/password-generator';

export class PasswordGenerator implements IPasswordGenerator {
  private generateChar(): string {
    const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const index = Math.floor(Math.random() * (characters.length - 1));
    return characters[index];
  }

  private generateNumber(): string {
    const number = Math.floor(Math.random() * 9);
    return String(number);
  }

  private generateSpecialCharacter(): string {
    const characters = String.raw`^[-#!$%^&*()_+|~=\`{}\[\]:";'<>?,.\/ ]$`;
    const index = Math.floor(Math.random() * (characters.length - 1));
    return characters[index];
  }

  private generateLetter(upper?: boolean): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const index = Math.floor(Math.random() * (characters.length - 1));
    const char = characters[index];
    return upper ? char.toUpperCase() : char;
  }

  generate(len: number = 7): string {
    const password: string[] = [];
    if (len < 4) throw new Error();

    password.push(this.generateLetter());
    password.push(this.generateLetter(true));
    password.push(this.generateSpecialCharacter());
    password.push(this.generateNumber());

    for (let i = 4; i < len; i++) {
      const char = this.generateChar();
      password.push(char);
    }

    return password.join('');
  }
}
