import { RecoverPasswordController } from './recover-password';
import { makeUserService } from '../test-config';
import { IUserService } from 'src/domain/protocols/user-service';

const httpRequest = {
  body: {
    email: 'email@email.com',
  },
};

const makeSut = (): { sut: RecoverPasswordController, userSut: IUserService } => {
  const userSut = makeUserService();
  const sut = new RecoverPasswordController(userSut);
  return { sut, userSut };
};

describe('RecoverPassword Controller', () => {
  test('Should return 400 if user service throws', async() => {
    const { sut, userSut } = makeSut();
    jest.spyOn(userSut, 'recoverPassword').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const response = await sut.handle(httpRequest);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('could not recover the password');
  });

  test('Should return 200 if password is recovered successfully', async() => {
    const { sut } = makeSut();
    const response = await sut.handle(httpRequest);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('recovery email sent successfully');
  });
});
