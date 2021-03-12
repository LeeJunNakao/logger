import { Request, Response } from 'express';
import { Controller } from '../protocols';

export const routeAdapter = (controller: Controller) => {
  return async(req: Request, res: Response): Promise<void> => {
    const httpResponse = await controller.handle({ body: req.body });
    res.status(httpResponse.status).send(httpResponse.body);
  };
};
