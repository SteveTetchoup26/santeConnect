import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './core/db/connect';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de logging des requêtes
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});


app.use('/api', routes);

// Middleware de gestion des routes non trouvées
app.use(notFoundHandler);

// Middleware de gestion des erreurs (doit être en dernier)
// app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Serveur SanteConnect démarré avec succès`);
      console.log(`Port: ${PORT}`);
      console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();

export default app;