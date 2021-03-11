export interface AddUserDto {
  name: string,
  email: string,
  password: string,
}

export interface UserDto {
  id: string | number,
  name: string,
  email: string,
}
