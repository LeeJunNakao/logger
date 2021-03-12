import request from 'supertest';
import app from '../app';
import { truncateDatabase } from '../../infra/db/helpers/query-helpers';

const url = '/signup';

const data = { name: 'João das Neves', email: 'john@snow.com', password: 'Senha937#' };

describe('SignupController Integration', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should throw error if no data is provided', async() => {
    await request(app)
      .post(url)
      .send()
      .expect(400, { message: 'Missing param: name' });
  });

  test('Should return status 400 if no name is provided', async() => {
    await request(app)
      .post(url)
      .send({ ...data, name: null })
      .expect(400, { message: 'Missing param: name' });
  });

  test('Should return status 400 if no email is provided', async() => {
    await request(app)
      .post(url)
      .send({ ...data, email: null })
      .expect(400, { message: 'Missing param: email' });
  });

  test('Should return status 400 if no password is provided', async() => {
    await request(app)
      .post(url)
      .send({ ...data, password: null })
      .expect(400, { message: 'Missing param: password' });
  });

  test('Should return status 400 if email is not valid', async() => {
    await request(app)
      .post(url)
      .send({ ...data, email: 'invalid_email.com' })
      .expect(400, { message: 'Invalid param: email' });
  });

  test('Should return status 400 if password is not valid', async() => {
    await request(app)
      .post(url)
      .send({ ...data, password: 'weak_password' })
      .expect(400, { message: 'Invalid param: password' });
  });

  test('Should get token if all data are provided', async() => {
    await request(app)
      .post(url)
      .send({ ...data })
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
      });
  });
});
