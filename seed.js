const db = require('./config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        console.log('Début du seed...');

        // Nettoyer les tables dans l'ordre
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE notifications');
        await db.query('TRUNCATE TABLE historique_statut');
        await db.query('TRUNCATE TABLE details_changement_note');
        await db.query('TRUNCATE TABLE details_erreur_nom');
        await db.query('TRUNCATE TABLE messages');
        await db.query('TRUNCATE TABLE documents');
        await db.query('TRUNCATE TABLE requetes');
        await db.query('TRUNCATE TABLE users');
        await db.query('TRUNCATE TABLE departements');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Tables nettoyées...');

        // Créer les départements
        await db.query(`INSERT INTO departements (nom_service) VALUES 
            ('Scolarité'),
            ('Département Informatique'),
            ('Département Mathématiques')`
        );
        console.log('Départements créés...');

        // Hasher le mot de passe commun
        const hash = await bcrypt.hash('password123', 10);

        // Créer 3 admins
        await db.query(`INSERT INTO users 
            (nom, prenom, email, mot_de_passe, role, service, poste) VALUES 
            ('Admin', 'Super', 'admin@iut.cm', ?, 'super_admin', 'Direction', 'Directeur'),
            ('Foko', 'Marie', 'marie@iut.cm', ?, 'administration', 'Scolarité', 'Responsable scolarité'),
            ('Bello', 'Jean', 'jean@iut.cm', ?, 'administration', 'Scolarité', 'Agent scolarité')`,
            [hash, hash, hash]
        );
        console.log('Admins créés...');

        // Créer 3 enseignants
        await db.query(`INSERT INTO users 
            (nom, prenom, email, mot_de_passe, role, service, poste) VALUES 
            ('Kamga', 'Paul', 'kamga@iut.cm', ?, 'enseignant', 'Département Informatique', 'Professeur'),
            ('Nana', 'Alice', 'nana@iut.cm', ?, 'enseignant', 'Département Mathématiques', 'Professeur'),
            ('Talla', 'Marc', 'talla@iut.cm', ?, 'enseignant', 'Département Informatique', 'Chargé de cours')`,
            [hash, hash, hash]
        );
        console.log('Enseignants créés...');

        // Créer 10 étudiants
        await db.query(`INSERT INTO users 
            (nom, prenom, email, mot_de_passe, role, matricule, filiere, niveau) VALUES 
            ('Nyetam', 'Samuel', 'samuel@iut.cm', ?, 'etudiant', 'IUT2026001', 'Génie Logiciel', 'Licence 1'),
            ('Mballa', 'Pierre', 'pierre@iut.cm', ?, 'etudiant', 'IUT2026002', 'Génie Logiciel', 'Licence 1'),
            ('Fouda', 'Claire', 'claire@iut.cm', ?, 'etudiant', 'IUT2026003', 'Réseaux', 'Licence 1'),
            ('Etoa', 'David', 'david@iut.cm', ?, 'etudiant', 'IUT2026004', 'Génie Logiciel', 'Licence 2'),
            ('Ngono', 'Sophie', 'sophie@iut.cm', ?, 'etudiant', 'IUT2026005', 'Réseaux', 'Licence 2'),
            ('Owona', 'Marc', 'marc@iut.cm', ?, 'etudiant', 'IUT2026006', 'Génie Logiciel', 'Licence 1'),
            ('Ateba', 'Julie', 'julie@iut.cm', ?, 'etudiant', 'IUT2026007', 'Réseaux', 'Licence 1'),
            ('Mekongo', 'Paul', 'paul@iut.cm', ?, 'etudiant', 'IUT2026008', 'Génie Logiciel', 'Licence 2'),
            ('Abena', 'Rose', 'rose@iut.cm', ?, 'etudiant', 'IUT2026009', 'Réseaux', 'Licence 2'),
            ('Bindzi', 'Alain', 'alain@iut.cm', ?, 'etudiant', 'IUT2026010', 'Génie Logiciel', 'Licence 1')`,
            [hash, hash, hash, hash, hash, hash, hash, hash, hash, hash]
        );
        console.log('Étudiants créés...');

        // Créer 5 requêtes erreur de nom
        for (let i = 1; i <= 5; i++) {
            const statuts = ['en_attente', 'en_cours', 'traitee', 'rejetee', 'en_attente'];
            const [result] = await db.query(
                `INSERT INTO requetes (type_requete, titre, description, statut_actuel, etudiant_id, departement_id)
                 VALUES ('erreur_nom', ?, 'Erreur sur mon nom dans les registres', ?, ?, 1)`,
                [`Correction nom étudiant ${i}`, statuts[i-1], i+6]
            );
            await db.query(
                `INSERT INTO details_erreur_nom (requete_id, ancien_nom, nouveau_nom)
                 VALUES (?, ?, ?)`,
                [result.insertId, `AncienNom${i}`, `NouveauNom${i}`]
            );
        }
        console.log('Requêtes erreur nom créées...');

        // Créer 5 requêtes changement de note
        for (let i = 1; i <= 5; i++) {
            const statuts = ['en_attente', 'en_cours', 'traitee', 'rejetee', 'en_attente'];
            const matieres = ['Mathématiques', 'Informatique', 'Anglais', 'Physique', 'Algorithmique'];
            const [result] = await db.query(
                `INSERT INTO requetes (type_requete, titre, description, statut_actuel, etudiant_id, departement_id)
                 VALUES ('changement_note', ?, 'Je conteste ma note dans cette matière', ?, ?, 2)`,
                [`Contestation note ${matieres[i-1]}`, statuts[i-1], i+6]
            );
            await db.query(
                `INSERT INTO details_changement_note (requete_id, matiere, note_actuelle, note_demandee, motif, enseignant_id)
                 VALUES (?, ?, ?, ?, 'Erreur de calcul dans la correction de ma copie', ?)`,
                [result.insertId, matieres[i-1], 8+i, 12+i, 4]
            );
        }
        console.log('Requêtes changement note créées...');

        console.log('Seed terminé avec succès !');
        process.exit(0);

    } catch (error) {
        console.error('Erreur seed:', error);
        process.exit(1);
    }
};

seed();