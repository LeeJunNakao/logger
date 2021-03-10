import { IUserService } from '../protocols/user-service';
import { AddUserDto } from '../usecases/dto/user';
import { Token } from '../../api/protocols/http';
import { UserRepo } from '../../infra/db/repo/protocols/user-repo';
import { Encrypter } from '../../utils/protocols/encrypter';
import { Jwt } from '../../utils/protocols/jwt';

export class UserService implements IUserService {
  async add(dto: AddUserDto, repo: UserRepo, encrypter: Encrypter, jwt: Jwt): Promise<Token> {
    const hashedPassword = await encrypter.hash(dto.password);
    const user = repo.add({ ...dto, password: hashedPassword });
    const token = await jwt.encode({ id: user.id });
    return token;
  }
}
