import { HttpResponse } from '../protocols/http';
import { ServerError, AuthError, InvalidTokenError } from '../errors';

export const badRequest = (error: Error): HttpResponse => ({
  status: 400,
  body: { message: error.message },
});

export const serverError = (): HttpResponse => ({
  status: 500,
  body: new ServerError(),
});

export const authError = (): HttpResponse => ({
  status: 400,
  body: { message: (new AuthError()).message },
});

export const tokenError = (): HttpResponse => ({
  status: 400,
  body: { message: new InvalidTokenError().message },
});

export const databaseError = (message: string): HttpResponse => ({
  status: 400,
  body: { message },
});
