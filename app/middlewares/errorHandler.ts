import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from './responseHandler';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erreur:', err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return ResponseHandler.badRequest(res, 'Erreur de validation', messages.join(', '));
  }

  // Erreur de cast (ID MongoDB invalide)
  if (err.name === 'CastError') {
    return ResponseHandler.badRequest(res, 'ID invalide');
  }

  // Erreur de duplication (email ou phone déjà existant)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return ResponseHandler.conflict(res, `Ce ${field} existe déjà`);
  }

  // Erreur de syntaxe JSON
  if (err instanceof SyntaxError && 'body' in err) {
    return ResponseHandler.badRequest(res, 'Format JSON invalide');
  }

  // Erreur générique
  return ResponseHandler.error(
    res,
    err.message || 'Erreur interne du serveur',
    err.statusCode || 500
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  ResponseHandler.notFound(res, `Route ${req.originalUrl} non trouvée`);
};