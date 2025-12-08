import { Router } from 'express';
import patientRoutes from './patient.route';
import dossierMedicalRoutes from './dossierMedical.route';

const router = Router();

// Route de santé de l'API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API SantéConnect en ligne',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes principales
router.use('/patients', patientRoutes);
router.use('/dossiers', dossierMedicalRoutes);

// Route d'accueil
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API SantéConnect',
    version: '1.0.0',
    endpoints: {
      patients: '/api/patients',
      dossiers: '/api/dossiers',
      health: '/api/health'
    },
    documentation: 'Consultez le README pour plus d\'informations'
  });
});

export default router;