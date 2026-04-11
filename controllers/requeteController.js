const db = require('../config/db');

const creerRequete = async (req, res) => {
    try {
        const { type_requete, titre, description, departement_id } = req.body;
        const etudiant_id = req.user.id;

        if (!['erreur_nom', 'changement_note'].includes(type_requete)) {
            return res.status(400).json({ message: 'Type de requête invalide.' });
        }

        const [result] = await db.query(
            `INSERT INTO requetes (type_requete, titre, description, etudiant_id, departement_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [type_requete, titre, description, etudiant_id, departement_id]
        );

        const requete_id = result.insertId;

        // Insérer les détails selon le type
        if (type_requete === 'erreur_nom') {
            const { ancien_nom, nouveau_nom, justificatif_url } = req.body;
            await db.query(
                `INSERT INTO details_erreur_nom (requete_id, ancien_nom, nouveau_nom, justificatif_url) 
                 VALUES (?, ?, ?, ?)`,
                [requete_id, ancien_nom, nouveau_nom, justificatif_url]
            );
        }

        if (type_requete === 'changement_note') {
            const { matiere, note_actuelle, note_demandee, motif, enseignant_id } = req.body;
            await db.query(
                `INSERT INTO details_changement_note 
                 (requete_id, matiere, note_actuelle, note_demandee, motif, enseignant_id) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [requete_id, matiere, note_actuelle, note_demandee, motif, enseignant_id]
            );
        }

        // Créer une notification pour l'étudiant
        await db.query(
            `INSERT INTO notifications (user_id, requete_id, message) VALUES (?, ?, ?)`,
            [etudiant_id, requete_id, `Votre requête "${titre}" a été soumise avec succès.`]
        );

        return res.status(201).json({ 
            message: 'Requête créée avec succès.',
            requete_id 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

const getRequeteById = async (req, res) => {
    try {
        const { id } = req.params;

        const [requetes] = await db.query(
            `SELECT r.*, u.nom, u.prenom, u.matricule 
             FROM requetes r 
             JOIN users u ON r.etudiant_id = u.id 
             WHERE r.id = ?`,
            [id]
        );

        if (requetes.length === 0) {
            return res.status(404).json({ message: 'Requête introuvable.' });
        }

        const requete = requetes[0];

        // Récupérer les détails selon le type
        if (requete.type_requete === 'erreur_nom') {
            const [details] = await db.query(
                'SELECT * FROM details_erreur_nom WHERE requete_id = ?', [id]
            );
            requete.details = details[0];
        }

        if (requete.type_requete === 'changement_note') {
            const [details] = await db.query(
                'SELECT * FROM details_changement_note WHERE requete_id = ?', [id]
            );
            requete.details = details[0];
        }

        return res.status(200).json(requete);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

const getRequetesEtudiant = async (req, res) => {
    try {
        const { id } = req.params;

        const [requetes] = await db.query(
            `SELECT id, type_requete, titre, statut_actuel, created_at 
             FROM requetes 
             WHERE etudiant_id = ? 
             ORDER BY created_at DESC`,
            [id]
        );

        return res.status(200).json(requetes);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

const annulerRequete = async (req, res) => {
    try {
        const { id } = req.params;
        const etudiant_id = req.user.id;

        const [requetes] = await db.query(
            'SELECT * FROM requetes WHERE id = ? AND etudiant_id = ?',
            [id, etudiant_id]
        );

        if (requetes.length === 0) {
            return res.status(404).json({ message: 'Requête introuvable.' });
        }

        if (requetes[0].statut_actuel !== 'en_attente') {
            return res.status(400).json({ message: 'Impossible d\'annuler une requête déjà en cours de traitement.' });
        }

        await db.query(
            'UPDATE requetes SET statut_actuel = ? WHERE id = ?',
            ['rejetee', id]
        );

        await db.query(
            `INSERT INTO historique_statut (requete_id, ancien_statut, nouveau_statut, commentaire_admin, modifie_par) 
             VALUES (?, ?, ?, ?, ?)`,
            [id, 'en_attente', 'rejetee', 'Annulée par l\'étudiant', etudiant_id]
        );

        return res.status(200).json({ message: 'Requête annulée avec succès.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

module.exports = { creerRequete, getRequeteById, getRequetesEtudiant, annulerRequete };