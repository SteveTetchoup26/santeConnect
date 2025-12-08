import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../utils/responseHandler';
import mongoose from 'mongoose';

export const validateObjectId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ResponseHandler.badRequest(res, 'ID invalide');
    }
    
    next();
  };
};

export const validatePatientData = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, dateOfBirth } = req.body;
  const errors: string[] = [];

  if (!name || name.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Email invalide');
  }

  if (!phone || !/^\+237[0-9]{9}$/.test(phone)) {
    errors.push('Le numéro doit être au format +237XXXXXXXXX');
  }

  if (!dateOfBirth || new Date(dateOfBirth) >= new Date()) {
    errors.push('Date de naissance invalide');
  }

  if (errors.length > 0) {
    return ResponseHandler.badRequest(res, 'Données invalides', errors.join(', '));
  }

  next();
};

export const validateDossierData = (req: Request, res: Response, next: NextFunction) => {
  const { patientId } = req.body;
  
  if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
    return ResponseHandler.badRequest(res, 'ID patient invalide ou manquant');
  }

  next();
};