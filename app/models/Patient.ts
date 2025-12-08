import mongoose, { Schema } from 'mongoose';
import { IPatient } from '../core/types';

const PatientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
      trim: true,
      match: [/^\+237[0-9]{9}$/, 'Le numéro doit être au format +237XXXXXXXXX']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'La date de naissance est requise'],
      validate: {
        validator: function(value: Date) {
          return value < new Date();
        },
        message: 'La date de naissance doit être dans le passé'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index pour améliorer les performances de recherche
PatientSchema.index({ email: 1 });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ name: 'text' });

// Méthode virtuelle pour calculer l'âge
PatientSchema.virtual('age').get(function(this: IPatient) {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Configuration pour inclure les virtuels dans JSON
PatientSchema.set('toJSON', { virtuals: true });
PatientSchema.set('toObject', { virtuals: true });

export default mongoose.model<IPatient>('Patient', PatientSchema);