const { body, validationResult } = require('express-validator');

const gererErreurs = (req, res, next) => {
    const erreurs = validationResult(req);
    if (!erreurs.isEmpty()) {
        return res.status(400).json({ erreurs: erreurs.array() });
    }
    next();
};

const validerErreurNom = [
    body('titre')
        .notEmpty().withMessage('Le titre est obligatoire.'),
    body('description')
        .notEmpty().withMessage('La description est obligatoire.'),
    body('ancien_nom')
        .notEmpty().withMessage('L\'ancien nom est obligatoire.'),
    body('nouveau_nom')
        .notEmpty().withMessage('Le nouveau nom est obligatoire.')
        .custom((value, { req }) => value !== req.body.ancien_nom)
        .withMessage('Le nouveau nom doit être différent de l\'ancien nom.'),
    gererErreurs
];

const validerChangementNote = [
    body('titre')
        .notEmpty().withMessage('Le titre est obligatoire.'),
    body('description')
        .notEmpty().withMessage('La description est obligatoire.'),
    body('matiere')
        .notEmpty().withMessage('La matière est obligatoire.'),
    body('note_actuelle')
        .isFloat({ min: 0, max: 20 }).withMessage('La note actuelle doit être entre 0 et 20.'),
    body('note_demandee')
        .isFloat({ min: 0, max: 20 }).withMessage('La note demandée doit être entre 0 et 20.')
        .custom((value, { req }) => parseFloat(value) !== parseFloat(req.body.note_actuelle))
        .withMessage('La note demandée doit être différente de la note actuelle.'),
    body('motif')
        .notEmpty().withMessage('Le motif est obligatoire.')
        .isLength({ min: 20 }).withMessage('Le motif doit contenir au moins 20 caractères.'),
    gererErreurs
];

module.exports = { validerErreurNom, validerChangementNote };