const express = require('express');
const router = express.Router();
const { inscription, connexion, logout } = require('../controllers/authController');
const { verifierToken } = require('../middlewares/authMiddleware');

// POST /auth/register — Inscription
router.post('/register', inscription);

// POST /auth/login — Connexion
router.post('/login', connexion);

// POST /auth/logout — Déconnexion (protégée)
router.post('/logout', verifierToken, logout);

module.exports = router;