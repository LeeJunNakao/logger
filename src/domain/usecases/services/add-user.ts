import { AddUserDto } from '../dto/user';
import { Token } from '../../../api/protocols/http';

export interface UserService{
  add: (dto: AddUserDto) => Promise<Token>,
}
