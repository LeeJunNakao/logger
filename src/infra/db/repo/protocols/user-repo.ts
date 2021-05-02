import { AddUserDto, UserDto, UpdateUserDto } from '../../../../domain/usecases/dto/user';

export interface UserRepo {
  add: (dto: AddUserDto) => Promise<UserDto>,
  get: (userInfo: UserDto) => Promise<UserDto>,
  update: (dto: UpdateUserDto) => Promise<UserDto>,
}
