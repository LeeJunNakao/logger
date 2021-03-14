import { Express } from 'express';
import { routeAdapter } from './adapter';
import { makeSignupController, makeSigninController, makeValidateTokenController } from '../controllers';

export const registerRoutes = (app: Express): void => {
  app.post('/signup', routeAdapter(makeSignupController()));
  app.post('/signin', routeAdapter(makeSigninController()));
  app.post('/validate-token', routeAdapter(makeValidateTokenController()));
};
