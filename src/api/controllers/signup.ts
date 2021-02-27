import { HttpRequest, HttpResponse, EmailValidator, PasswordValidator } from '../protocols';
import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest } from '../http-helpers/badRequest';

export class SignupController {
  private readonly emailValidator: EmailValidator;
  private readonly passwordValidator: PasswordValidator;

  constructor(emailValidator: EmailValidator, passwordValidator: PasswordValidator) {
    this.emailValidator = emailValidator;
    this.passwordValidator = passwordValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
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
    return {
      status: 200,
      body: null,
    };
  }
}
