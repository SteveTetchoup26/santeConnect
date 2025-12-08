import { Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMedication {
  name: string;
  dose: string;
  frequency: string;
}

export interface IVitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  bloodSugar?: number;
  temperature?: number;
  weight?: number;
  height?: number;
}

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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, string>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}