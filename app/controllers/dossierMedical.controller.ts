import { Request, Response, NextFunction } from 'express';
import DossierMedical from '../models/DossierMedical';
import Patient from '../models/Patient';
import { ResponseHandler } from '../middlewares/responseHandler';

export class DossierMedicalController {
  // Créer un nouveau dossier médical
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, allergies, medications, vitalSigns, diagnoses, labResults, notes } = req.body;

      // Vérifier que le patient existe
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return ResponseHandler.notFound(res, 'Patient non trouvé');
      }

      const dossier = await DossierMedical.create({
        patientId,
        allergies: allergies || [],
        medications: medications || [],
        vitalSigns: vitalSigns || {},
        diagnoses: diagnoses || [],
        labResults: labResults || [],
        notes: notes || ''
      });

      const populatedDossier = await DossierMedical.findById(dossier._id)
        .populate('patientId', 'name email phone dateOfBirth');

      return ResponseHandler.created(res, populatedDossier, 'Dossier médical créé avec succès');
    } catch (error) {
      next(error);
    }
  }

  // Obtenir tous les dossiers médicaux avec pagination
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [dossiers, total] = await Promise.all([
        DossierMedical.find()
          .populate('patientId', 'name email phone')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        DossierMedical.countDocuments()
      ]);

      const response = {
        dossiers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };

      return ResponseHandler.success(res, response, 'Dossiers médicaux récupérés avec succès');
    } catch (error) {
      next(error);
    }
  }

  // Obtenir un dossier par ID
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const dossier = await DossierMedical.findById(id)
        .populate('patientId', 'name email phone dateOfBirth');

      if (!dossier) {
        return ResponseHandler.notFound(res, 'Dossier médical non trouvé');
      }

      return ResponseHandler.success(res, dossier, 'Dossier médical récupéré avec succès');
    } catch (error) {
      next(error);
    }
  }

  // Obtenir tous les dossiers d'un patient
  static async getByPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId } = req.params;

      // Vérifier que le patient existe
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return ResponseHandler.notFound(res, 'Patient non trouvé');
      }

      const dossiers = await DossierMedical.find({ patientId })
        .sort({ createdAt: -1 })
        .populate('patientId', 'name email phone dateOfBirth');

      return ResponseHandler.success(
        res,
        { patient, dossiers, total: dossiers.length },
        `${dossiers.length} dossier(s) trouvé(s) pour ce patient`
      );
    } catch (error) {
      next(error);
    }
  }

  // Obtenir le dernier dossier d'un patient
  static async getLatestByPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId } = req.params;

      const dossier = await DossierMedical.findOne({ patientId })
        .sort({ createdAt: -1 })
        .populate('patientId', 'name email phone dateOfBirth');

      if (!dossier) {
        return ResponseHandler.notFound(res, 'Aucun dossier médical trouvé pour ce patient');
      }

      return ResponseHandler.success(res, dossier, 'Dernier dossier récupéré avec succès');
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour un dossier médical
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Ne pas permettre la modification du patientId
      delete updates.patientId;

      const dossier = await DossierMedical.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      ).populate('patientId', 'name email phone dateOfBirth');

      if (!dossier) {
        return ResponseHandler.notFound(res, 'Dossier médical non trouvé');
      }

      return ResponseHandler.success(res, dossier, 'Dossier médical mis à jour avec succès');
    } catch (error) {
      next(error);
    }
  }

  // Ajouter un médicament
  static async addMedication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const medication = req.body;

      const dossier = await DossierMedical.findByIdAndUpdate(
        id,
        { $push: { medications: medication } },
        { new: true, runValidators: true }
      ).populate('patientId', 'name email phone');

      if (!dossier) {
        return ResponseHandler.notFound(res, 'Dossier médical non trouvé');
      }

      return ResponseHandler.success(res, dossier, 'Médicament ajouté avec succès');
    } catch (error) {
      next(error);
    }
  }

  // Ajouter un résultat de laboratoire
  static async addLabResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const labResult = req.body;

      const dossier = await DossierMedical.findByIdAndUpdate(
        id,
        { $push: { labResults: labResult } },
        { new: true, runValidators: true }
      ).populate('patientId', 'name email phone');

      if (!dossier) {
        return ResponseHandler.notFound(res, 'Dossier médical non trouvé');
      }

      return ResponseHandler.success(res, dossier, 'Résultat de laboratoire ajouté avec succès');
    } catch (error) {
      next(error);
    }
  }

  // Supprimer un dossier médical
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const dossier = await DossierMedical.findByIdAndDelete(id);

      if (!dossier) {
        return ResponseHandler.notFound(res, 'Dossier médical non trouvé');
      }

      return ResponseHandler.success(
        res,
        { deletedDossier: dossier },
        'Dossier médical supprimé avec succès'
      );
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les statistiques
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const total = await DossierMedical.countDocuments();
      const recentDossiers = await DossierMedical.find()
        .populate('patientId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('patientId createdAt');

      const stats = {
        totalDossiers: total,
        recentDossiers
      };

      return ResponseHandler.success(res, stats, 'Statistiques récupérées avec succès');
    } catch (error) {
      next(error);
    }
  }
}