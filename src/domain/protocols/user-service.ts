import { AddUserDto, LoginUserDto, UserInfoDto } from '../usecases/dto/user';
import { Token } from '../../api/protocols/http';

export interface IUserService{
  add: (dto: AddUserDto) => Promise<Token>,
  login: (dto: LoginUserDto) => Promise<Token>,
  validateToken: (token: Token) => Promise<UserInfoDto>,
  recoverPassword: (email: string) => Promise<void>,
}
