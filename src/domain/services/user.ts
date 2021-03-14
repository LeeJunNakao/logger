import { IUserService } from '../protocols/user-service';
import { AddUserDto, LoginUserDto, UserInfoDto } from '../usecases/dto/user';
import { Token } from '../../api/protocols/http';
import { UserRepo } from '../../infra/db/repo/protocols/user-repo';
import { Encrypter } from '../../utils/protocols/encrypter';
import { Jwt } from '../../utils/protocols/jwt';
import { AuthError } from '../../api/errors';

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

  async login(dto: LoginUserDto): Promise<Token> {
    const user = await this.repo.get({ email: dto.email, password: '', name: '', id: '' });
    if (!user.email) throw new AuthError();
    const isValid = await this.encrypter.isValid(dto.password, user.password);
    if (!isValid) throw new AuthError();
    const token = await this.jwt.encode({ id: user.id, name: user.name, email: user.email });
    return token;
  }

  async validateToken(token: Token): Promise<UserInfoDto> {
    const { id, name, email } = (await this.jwt.decode(token)).data;
    return { id, name, email };
  }
}
