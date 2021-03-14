import { AddUserDto, LoginUserDto, UserInfoDto } from '../../domain/usecases/dto/user';
import { IUserService } from '../../domain/protocols/user-service';
import { EmailValidator, PasswordValidator, Token, Controller } from '../protocols';
import { SignupController } from './signup';
import { SigninController } from './signin';

interface SutTypes{
  sut: Controller,
  emailValidatorSut: EmailValidator,
  passwordValidatorSut: PasswordValidator,
  userServiceSut: IUserService,
}

class EmailValidatorSut implements EmailValidator {
  validate(email: string): Boolean {
    return true;
  }
}

class PasswordValidatorSut implements PasswordValidator {
  validate(password: string): Boolean {
    return true;
  }
}

type IController = new (emailValidator: EmailValidator, passwordValidator: PasswordValidator, userService: IUserService) => SignupController | SigninController;

export const makeUserService = (): IUserService => {
  class Service implements IUserService {
    async add(dto: AddUserDto): Promise<Token> {
      return await new Promise(resolve => resolve({ token: 'valid_token' }));
    }

    async login(dto: LoginUserDto): Promise<Token> {
      return await new Promise(resolve => resolve({ token: 'valid_token' }));
    }

    async validateToken(token: Token): Promise<UserInfoDto> {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
  }

  return new Service();
};

export const makeSut = (ControllerClass: IController): SutTypes => {
  const emailValidatorSut: EmailValidator = new EmailValidatorSut();
  const passwordValidatorSut: PasswordValidator = new PasswordValidatorSut();
  const Controller: any = ControllerClass;
  const userServiceSut = makeUserService();
  const sut = new Controller(emailValidatorSut, passwordValidatorSut, userServiceSut);
  return { sut, emailValidatorSut, passwordValidatorSut, userServiceSut };
};

export const user = {
  id: 254,
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password',
};
