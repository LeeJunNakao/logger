import { HttpRequest, HttpResponse, EmailValidator, PasswordValidator, Controller } from '../../protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError, databaseError } from '../../helpers';
import { IUserService } from '../../../domain/protocols/user-service';

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly passwordValidator: PasswordValidator;
  private readonly userService: IUserService;

  constructor(emailValidator: EmailValidator, passwordValidator: PasswordValidator, userService: IUserService) {
    this.emailValidator = emailValidator;
    this.passwordValidator = passwordValidator;
    this.userService = userService;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password'];
      const { name, email, password } = httpRequest.body;

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const emailIsValid = this.emailValidator.validate(email);
      const passwordIsValid = this.passwordValidator.validate(password);

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }
      if (!passwordIsValid) {
        return badRequest(new InvalidParamError('password'));
      }

      const token = await this.userService.add({
        name,
        email,
        password,
      });

      return {
        status: 200,
        body: token,
      };
    } catch (error) {
      if (error.type === 'Database') return databaseError(error.message);
      return serverError();
    }
  }
}
