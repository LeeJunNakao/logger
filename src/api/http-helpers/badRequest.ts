import { HttpResponse } from '../protocols/http';

export const badRequest = (error: Error): HttpResponse => ({
  status: 400,
  body: error,
});
