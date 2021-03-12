import { Express } from 'express';
import { bodyParser } from './body-parser';
import { contentType } from './content-type';
import { cors } from './cors';

export const setupMiddleware = (app: Express): void => {
  app.use(bodyParser);
  app.use(contentType);
  app.use(cors);
};
