import { IUserService } from '../protocols/user-service';
import { AddUserDto } from '../usecases/dto/user';
import { Token } from '../../api/protocols/http';
import { UserRepo } from '../../infra/db/repo/protocols/user-repo';
import { Encrypter } from '../../utils/protocols/encrypter';
import { Jwt } from '../../utils/protocols/jwt';

export class UserService implements IUserService {
  private readonly repo: UserRepo;
  private readonly encrypter: Encrypter;
  private readonly jwt: Jwt;

  constructor(repo: UserRepo, encrypter: Encrypter, jwt: Jwt) {
    this.repo = repo;
    this.encrypter = encrypter;
    this.jwt = jwt;
  }

  async add(dto: AddUserDto): Promise<Token> {
    const hashedPassword = await this.encrypter.hash(dto.password);
    const user = await this.repo.add({ ...dto, password: hashedPassword });
    const token = await this.jwt.encode({ id: user.id, name: user.name, email: user.email });
    return token;
  }
}
