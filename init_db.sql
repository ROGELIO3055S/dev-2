CREATE DATABASE IF NOT EXISTS iut_requetes_db;
USE iut_requetes_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('etudiant', 'enseignant', 'administration', 'super_admin') DEFAULT 'etudiant',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requetes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_requete ENUM('erreur_nom', 'changement_note', 'autre') NOT NULL,
    objet VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    statut ENUM('en_attente', 'en_cours', 'traitee', 'rejetee') DEFAULT 'en_attente',
    piece_jointe_url VARCHAR(255),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);