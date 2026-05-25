import request from 'supertest';
import app from '../src/app';
import Patient from '../src/models/Patient';
import DossierMedical from '../src/models/DossierMedical';

describe('Endpoints des Patients (/api/patients)', () => {
  const patientData = {
    name: 'Jean-Pierre Nsame',
    email: 'jean.nsame@santeconnect.cm',
    phone: '+237699887766',
    dateOfBirth: '1990-05-15',
  };

  describe('POST /api/patients', () => {
    it('doit créer un nouveau patient avec des données valides', async () => {
      const res = await request(app)
        .post('/api/patients')
        .send(patientData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(patientData.name);
      expect(res.body.data.email).toBe(patientData.email);
      expect(res.body.data.phone).toBe(patientData.phone);
      expect(res.body.data._id).toBeDefined();

      const patientInDb = await Patient.findById(res.body.data._id);
      expect(patientInDb).not.toBeNull();
      expect(patientInDb!.name).toBe(patientData.name);
    });

    it('doit échouer si le numéro de téléphone ne respecte pas le format camerounais (+237)', async () => {
      const res = await request(app)
        .post('/api/patients')
        .send({
          ...patientData,
          phone: '0612345678', // Mauvais format
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('doit échouer si l\'email est invalide', async () => {
      const res = await request(app)
        .post('/api/patients')
        .send({
          ...patientData,
          email: 'not-an-email',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('doit échouer si la date de naissance est dans le futur', async () => {
      const futurDate = new Date();
      futurDate.setFullYear(futurDate.getFullYear() + 5);

      const res = await request(app)
        .post('/api/patients')
        .send({
          ...patientData,
          dateOfBirth: futurDate.toISOString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/patients', () => {
    it('doit récupérer tous les patients avec pagination', async () => {
      await Patient.create([
        patientData,
        {
          name: 'Marc Mbia',
          email: 'marc.mbia@santeconnect.cm',
          phone: '+237677889900',
          dateOfBirth: '1985-11-20',
        },
      ]);

      const res = await request(app).get('/api/patients');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.patients).toHaveLength(2);
      expect(res.body.data.pagination.total).toBe(2);
    });
  });

  describe('GET /api/patients/stats', () => {
    it('doit retourner les statistiques des patients', async () => {
      await Patient.create(patientData);

      const res = await request(app).get('/api/patients/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalPatients).toBe(1);
      expect(res.body.data.recentPatients).toHaveLength(1);
    });
  });

  describe('GET /api/patients/search', () => {
    it('doit trouver un patient par recherche textuelle (nom/email/phone)', async () => {
      await Patient.create(patientData);

      const res = await request(app)
        .get('/api/patients/search')
        .query({ query: 'nsame' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe(patientData.name);
    });

    it('doit renvoyer une erreur 400 si le paramètre query est manquant', async () => {
      const res = await request(app).get('/api/patients/search');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/patients/:id', () => {
    it('doit récupérer un patient par son ID', async () => {
      const patient = await Patient.create(patientData);

      const res = await request(app).get(`/api/patients/${patient._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(patientData.name);
    });

    it('doit renvoyer une erreur 404 si le patient n\'existe pas', async () => {
      const fakeId = '654321098765432109876543'; // ID au bon format mais inexistant
      const res = await request(app).get(`/api/patients/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/patients/:id', () => {
    it('doit mettre à jour les informations du patient', async () => {
      const patient = await Patient.create(patientData);

      const res = await request(app)
        .put(`/api/patients/${patient._id}`)
        .send({ name: 'Jean-Pierre Nsame Modifié' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Jean-Pierre Nsame Modifié');

      const patientInDb = await Patient.findById(patient._id);
      expect(patientInDb!.name).toBe('Jean-Pierre Nsame Modifié');
    });
  });

  describe('DELETE /api/patients/:id', () => {
    it('doit supprimer le patient ainsi que ses dossiers médicaux associés', async () => {
      const patient = await Patient.create(patientData);

      // Créer un dossier médical lié à ce patient
      await DossierMedical.create({
        patientId: patient._id.toString(),
        allergies: ['Pénicilline'],
        notes: 'Dossier de test',
      });

      const res = await request(app).delete(`/api/patients/${patient._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const patientInDb = await Patient.findById(patient._id);
      expect(patientInDb).toBeNull();

      const dossierInDb = await DossierMedical.findOne({ patientId: patient._id.toString() });
      expect(dossierInDb).toBeNull();
    });
  });
});
