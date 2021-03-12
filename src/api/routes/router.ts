import { Express } from 'express';
import { routeAdapter } from './adapter';
import { makeSignupController } from '../controllers';

export const registerRoutes = (app: Express): void => {
  app.post('/signup', routeAdapter(makeSignupController()));
};
