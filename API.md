# IUT Requêtes — Documentation API

Base URL : `http://localhost:5000`

---

## Authentification

### POST /auth/register — Inscription

**Body JSON :**

```json
{
  "nom": "Nyetam",
  "prenom": "Samuel",
  "email": "samuel@iut.cm",
  "mot_de_passe": "password123",
  "role": "etudiant",
  "matricule": "IUT2026001",
  "filiere": "Génie Logiciel",
  "niveau": "Licence 1"
}
```

**Réponse 201 :**

```json
{
  "message": "Inscription réussie.",
  "userId": 1
}
```

---

### POST /auth/login — Connexion

**Body JSON :**

```json
{
  "email": "samuel@iut.cm",
  "mot_de_passe": "password123"
}
```

**Réponse 200 :**

```json
{
  "message": "Connexion réussie.",
  "token": "eyJ...",
  "user": {
    "id": 1,
    "nom": "Nyetam",
    "prenom": "Samuel",
    "email": "samuel@iut.cm",
    "role": "etudiant"
  }
}
```

---

### POST /auth/logout — Déconnexion

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**

```json
{
  "message": "Déconnexion réussie."
}
```

---

## Requêtes étudiants

> Toutes les routes requêtes nécessitent le header :
> `Authorization: Bearer <token>`

### POST /requetes/erreur-nom — Soumettre une correction de nom

**Rôle requis :** etudiant

**Body JSON :**

```json
{
  "titre": "Correction de mon nom",
  "description": "Mon nom est mal orthographié dans les registres",
  "ancien_nom": "NYTAM",
  "nouveau_nom": "NYETAM",
  "justificatif_url": "https://..."
}
```

**Réponse 201 :**

```json
{
  "message": "Requête créée avec succès.",
  "requete_id": 1
}
```

---

### POST /requetes/changement-note — Soumettre une contestation de note

**Rôle requis :** etudiant

**Body JSON :**

```json
{
  "titre": "Contestation note Mathématiques",
  "description": "Je conteste ma note",
  "matiere": "Mathématiques",
  "note_actuelle": 8.5,
  "note_demandee": 12.0,
  "motif": "Erreur de calcul dans la correction de ma copie",
  "enseignant_id": 4
}
```

**Réponse 201 :**

```json
{
  "message": "Requête créée avec succès.",
  "requete_id": 2
}
```

---

### GET /requetes/:id — Détail d'une requête

**Réponse 200 :**

```json
{
    "id": 1,
    "type_requete": "changement_note",
    "titre": "Contestation note Mathématiques",
    "statut_actuel": "en_attente",
    "created_at": "2026-04-11T...",
    "details": { ... }
}
```

---

### GET /requetes/etudiant/:id — Liste des requêtes d'un étudiant

**Réponse 200 :**

```json
[
  {
    "id": 1,
    "type_requete": "changement_note",
    "titre": "Contestation note Mathématiques",
    "statut_actuel": "en_attente",
    "created_at": "2026-04-11T..."
  }
]
```

---

### PUT /requetes/:id/annuler — Annuler une requête

**Rôle requis :** etudiant

**Réponse 200 :**

```json
{
  "message": "Requête annulée avec succès."
}
```

---

## Codes d'erreur

| Code | Signification         |
| ---- | --------------------- |
| 200  | Succès                |
| 201  | Créé avec succès      |
| 400  | Données invalides     |
| 401  | Token manquant        |
| 403  | Accès refusé          |
| 404  | Ressource introuvable |
| 500  | Erreur serveur        |
