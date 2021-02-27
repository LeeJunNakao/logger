import { HttpRequest, HttpResponse, EmailValidator, PasswordValidator, PasswordHasher } from '../protocols';
import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers';

export class SignupController {
  private readonly emailValidator: EmailValidator;
  private readonly passwordValidator: PasswordValidator;
  private readonly passwordHasher: PasswordHasher;

  constructor(emailValidator: EmailValidator, passwordValidator: PasswordValidator, passwordHasher: PasswordHasher) {
    this.emailValidator = emailValidator;
    this.passwordValidator = passwordValidator;
    this.passwordHasher = passwordHasher;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password'];
      const { email, password } = httpRequest.body;

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

      this.passwordHasher.hash(password);

      return {
        status: 200,
        body: null,
      };
    } catch (error) {
      return serverError();
    }
  }
}
