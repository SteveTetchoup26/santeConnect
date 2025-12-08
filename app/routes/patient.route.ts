import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { validateObjectId, validatePatientData } from '../middlewares/validator';

const router = Router();

/**
 * @route   POST /api/patients
 * @desc    Créer un nouveau patient
 * @access  Public
 */
router.post('/', validatePatientData, PatientController.create);

/**
 * @route   GET /api/patients
 * @desc    Obtenir tous les patients (avec pagination)
 * @query   page, limit
 * @access  Public
 */
router.get('/', PatientController.getAll);

/**
 * @route   GET /api/patients/stats
 * @desc    Obtenir les statistiques des patients
 * @access  Public
 */
router.get('/stats', PatientController.getStats);

/**
 * @route   GET /api/patients/search
 * @desc    Rechercher des patients
 * @query   query
 * @access  Public
 */
router.get('/search', PatientController.search);

/**
 * @route   GET /api/patients/:id
 * @desc    Obtenir un patient par ID
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), PatientController.getById);

/**
 * @route   PUT /api/patients/:id
 * @desc    Mettre à jour un patient
 * @access  Public
 */
router.put('/:id', validateObjectId('id'), PatientController.update);

/**
 * @route   DELETE /api/patients/:id
 * @desc    Supprimer un patient
 * @access  Public
 */
router.delete('/:id', validateObjectId('id'), PatientController.delete);

export default router;