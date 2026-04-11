const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const inscription = async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe, role, matricule, filiere, niveau, service, poste } = req.body;

        // Vérifier si l'email existe déjà
        const [existant] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existant.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Chiffrer le mot de passe
        const hash = await bcrypt.hash(mot_de_passe, 10);

        // Insérer l'utilisateur
        const [result] = await db.query(
            `INSERT INTO users 
            (nom, prenom, email, mot_de_passe, role, matricule, filiere, niveau, service, poste) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom, prenom, email, hash, role || 'etudiant', matricule, filiere, niveau, service, poste]
        );

        return res.status(201).json({ 
            message: 'Inscription réussie.',
            userId: result.insertId 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

const connexion = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        // Vérifier si l'utilisateur existe
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const user = users[0];

        // Vérifier le mot de passe
        const valide = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!valide) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Connexion réussie.',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

const logout = (req, res) => {
    return res.status(200).json({ message: 'Déconnexion réussie.' });
};

module.exports = { inscription, connexion, logout };