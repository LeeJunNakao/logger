import { AddUserDto, UserDto } from '../../../../domain/usecases/dto/user';

export interface UserRepo {
  add: (dto: AddUserDto) => Promise<UserDto>,
  get: (id: string | number) => Promise<UserDto>,
}
