import mongoose from 'mongoose';

const MONGODB_TEST_URI = 'mongodb://localhost:27017/santeconnect_test';

beforeAll(async () => {
  // Déconnecter toute connexion active par sécurité
  await mongoose.disconnect();
  
  const options = {
    autoIndex: true,
  };
  
  await mongoose.connect(MONGODB_TEST_URI, options);
});

afterAll(async () => {
  // Nettoyer toute la base de données de test pour ne pas laisser de restes
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

beforeEach(async () => {
  // Nettoyer toutes les collections entre chaque test pour l'isolation
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});
