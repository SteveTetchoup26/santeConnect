import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from './responseHandler';
import mongoose from 'mongoose';
import Patient from '../models/Patient';

export const validateObjectId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ResponseHandler.badRequest(res, 'ID invalide');
    }
    
    next();
  };
};

export const validatePatientData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patient = new Patient(req.body);
    await patient.validate();
    next();
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors: Record<string, string> = {};

      for (const key in error.errors) {
        if (error.errors.hasOwnProperty(key)) {
          errors[key] = error.errors[key].message;
        }
      }

      return ResponseHandler.badRequest(res, 'Données invalides', errors);
    }

    return ResponseHandler.error(res, 'Erreur serveur', error.message);
  }
};

export const validateDossierData = (req: Request, res: Response, next: NextFunction) => {
  const { patientId } = req.body;
  
  if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
    return ResponseHandler.badRequest(res, 'ID patient invalide ou manquant');
  }

  next();
};