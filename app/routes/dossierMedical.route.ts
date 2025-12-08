import { Router } from 'express';
import { DossierMedicalController } from '../controllers/dossierMedical.controller';
import { validateObjectId, validateDossierData } from '../middlewares/validator';

const router = Router();

/**
 * @route   POST /api/dossiers
 * @desc    Créer un nouveau dossier médical
 * @access  Public
 */
router.post('/', validateDossierData, DossierMedicalController.create);

/**
 * @route   GET /api/dossiers
 * @desc    Obtenir tous les dossiers médicaux (avec pagination)
 * @query   page, limit
 * @access  Public
 */
router.get('/', DossierMedicalController.getAll);

/**
 * @route   GET /api/dossiers/stats
 * @desc    Obtenir les statistiques des dossiers
 * @access  Public
 */
router.get('/stats', DossierMedicalController.getStats);

/**
 * @route   GET /api/dossiers/:id
 * @desc    Obtenir un dossier médical par ID
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), DossierMedicalController.getById);

/**
 * @route   GET /api/dossiers/patient/:patientId
 * @desc    Obtenir tous les dossiers d'un patient
 * @access  Public
 */
router.get('/patient/:patientId', validateObjectId('patientId'), DossierMedicalController.getByPatient);

/**
 * @route   GET /api/dossiers/patient/:patientId/latest
 * @desc    Obtenir le dernier dossier d'un patient
 * @access  Public
 */
router.get('/patient/:patientId/latest', validateObjectId('patientId'), DossierMedicalController.getLatestByPatient);

/**
 * @route   PUT /api/dossiers/:id
 * @desc    Mettre à jour un dossier médical
 * @access  Public
 */
router.put('/:id', validateObjectId('id'), DossierMedicalController.update);

/**
 * @route   POST /api/dossiers/:id/medications
 * @desc    Ajouter un médicament à un dossier
 * @access  Public
 */
router.post('/:id/medications', validateObjectId('id'), DossierMedicalController.addMedication);

/**
 * @route   POST /api/dossiers/:id/lab-results
 * @desc    Ajouter un résultat de laboratoire
 * @access  Public
 */
router.post('/:id/lab-results', validateObjectId('id'), DossierMedicalController.addLabResult);

/**
 * @route   DELETE /api/dossiers/:id
 * @desc    Supprimer un dossier médical
 * @access  Public
 */
router.delete('/:id', validateObjectId('id'), DossierMedicalController.delete);

export default router;