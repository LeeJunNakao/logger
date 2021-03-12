import express from 'express';
import { registerRoutes } from './routes/router';
import { setupMiddleware } from './config/middlewares';

const app = express();

setupMiddleware(app);
registerRoutes(app);

export default app;
