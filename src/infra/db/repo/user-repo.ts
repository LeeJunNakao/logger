import { UserRepo as IUserRepo } from './protocols/user-repo';
import { AddUserDto, UserDto } from '../../../domain/usecases/dto/user';
import pg from '../helpers/connect-helper';

export class UserRepo implements IUserRepo {
  async add(dto: AddUserDto): Promise<UserDto> {
    const { rows } = await pg.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [dto.name, dto.email, dto.password]);
    const user = rows[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };

  async get(id: string | number): Promise<UserDto> {
    const { rows } = await pg.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = rows[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
