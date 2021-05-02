import { PasswordGenerator as IPasswordGenerator } from './protocols/password-generator';

export class PasswordGenerator implements IPasswordGenerator {
  private generateChar(): string {
    const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const index = Math.floor(Math.random() * (characters.length - 1));
    return characters[index];
  }

  generate(len: number = 7): string {
    const password: string[] = [];
    for (let i = 0; i < len; i++) {
      const char = this.generateChar();
      password.push(char);
    }
    return password.join('');
  }
}
