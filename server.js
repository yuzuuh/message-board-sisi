'use strict';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seguridad básica
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// Rutas
app.use('/api', apiRoutes);

// Home
app.get('/', (req, res) => {
  res.send('Message Board API is running');
});

// Render usa process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
