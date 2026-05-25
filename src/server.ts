import app from './app';
import { connectDB } from './core/database/connect';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Serveur SanteConnect démarré avec succès`);
  console.log(`Port: ${PORT}`);
});