import { Document } from 'mongoose';

// Interface pour les Patients
export interface IPatient extends Document {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface pour les Médicaments
export interface IMedication {
  name: string;
  dose: string;
  frequency: string;
}

// Interface pour les Signes Vitaux
export interface IVitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  bloodSugar?: number;
  temperature?: number;
  weight?: number;
  height?: number;
}

// Interface pour les Dossiers Médicaux
export interface IDossierMedical extends Document {
  patientId: string;
  allergies: string[];
  medications: IMedication[];
  vitalSigns: IVitalSigns;
  diagnoses?: string[];
  labResults?: Array<{
    test: string;
    result: string;
    date: Date;
  }>;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}