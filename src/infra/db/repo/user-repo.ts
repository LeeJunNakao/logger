import { UserRepo as IUserRepo } from './protocols/user-repo';
import { AddUserDto, UserDto } from '../../../domain/usecases/dto/user';
import { AlreadyRegisteredEmailError } from '../errors';
import pg from '../helpers/connect-helper';

export class UserRepo implements IUserRepo {
  async add(dto: AddUserDto): Promise<UserDto> {
    const existentEmail = (await pg.query('SELECT * FROM users WHERE email = $1', [dto.email])).rows;
    if(existentEmail.length) throw new AlreadyRegisteredEmailError();
    const { rows } = await pg.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [dto.name, dto.email, dto.password]);
    const user = rows[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
    };
  };

  async get(dto: UserDto): Promise<UserDto> {
    const condition = this.parseSearchQuery(dto);
    const { rows } = await pg.query(`SELECT * FROM users WHERE (${condition})`, null);
    const user = rows[0] || {};

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }

  private parseSearchQuery(dto: UserDto): string {
    const entries = Object.entries(dto).filter(e => e[1]);
    const entriesParsed = entries.map(e => this.parseString(e));
    const conditions = entriesParsed.map(c => c.join(' = '));
    const oration = conditions.join(' AND ');
    return oration;
  }

  private parseString(entry: any[]): any[] {
    const [key, value] = entry;
    if (typeof entry[1] === 'string') return [key, `'${value}'`];
    return entry;
  }
}
