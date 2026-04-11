const express = require('express');
const router = express.Router();
const { 
    creerRequete, 
    getRequeteById, 
    getRequetesEtudiant, 
    annulerRequete 
} = require('../controllers/requeteController');
const { verifierToken, verifierRole } = require('../middlewares/authMiddleware');

// POST /requetes — Créer une requête (étudiant seulement)
router.post('/', verifierToken, verifierRole('etudiant'), creerRequete);

// GET /requetes/:id — Voir le détail d'une requête
router.get('/:id', verifierToken, getRequeteById);

// GET /requetes/etudiant/:id — Voir toutes les requêtes d'un étudiant
router.get('/etudiant/:id', verifierToken, getRequetesEtudiant);

// PUT /requetes/:id/annuler — Annuler une requête
router.put('/:id/annuler', verifierToken, verifierRole('etudiant'), annulerRequete);

module.exports = router;