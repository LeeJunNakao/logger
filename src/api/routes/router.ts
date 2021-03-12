import { Express } from 'express';

export const registerRoutes = (app: Express): void => {
  app.post('/signup', (req, res) => {
    console.log(req.body);
    res.json(req.body);
  });
};
