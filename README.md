# IUT-Requetes-Backend

Plateforme de gestion des requêtes académiques pour l'IUT de Douala. Ce projet permet aux étudiants de soumettre des demandes (erreurs de noms, changements de notes) et au corps administratif de les traiter efficacement.

## 📋 Fonctionnalités (MVP)
- **Authentification :** Inscription et connexion avec rôles (Étudiant, Enseignant, Admin, Super Admin).
- **Gestion des Requêtes :** Création, consultation et suivi du statut des requêtes.
- **Notifications :** Alertes en temps réel sur l'évolution du traitement.
- **Audit :** Historique des modifications de statuts.

## 🛠️ Stack Technique
- **Runtime :** Node.js
- **Framework :** Express.js
- **Base de données :** MySQL 8.0
- **Authentification :** JSON Web Token (JWT) & Bcrypt
- **Versionnage :** Git & GitHub

## 🚀 Installation & Configuration Locale

### 1. Prérequis
- Node.js (v18+)
- MySQL Server (via XAMPP, WAMP ou installation directe)

### 2. Clonage du projet

git clone [https://github.com/Dylane237/iut-requetes-backend.git](https://github.com/Dylane237/iut-requetes-backend.git)
cd iut-requetes-backend

3. Installation des dépendances
npm install

4. Configuration de la Base de Données
Lancez votre serveur MySQL.
Importez le fichier init_db.sql dans votre client (MySQL Workbench, phpMyAdmin, etc.).
Créez un fichier .env à la racine et configurez vos accès :

Extrait de code
DB_HOST=localhost
DB_USER=root
DB_PASS=votre_mot_de_passe
DB_NAME=iut_requetes_db
JWT_SECRET=votre_cle_secrete
PORT=3000

5. Lancement
npm start


📅 Planning de Développement (Phase 1)
[x] T1 (10/04) : Initialisation du dépôt et structure (Lead Backend)

[x] T2 (10/04) : Conception du schéma SQL (En cours)

[ ] T3 (11/04) : Système d'authentification JWT

[ ] T4 (12/04) : CRUD des requêtes

👥 Équipe
...

10 membres (Développeurs Frontend, Backend, UI/UX)

© 2026 - IUT de Douala - Licence Génie Logiciel