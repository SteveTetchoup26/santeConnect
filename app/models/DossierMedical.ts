import mongoose, { Schema } from 'mongoose';
import { IDossierMedical } from '../core/types';

const MedicationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Le nom du médicament est requis'],
    trim: true
  },
  dose: {
    type: String,
    required: [true, 'La dose est requise'],
    trim: true
  },
  frequency: {
    type: String,
    required: [true, 'La fréquence est requise'],
    trim: true
  }
}, { _id: false });

const VitalSignsSchema = new Schema({
  bloodPressure: {
    type: String,
    trim: true,
    match: [/^\d{2,3}\/\d{2,3}$/, 'Format de tension invalide (ex: 120/80)']
  },
  heartRate: {
    type: Number,
    min: [30, 'Fréquence cardiaque trop basse'],
    max: [250, 'Fréquence cardiaque trop élevée']
  },
  bloodSugar: {
    type: Number,
    min: [0, 'Glycémie invalide']
  },
  temperature: {
    type: Number,
    min: [30, 'Température trop basse'],
    max: [45, 'Température trop élevée']
  },
  weight: {
    type: Number,
    min: [0, 'Poids invalide']
  },
  height: {
    type: Number,
    min: [0, 'Taille invalide']
  }
}, { _id: false });

const LabResultSchema = new Schema({
  test: {
    type: String,
    required: true,
    trim: true
  },
  result: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const DossierMedicalSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'L\'ID du patient est requis'],
      index: true
    },
    allergies: {
      type: [String],
      default: []
    },
    medications: {
      type: [MedicationSchema],
      default: []
    },
    vitalSigns: {
      type: VitalSignsSchema,
      default: {}
    },
    diagnoses: {
      type: [String],
      default: []
    },
    labResults: {
      type: [LabResultSchema],
      default: []
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Les notes ne peuvent pas dépasser 2000 caractères']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

DossierMedicalSchema.index({ patientId: 1, createdAt: -1 });

// Méthode pour obtenir le dernier dossier d'un patient
DossierMedicalSchema.statics.getLatestByPatient = async function(patientId: string) {
  return this.findOne({ patientId })
    .sort({ createdAt: -1 })
    .populate('patientId', 'name email phone');
};

// Méthode pour obtenir l'historique complet d'un patient
DossierMedicalSchema.statics.getHistoryByPatient = async function(patientId: string) {
  return this.find({ patientId })
    .sort({ createdAt: -1 })
    .populate('patientId', 'name email phone');
};

export default mongoose.model<IDossierMedical>('DossierMedical', DossierMedicalSchema);