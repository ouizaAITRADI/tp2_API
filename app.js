const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Importer les routeurs
const albumRoutes = require('./routes/album');
const photoRoutes = require('./routes/photo');  // <-- ajouté ici

// Route test
app.get('/', (req, res) => {
  res.send('API Albums is running');
});

// Utiliser les routeurs
app.use('/api', albumRoutes);
app.use('/api', photoRoutes);  // <-- ajouté ici

// Connexion MongoDB sans options dépréciées
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connecté à MongoDB'))
  .catch((err) => console.error(' Erreur de connexion :', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
