import request from 'supertest';
import app from '../app';
import { truncateDatabase } from '../../infra/db/helpers/query-helpers';

const data = { name: 'João das Neves', email: 'john@snow.com', password: 'Senha937#' };

describe('Signup route', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());
  const url = '/signup';
  test('Should return 400 if no data is provided', async() => {
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
      .send(data)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
      });
  });
});

describe('Signin route', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  const url = '/signin';
  test('Should return 400 if no data is provided', async() => {
    await request(app)
      .post(url)
      .send()
      .expect(400, { message: 'Missing param: email' });
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
      .expect(400, { message: 'Combination email and password is not valid' });
  });

  test('Should return status 400 if password is not valid', async() => {
    await request(app)
      .post(url)
      .send({ ...data, password: 'weak_password' })
      .expect(400, { message: 'Combination email and password is not valid' });
  });

  test('Should get token if all data are provided', async() => {
    await request(app).post('/signup').send(data);
    await request(app)
      .post(url)
      .send(data)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('Should return status 400 if email is wrong', async() => {
    await request(app).post('/signup').send(data);
    await request(app)
      .post(url)
      .send({ ...data, email: 'wrong_email@email.com' })
      .expect(400, { message: 'Combination email and password is not valid' });
  });

  test('Should return status 400 if password is wrong', async() => {
    await request(app).post('/signup').send(data);
    await request(app)
      .post(url)
      .send({ ...data, password: '*pYr99BNk7' })
      .expect(400, { message: 'Combination email and password is not valid' });
  });
});

describe('Validate token route', () => {
  beforeAll(async() => await truncateDatabase());
  afterEach(async() => await truncateDatabase());

  test('Should return 400 if token is invalid', async() => {
    await request(app)
      .post('/validate-token')
      .send({ token: 'invalid_token' })
      .expect(400, { message: 'Token is invalid' });
  });

  test('Should return user info if token is valid', async() => {
    await request(app).post('/signup')
      .send(data)
      .then(async(response) => {
        const token = response.body.token;

        await request(app)
          .post('/validate-token')
          .send({ token })
          .then(res => {
            const { name, email } = res.body;
            expect(res.status).toBe(200);
            expect(name).toBe(data.name);
            expect(email).toBe(data.email);
          });
      });
  });
});
