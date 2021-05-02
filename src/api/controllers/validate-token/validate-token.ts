import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { IUserService } from '../../../domain/protocols/user-service';
import { tokenError } from '../../helpers';

export class ValidateTokenController implements Controller {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { token } = httpRequest.body;
      const userInfo = await this.userService.validateToken({ token });

      return {
        status: 200,
        body: userInfo,
      };
    } catch (error) {
      return tokenError();
    }
  }
}
