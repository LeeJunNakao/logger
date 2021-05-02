export interface UserDto {
  id: string | number,
  name: string,
  email: string,
  password: string,
}

export interface AddUserDto {
  name: string,
  email: string,
  password: string,
}

export interface LoginUserDto {
  email: string,
  password: string,
}

export interface UserInfoDto {
  id: string | number,
  name: string,
  email: string,
}

export interface UpdateUserDto {
  id?: string | number,
  name?: string,
  email?: string,
  password?: string,
}
