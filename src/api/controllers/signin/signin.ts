import { HttpRequest, HttpResponse, EmailValidator, PasswordValidator, Controller } from '../../protocols';
import { MissingParamError, AuthError } from '../../errors';
import { badRequest, serverError, authError } from '../../helpers';
import { IUserService } from '../../../domain/protocols/user-service';

export class SigninController implements Controller {
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
      const requiredFields = ['email', 'password'];
      const { email, password } = httpRequest.body;

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const emailIsValid = this.emailValidator.validate(email);
      const passwordIsValid = this.passwordValidator.validate(password);

      if (!emailIsValid || !passwordIsValid) return authError();

      const token = await this.userService.login({
        email,
        password,
      });

      return {
        status: 200,
        body: token,
      };
    } catch (error) {
      if (error instanceof AuthError) return authError();
      return serverError();
    }
  }
}
