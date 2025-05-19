const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/api-albums', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch((err) => console.log("Erreur de connexion à MongoDB", err));

// Middleware pour parser les données JSON
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
    res.send("Hello, API !");
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
 
