import { Request, Response, NextFunction } from 'express';
import Patient from '../models/Patient';
import DossierMedical from '../models/DossierMedical';
import { ResponseHandler } from '../middlewares/responseHandler';

export class PatientController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, dateOfBirth } = req.body;

      const patient = await Patient.create({
        name,
        email,
        phone,
        dateOfBirth
      });

      return ResponseHandler.created(res, patient, 'Patient créé avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [patients, total] = await Promise.all([
        Patient.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        Patient.countDocuments()
      ]);

      const response = {
        patients,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };

      return ResponseHandler.success(res, response, 'Patients récupérés avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const patient = await Patient.findById(id);

      if (!patient) {
        return ResponseHandler.notFound(res, 'Patient non trouvé');
      }

      return ResponseHandler.success(res, patient, 'Patient récupéré avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query;

      if (!query) {
        return ResponseHandler.badRequest(res, 'Paramètre de recherche manquant');
      }

      const patients = await Patient.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { phone: { $regex: query, $options: 'i' } }
        ]
      } as any).limit(20);

      return ResponseHandler.success(res, patients, `${patients.length} patient(s) trouvé(s)`);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const patient = await Patient.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );

      if (!patient) {
        return ResponseHandler.notFound(res, 'Patient non trouvé');
      }

      return ResponseHandler.success(res, patient, 'Patient mis à jour avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const patient = await Patient.findByIdAndDelete(id);

      if (!patient) {
        return ResponseHandler.notFound(res, 'Patient non trouvé');
      }

      await DossierMedical.deleteMany({ patientId: id });

      return ResponseHandler.success(
        res,
        { deletedPatient: patient },
        'Patient et ses dossiers médicaux supprimés avec succès'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const total = await Patient.countDocuments();
      const recentPatients = await Patient.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt');

      const stats = {
        totalPatients: total,
        recentPatients
      };

      return ResponseHandler.success(res, stats, 'Statistiques récupérées avec succès');
    } catch (error) {
      next(error);
    }
  }
}