import { Token } from '../api/protocols';
import { Jwt } from './protocols/jwt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export class JwtAdapter implements Jwt {
  private readonly key: string;
  expirationTime: number;

  constructor() {
    this.key = env.JWT_KEY;
  }

  private getTimeExpiration(): number {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const oneDayInSeconds = (60 * 60 * 24);
    return timestampInSeconds + oneDayInSeconds;
  }

  async encode(data: any): Promise<Token> {
    const expirationTime = this.getTimeExpiration();
    const token = await jwt.sign({ exp: expirationTime, data }, this.key);
    return { token };
  }

  async decode(token: Token): Promise<any> {
    const decoded = await jwt.verify(token.token, this.key);
    return decoded;
  }
}
