import { AddUserDto } from '../usecases/dto/user';
import { Token } from '../../api/protocols/http';

export interface IUserService{
  add: (dto: AddUserDto) => Promise<Token>,
}
