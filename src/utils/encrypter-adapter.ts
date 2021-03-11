import { Encrypter } from './protocols/encrypter';
import bcrypt from 'bcrypt';

export class EncrypterAdapter implements Encrypter {
  private readonly saltRounds: Number;

  constructor() {
    this.saltRounds = 12;
  }

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.saltRounds);
    return hash;
  }

  async isValid(unhashed: string, hash: string): Promise<Boolean> {
    const isValid = await bcrypt.compare(unhashed, hash);
    return isValid;
  }
}
