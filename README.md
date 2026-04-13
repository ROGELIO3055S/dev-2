# IUT Requêtes — Système de Gestion des Requêtes Académiques

Ce projet est une plateforme web conçue pour l'**IUT de Douala**, permettant aux étudiants de soumettre et de suivre des requêtes académiques (corrections de noms, contestations de notes) de manière numérique.

Cette branche contient l'intégralité du **Backend (DEV1)**.

---

## 🚀 Fonctionnalités implémentées (DEV1)

Le backend a été conçu avec une architecture robuste pour garantir la sécurité et la traçabilité des demandes :

- **Système d'Authentification** : Inscription et connexion sécurisées via JSON Web Tokens (JWT).
- **Gestion des Rôles** : Contrôle d'accès strict (RBAC) différenciant les Étudiants, Enseignants et Administrateurs.
- **Soumission de Requêtes** :
    - Formulaire spécifique pour les **erreurs de nom** (avec justificatifs).
    - Formulaire spécifique pour les **changements de notes** (matière, notes, motif).
- **Suivi et Historique** : Consultation du statut des requêtes en temps réel et possibilité d'annulation par l'étudiant.
- **Validation des données** : Middlewares de validation pour assurer l'intégrité des données avant insertion en base de données (MySQL).

---

## 🛠️ Stack Technique

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MySQL
- **Sécurité** : Bcrypt (hachage des mots de passe) & JWT (authentification)
- **Outils de dev** : Nodemon, Postman (tests API)

---

## 📁 Structure du Projet

```text
/backend
├── config/             # Configuration de la base de données
├── controllers/        # Logique métier (requêtes, auth)
├── middlewares/        # Sécurité (JWT) et validation (T5)
├── models/             # Schémas et requêtes SQL
├── routes/             # Définition des points d'accès API (T4)
├── utils/              # Fonctions utilitaires
├── seed.js             # Script de génération de données de test (T6)
├── server.js           # Point d'entrée de l'application
└── API.md              # Documentation technique détaillée des routes
```

## ⚙️ Installation et Lancement

### 1. Prérequis
* **Node.js** installé sur votre machine.
* Un serveur **MySQL** (via WAMP, XAMPP ou MySQL Workbench).

### 2. Configuration
Créez un fichier `.env` à la racine du dossier `backend` et configurez vos accès comme suit :

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=iut_requetes_db
JWT_SECRET=votre_cle_secrete
```

### 3. Installation des dépendances
```Bash
npm install
```

### 4. Initialisation de la base de données (Seed)
Pour tester l'application avec des données de test (10 étudiants, 3 admins, 10 requêtes) :
```Bash
npm run seed
```
### 5. Lancement du serveur
```Bash
npm run dev
```
Le serveur sera disponible sur : http://localhost:5000

## Documentation API
Pour le détail technique de chaque route (paramètres, JSON attendus, codes d'erreurs), veuillez vous référer au fichier API.md

## Auteurs
Dylane & Samuel
