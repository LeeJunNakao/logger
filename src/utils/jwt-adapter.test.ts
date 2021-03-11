import { JwtAdapter } from './jwt-adapter';
import sinon from 'sinon';

describe('Json Web Token Adapter', () => {
  test('Should return token', async() => {
    const data = { id: 5, name: 'james' };
    const sut = new JwtAdapter();
    const token = await sut.encode(data);

    expect(token.token).toBeTruthy();
  });

  test('Should decode token', async() => {
    const data = { id: 5, name: 'james' };
    const sut = new JwtAdapter();
    const token = await sut.encode(data);
    const decoded = await sut.decode(token);

    expect(decoded.data).toEqual(data);
  });

  test('Should throw if token is expired', async() => {
    sinon.useFakeTimers();
    const clock = sinon.useFakeTimers();

    const data = { id: 5, name: 'james' };
    const sut = new JwtAdapter();
    const token = await sut.encode(data);

    clock.tick(Math.floor(Date.now() / 1000) + 99999999);

    const promise = sut.decode(token);

    await expect(promise).rejects.toThrow();
  });
});
