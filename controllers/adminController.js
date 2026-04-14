const db = require('../config/db');

// Tâche 5 : Statistiques pour le Dashboard Admin
const getStatsAdmin = async (req, res) => {
    try {
        const sql = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN statut_actuel = 'en_attente' THEN 1 ELSE 0 END) as en_attente,
                SUM(CASE WHEN statut_actuel = 'approuvee' THEN 1 ELSE 0 END) as approuvees,
                SUM(CASE WHEN statut_actuel = 'rejetee' THEN 1 ELSE 0 END) as rejetees
            FROM requetes`;
        
        const [stats] = await db.query(sql);
        return res.status(200).json(stats[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la récupération des statistiques." });
    }
};

// Tâche 5 : Liste de toutes les requêtes avec filtres
const getToutesLesRequetes = async (req, res) => {
    try {
        const { statut, type } = req.query; 
        
        // On sélectionne aussi les infos de l'étudiant pour que l'admin sache de qui vient la requête
        let sql = `
            SELECT r.*, u.nom, u.prenom 
            FROM requetes r 
            JOIN users u ON r.etudiant_id = u.id 
            WHERE 1=1`;
        
        let params = [];

        if (statut) {
            sql += " AND r.statut_actuel = ?";
            params.push(statut);
        }
        if (type) {
            sql += " AND r.type_requete = ?";
            params.push(type);
        }

        sql += " ORDER BY r.created_at DESC";

        const [resultats] = await db.query(sql, params);
        return res.status(200).json(resultats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la récupération des requêtes." });
    }
};

module.exports = { getStatsAdmin, getToutesLesRequetes };