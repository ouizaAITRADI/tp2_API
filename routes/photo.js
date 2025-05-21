const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const Photo = require('../models/Photo');

// Récupérer toutes les photos d'un album (GET /album/:idalbum/photos)
router.get('/album/:idalbum/photos', async (req, res) => {
  try {
    const photos = await Photo.find({ album: req.params.idalbum });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer une photo spécifique d'un album (GET /album/:idalbum/photo/:idphoto)
router.get('/album/:idalbum/photo/:idphoto', async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.idphoto, album: req.params.idalbum });
    if (!photo) return res.status(404).json({ message: "Photo non trouvée" });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ajouter une nouvelle photo à un album (POST /album/:idalbum/photo)
router.post('/album/:idalbum/photo', async (req, res) => {
  try {
    const album = await Album.findById(req.params.idalbum);
    if (!album) return res.status(404).json({ message: "Album non trouvé" });

    const photo = new Photo({
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      album: album._id
    });

    const savedPhoto = await photo.save();

    // Ajouter la photo à la liste des photos de l'album
    album.photos.push(savedPhoto._id);
    await album.save();

    res.status(201).json(savedPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour une photo existante (PUT /album/:idalbum/photo/:idphoto)
router.put('/album/:idalbum/photo/:idphoto', async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.idphoto, album: req.params.idalbum });
    if (!photo) return res.status(404).json({ message: "Photo non trouvée" });

    photo.title = req.body.title || photo.title;
    photo.url = req.body.url || photo.url;
    photo.description = req.body.description || photo.description;

    const updatedPhoto = await photo.save();
    res.json(updatedPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer une photo d'un album (DELETE /album/:idalbum/photo/:idphoto)
router.delete('/album/:idalbum/photo/:idphoto', async (req, res) => {
  try {
    const photo = await Photo.findOneAndDelete({ _id: req.params.idphoto, album: req.params.idalbum });
    if (!photo) return res.status(404).json({ message: "Photo non trouvée" });

    // Retirer la photo de la liste photos de l'album
    await Album.findByIdAndUpdate(req.params.idalbum, { $pull: { photos: req.params.idphoto } });

    res.json({ message: "Photo supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
