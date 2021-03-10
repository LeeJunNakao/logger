import { UsersModel } from '../../../../domain/models/user';
import { AddUserDto } from '../../../../domain/usecases/dto/user';

export interface UserRepo {
  add: (dto: AddUserDto) => Promise<UsersModel>,
}
