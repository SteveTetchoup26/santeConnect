import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from './responseHandler';


export const notFoundHandler = (req: Request, res: Response) => {
  ResponseHandler.notFound(res, `Route ${req.originalUrl} non trouvée`);
};