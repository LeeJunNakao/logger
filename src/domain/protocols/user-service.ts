import { AddUserDto } from '../usecases/dto/user';
import { Token } from '../../api/protocols/http';
import { UserRepo } from '../../infra/db/repo/protocols/user-repo';
import { Encrypter } from '../../utils/protocols/encrypter';
import { Jwt } from '../../utils/protocols/jwt';

export interface IUserService{
  add: (dto: AddUserDto, repo: UserRepo, encrypter: Encrypter, jwt: Jwt) => Promise<Token>,
}
