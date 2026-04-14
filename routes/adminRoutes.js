const express = require('express');
const router = express.Router();
const { getStatsAdmin, getToutesLesRequetes } = require('../controllers/adminController');
const { verifierToken, verifierRole } = require('../middlewares/authMiddleware');

// Toutes ces routes sont protégées : il faut être connecté ET être admin
router.use(verifierToken);
router.use(verifierRole('admin'));

// GET /admin/stats — Pour les graphiques du dashboard
router.get('/stats', getStatsAdmin);

// GET /admin/requetes-liste — Pour le tableau avec filtres
router.get('/requetes-liste', getToutesLesRequetes);

module.exports = router;