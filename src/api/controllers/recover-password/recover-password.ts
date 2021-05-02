import { Controller, HttpRequest, HttpResponse } from 'src/api/protocols';
import { IUserService } from 'src/domain/protocols/user-service';

export class RecoverPasswordController implements Controller {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email } = httpRequest.body;

      await this.userService.recoverPassword(email);

      return {
        status: 200,
        body: { message: 'recovery email sent successfully' },
      };
    } catch (error) {
      return {
        status: 400,
        body: {
          message: 'could not recover the password',
        },
      };
    }
  }
}
