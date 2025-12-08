import { Response } from 'express';
import { ApiResponse } from '../core/types';

export class ResponseHandler {
  static success<T>(res: Response, data: T, message: string = 'Opération réussie', statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message: string = 'Ressource créée avec succès'): Response {
    return this.success(res, data, message, 201);
  }

  static error(res: Response, message: string = 'Une erreur est survenue', statusCode: number = 500, error?: string | Record<string,string>): Response {
    const response: ApiResponse<null> = {
      success: false,
      message,
      error
    };
    return res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message: string = 'Requête invalide', error?: any): Response {
    return this.error(res, message, 400, error);
  }

  static notFound(res: Response, message: string = 'Ressource non trouvée'): Response {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message: string = 'Non autorisé'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Accès interdit'): Response {
    return this.error(res, message, 403);
  }

  static conflict(res: Response, message: string = 'Conflit de ressource'): Response {
    return this.error(res, message, 409);
  }
}