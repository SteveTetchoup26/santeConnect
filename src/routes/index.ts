import { Router } from 'express';
import patientRoutes from './patient.route';
import dossierMedicalRoutes from './dossierMedical.route';

const router = Router();


router.use('/patients', patientRoutes);
router.use('/dossiers', dossierMedicalRoutes);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API SantéConnect',
    version: '1.0.0',
    endpoints: {
      patients: '/api/patients',
      dossiers: '/api/dossiers',
    }
  });
});

export default router;