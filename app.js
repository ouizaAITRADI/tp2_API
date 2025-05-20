const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');  // Sécurité HTTP
const cors = require('cors');      // Gestion CORS

dotenv.config();

const app = express();

// Middleware global
app.use(express.json());
app.use(helmet());
app.use(cors());

// Importer les routeurs
const albumRoutes = require('./routes/album');
const photoRoutes = require('./routes/photo');
const authRoutes = require('./routes/auth');

// Route racine (test)
app.get('/', (req, res) => {
  res.send('API Albums is running');
});

// Utiliser les routeurs
app.use('/api/auth', authRoutes);
app.use('/api', albumRoutes);
app.use('/api', photoRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion :', err));

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err); // Log interne pour debug

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    error: message
  });
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
