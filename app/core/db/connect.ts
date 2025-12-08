import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/santeconnect';

export const connectDB = async (): Promise<void> => {
  try {
    const options = {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, options);
    
    console.log('MongoDB connecté avec succès');
    
    mongoose.connection.on('error', (err) => {
      console.error('Erreur de connexion MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB déconnecté');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Connexion MongoDB fermée');
      process.exit(0);
    });

  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('Connexion MongoDB fermée');
  } catch (error) {
    console.error('Erreur lors de la fermeture:', error);
  }
};