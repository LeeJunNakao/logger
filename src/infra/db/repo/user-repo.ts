import { UserRepo as IUserRepo } from './protocols/user-repo';
import { AddUserDto, UserDto, UpdateUserDto } from '../../../domain/usecases/dto/user';
import { AlreadyRegisteredEmailError, NoMatchesError } from '../errors';
import pg from '../helpers/connect-helper';
import { removeEmptyFields, parseEqual, parseString } from './utils';

export class UserRepo implements IUserRepo {
  async add(dto: AddUserDto): Promise<UserDto> {
    const existentEmail = (await pg.query('SELECT * FROM users WHERE email = $1', [dto.email])).rows;
    if (existentEmail.length) throw new AlreadyRegisteredEmailError();
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

  async update(dto: UpdateUserDto): Promise<UserDto> {
    const query = this.parseUpdateQuery(dto);
    const { rows } = await pg.query(query, null);
    if (!rows.length) throw new NoMatchesError();
    return rows[0];
  }

  private parseUpdateQuery(dto: UpdateUserDto): string {
    const parsedDto = removeEmptyFields(dto);
    if (dto.id) {
      const { id, ...dtoWithoutId } = parsedDto;
      const stringifiedValues = parseEqual(dtoWithoutId);
      return `UPDATE users SET ${stringifiedValues} WHERE id = ${dto.id} RETURNING *`;
    } else if (dto.email) {
      const { email, ...dtoWithouEmail } = parsedDto;
      const stringifiedValues = parseEqual(dtoWithouEmail);
      return `UPDATE users SET ${stringifiedValues} WHERE email = '${dto.email}' RETURNING *`;
    } else throw new Error();
  }

  private parseSearchQuery(dto: UserDto): string {
    const entries = Object.entries(dto).filter(e => e[1]);
    const entriesParsed = entries.map(e => parseString(e));
    const conditions = entriesParsed.map(c => c.join(' = '));
    const oration = conditions.join(' AND ');
    return oration;
  }
}
