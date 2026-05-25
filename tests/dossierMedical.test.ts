import request from 'supertest';
import app from '../src/app';
import Patient from '../src/models/Patient';
import DossierMedical from '../src/models/DossierMedical';

describe('Endpoints des Dossiers Médicaux (/api/dossiers)', () => {
  let patientId: string;

  beforeEach(async () => {
    const patient = await Patient.create({
      name: 'Samuel Eto\'o',
      email: 'samuel.etoo@santeconnect.cm',
      phone: '+237699999999',
      dateOfBirth: '1981-03-10',
    });
    patientId = patient._id.toString();
  });

  describe('POST /api/dossiers', () => {
    it('doit créer un dossier médical valide pour un patient existant', async () => {
      const dossierData = {
        patientId,
        allergies: ['Pollen'],
        vitalSigns: {
          bloodPressure: '120/80',
          heartRate: 70,
          temperature: 37,
        },
        diagnoses: ['Hypertension légère'],
        notes: 'Patient en bonne forme physique générale.',
      };

      const res = await request(app)
        .post('/api/dossiers')
        .send(dossierData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.patientId).toBeDefined();
      expect(res.body.data.allergies).toContain('Pollen');
      expect(res.body.data.vitalSigns.bloodPressure).toBe('120/80');

      const dossierInDb = await DossierMedical.findById(res.body.data._id);
      expect(dossierInDb).not.toBeNull();
      expect(dossierInDb!.patientId.toString()).toBe(patientId);
    });

    it('doit échouer si le patient n\'existe pas', async () => {
      const fakePatientId = '654321098765432109876543';
      const dossierData = {
        patientId: fakePatientId,
        allergies: [],
      };

      const res = await request(app)
        .post('/api/dossiers')
        .send(dossierData);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/dossiers', () => {
    it('doit obtenir tous les dossiers médicaux', async () => {
      await DossierMedical.create({
        patientId,
        allergies: ['Poussière'],
      });

      const res = await request(app).get('/api/dossiers');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dossiers).toHaveLength(1);
    });
  });

  describe('GET /api/dossiers/stats', () => {
    it('doit retourner les statistiques des dossiers médicaux', async () => {
      await DossierMedical.create({
        patientId,
        allergies: ['Aspirine'],
      });

      const res = await request(app).get('/api/dossiers/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalDossiers).toBe(1);
    });
  });

  describe('GET /api/dossiers/:id', () => {
    it('doit récupérer un dossier médical par son ID', async () => {
      const dossier = await DossierMedical.create({
        patientId,
        notes: 'Dossier spécifique',
      });

      const res = await request(app).get(`/api/dossiers/${dossier._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notes).toBe('Dossier spécifique');
    });
  });

  describe('GET /api/dossiers/patient/:patientId', () => {
    it('doit récupérer tous les dossiers d\'un patient', async () => {
      await DossierMedical.create([
        { patientId, notes: 'Premier dossier' },
        { patientId, notes: 'Deuxième dossier' },
      ]);

      const res = await request(app).get(`/api/dossiers/patient/${patientId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dossiers).toHaveLength(2);
    });
  });

  describe('GET /api/dossiers/patient/:patientId/latest', () => {
    it('doit récupérer le tout dernier dossier médical d\'un patient', async () => {
      await DossierMedical.create({ patientId, notes: 'Ancien dossier' });
      await DossierMedical.create({ patientId, notes: 'Nouveau dossier' });

      const res = await request(app).get(`/api/dossiers/patient/${patientId}/latest`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notes).toBe('Nouveau dossier');
    });
  });

  describe('PUT /api/dossiers/:id', () => {
    it('doit mettre à jour les notes et vitalSigns d\'un dossier', async () => {
      const dossier = await DossierMedical.create({
        patientId,
        notes: 'Initiale',
      });

      const res = await request(app)
        .put(`/api/dossiers/${dossier._id}`)
        .send({
          notes: 'Mise à jour',
          vitalSigns: { bloodPressure: '130/85', heartRate: 75 },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notes).toBe('Mise à jour');
      expect(res.body.data.vitalSigns.bloodPressure).toBe('130/85');
    });
  });

  describe('POST /api/dossiers/:id/medications', () => {
    it('doit ajouter un médicament dans la liste du dossier', async () => {
      const dossier = await DossierMedical.create({
        patientId,
        medications: [],
      });

      const medication = {
        name: 'Paracétamol',
        dose: '500mg',
        frequency: '3 fois par jour',
      };

      const res = await request(app)
        .post(`/api/dossiers/${dossier._id}/medications`)
        .send(medication);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.medications).toHaveLength(1);
      expect(res.body.data.medications[0].name).toBe('Paracétamol');
    });
  });

  describe('POST /api/dossiers/:id/lab-results', () => {
    it('doit ajouter un résultat de laboratoire', async () => {
      const dossier = await DossierMedical.create({
        patientId,
        labResults: [],
      });

      const labResult = {
        test: 'Hémogramme',
        result: 'Normal',
      };

      const res = await request(app)
        .post(`/api/dossiers/${dossier._id}/lab-results`)
        .send(labResult);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.labResults).toHaveLength(1);
      expect(res.body.data.labResults[0].test).toBe('Hémogramme');
    });
  });

  describe('DELETE /api/dossiers/:id', () => {
    it('doit supprimer le dossier médical', async () => {
      const dossier = await DossierMedical.create({
        patientId,
      });

      const res = await request(app).delete(`/api/dossiers/${dossier._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const dossierInDb = await DossierMedical.findById(dossier._id);
      expect(dossierInDb).toBeNull();
    });
  });
});
