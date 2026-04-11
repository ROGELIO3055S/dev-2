CREATE DATABASE IF NOT EXISTS iut_requetes_db;
USE iut_requetes_db;

-- Table principale des utilisateurs (étudiants + personnel)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('etudiant', 'enseignant', 'administration', 'super_admin') DEFAULT 'etudiant',
    matricule VARCHAR(50) UNIQUE,
    filiere VARCHAR(100),
    niveau VARCHAR(50),
    service VARCHAR(100),
    poste VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des départements
CREATE TABLE departements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_service VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des requêtes (seulement 2 types selon le plan)
CREATE TABLE requetes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_requete ENUM('erreur_nom', 'changement_note') NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    statut_actuel ENUM('en_attente', 'en_cours', 'traitee', 'rejetee') DEFAULT 'en_attente',
    etudiant_id INT NOT NULL,
    traite_par INT,
    departement_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (etudiant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (traite_par) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (departement_id) REFERENCES departements(id) ON DELETE SET NULL
);

-- Détails spécifiques : requête erreur de nom
CREATE TABLE details_erreur_nom (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requete_id INT NOT NULL UNIQUE,
    ancien_nom VARCHAR(100) NOT NULL,
    nouveau_nom VARCHAR(100) NOT NULL,
    justificatif_url VARCHAR(255),
    FOREIGN KEY (requete_id) REFERENCES requetes(id) ON DELETE CASCADE
);

-- Détails spécifiques : requête changement de note
CREATE TABLE details_changement_note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requete_id INT NOT NULL UNIQUE,
    matiere VARCHAR(100) NOT NULL,
    note_actuelle DECIMAL(5,2) NOT NULL,
    note_demandee DECIMAL(5,2) NOT NULL,
    motif TEXT NOT NULL,
    enseignant_id INT,
    FOREIGN KEY (requete_id) REFERENCES requetes(id) ON DELETE CASCADE,
    FOREIGN KEY (enseignant_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Historique des changements de statut
CREATE TABLE historique_statut (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requete_id INT NOT NULL,
    ancien_statut ENUM('en_attente', 'en_cours', 'traitee', 'rejetee'),
    nouveau_statut ENUM('en_attente', 'en_cours', 'traitee', 'rejetee') NOT NULL,
    commentaire_admin TEXT,
    modifie_par INT,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requete_id) REFERENCES requetes(id) ON DELETE CASCADE,
    FOREIGN KEY (modifie_par) REFERENCES users(id) ON DELETE SET NULL
);

-- Documents joints aux requêtes
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requete_id INT NOT NULL,
    fichier_url VARCHAR(255) NOT NULL,
    type_mime VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requete_id) REFERENCES requetes(id) ON DELETE CASCADE
);

-- Messages échangés sur une requête
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requete_id INT NOT NULL,
    expediteur_id INT NOT NULL,
    contenu TEXT NOT NULL,
    horodatage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requete_id) REFERENCES requetes(id) ON DELETE CASCADE,
    FOREIGN KEY (expediteur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications envoyées aux utilisateurs
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    requete_id INT,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requete_id) REFERENCES requetes(id) ON DELETE SET NULL
);