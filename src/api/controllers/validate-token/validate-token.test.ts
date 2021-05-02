import { makeValidateTokenController, makeSignupController } from '../index';
import { tokenError } from '../../helpers';
import { truncateDatabase } from '../../../infra/db/helpers/query-helpers';

const user = {
  name: 'Fulano de Aragão',
  email: 'fulano@email.com',
  password: 'N15f8f&s',
};

describe('Validate Token Integration', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should return 400 token is not valid', async() => {
    const sut = makeValidateTokenController();
    const response = await sut.handle({ body: 'invalid_token' });
    expect(response).toEqual(tokenError());
  });

  test('Should return user info if token is valid', async() => {
    const sut = makeValidateTokenController();
    const signupSut = makeSignupController();
    const token = (await signupSut.handle({ body: user })).body;
    const response = await sut.handle({ body: token });
    const { name, email, id } = response.body;
    expect(response.status).toBe(200);
    expect(name).toBe(user.name);
    expect(email).toBe(user.email);
    expect(id).toBeTruthy();
  });
});
