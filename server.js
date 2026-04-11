const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const requeteRoutes = require('./routes/requeteRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/requetes', requeteRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'IUT Requêtes API — Online' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});