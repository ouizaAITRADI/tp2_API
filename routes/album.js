const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const verifyToken = require('../middlewares/verifyToken');

// Créer un nouvel album (POST /album) — protégée
router.post('/album', verifyToken, async (req, res) => {
  try {
    const album = new Album({
      title: req.body.title,
      description: req.body.description,
    });
    const savedAlbum = await album.save();
    res.status(201).json(savedAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Récupérer un album par son ID (GET /album/:id)
router.get('/album/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('photos');
    if (!album) return res.status(404).json({ message: "Album non trouvé" });
    res.json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour un album (PUT /album/:id) — protégée
router.put('/album/:id', verifyToken, async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: "Album non trouvé" });

    album.title = req.body.title || album.title;
    album.description = req.body.description || album.description;

    const updatedAlbum = await album.save();
    res.json(updatedAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un album (DELETE /album/:id) — protégée
router.delete('/album/:id', verifyToken, async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ message: "Album non trouvé" });
    res.json({ message: "Album supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer tous les albums, avec option filtre par titre (GET /albums?title=xxx)
router.get('/albums', async (req, res) => {
  try {
    const filter = {};
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: 'i' };
    }
    const albums = await Album.find(filter).populate('photos');
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
