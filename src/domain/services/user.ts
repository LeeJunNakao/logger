import { IUserService } from '../protocols/user-service';
import { AddUserDto, LoginUserDto, UserInfoDto } from '../usecases/dto/user';
import { Token } from '../../api/protocols/http';
import { UserRepo } from '../../infra/db/repo/protocols/user-repo';
import { Encrypter } from '../../utils/protocols/encrypter';
import { Jwt } from '../../utils/protocols/jwt';
import { AuthError, MissingParamError } from '../../api/errors';
import { PasswordGenerator } from 'src/utils/protocols';
import { EmailSender } from 'src/email-sender/protocols';

export class UserService implements IUserService {
  private readonly repo: UserRepo;
  private readonly encrypter: Encrypter;
  private readonly jwt: Jwt;
  private readonly passwordGenerator: PasswordGenerator;
  private readonly emailSender: EmailSender;

  constructor(repo: UserRepo, encrypter: Encrypter, jwt: Jwt, passwordGenerator: PasswordGenerator, emailSender: EmailSender) {
    this.repo = repo;
    this.encrypter = encrypter;
    this.jwt = jwt;
    this.passwordGenerator = passwordGenerator;
    this.emailSender = emailSender;
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

  async recoverPassword(email: string): Promise<void> {
    if (!email) throw new MissingParamError('email');
    const newPassword = this.passwordGenerator.generate();
    const hashedPassword = await this.encrypter.hash(newPassword);
    await this.repo.update({ email, password: hashedPassword });
    const emailSent = await this.emailSender.send(email, 'Recuperação de email', `Seu novo password é ${newPassword}`);
    if (!emailSent) throw new Error();
  }
}
