import { ValidateTokenController } from './validate-token';
import { SigninController } from './signin';
import { makeSut, user } from './test-config';
import { tokenError } from '../helpers';

describe('Validate Token', () => {
  test('Should return 400 if service throws', async() => {
    const { userServiceSut } = makeSut(SigninController);
    const sut = new ValidateTokenController(userServiceSut);
    jest.spyOn(userServiceSut, 'validateToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const response = await sut.handle({ body: { token: 'invalid_token' } });
    expect(response).toEqual(tokenError());
  });

  test('Should return userInfo if token is valid', async() => {
    const { userServiceSut } = makeSut(SigninController);
    const sut = new ValidateTokenController(userServiceSut);
    const response = await sut.handle({ body: { token: 'valid_token' } });
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  });
});
