import { Token } from '../../api/protocols';

export interface Jwt {
  encode: (value: any) => Promise<Token>,
  decode: (token: Token) => Promise<any>,
}
