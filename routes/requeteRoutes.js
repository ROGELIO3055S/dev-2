const express = require('express');
const router = express.Router();
const { 
    creerRequete, 
    getRequeteById, 
    getRequetesEtudiant, 
    annulerRequete 
} = require('../controllers/requeteController');
const { verifierToken, verifierRole } = require('../middlewares/authMiddleware');
const { validerErreurNom, validerChangementNote } = require('../middlewares/validationMiddleware');

// POST /requetes/erreur-nom — Créer une requête erreur de nom
router.post('/erreur-nom', verifierToken, verifierRole('etudiant'), validerErreurNom, creerRequete);

// POST /requetes/changement-note — Créer une requête changement de note
router.post('/changement-note', verifierToken, verifierRole('etudiant'), validerChangementNote, creerRequete);

// GET /requetes/:id — Voir le détail d'une requête
router.get('/:id', verifierToken, getRequeteById);

// GET /requetes/etudiant/:id — Voir toutes les requêtes d'un étudiant
router.get('/etudiant/:id', verifierToken, getRequetesEtudiant);

// PUT /requetes/:id/annuler — Annuler une requête
router.put('/:id/annuler', verifierToken, verifierRole('etudiant'), annulerRequete);

module.exports = router;