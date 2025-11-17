'use strict';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------
// 🔐 Helmet configurado para FreeCodeCamp
// ------------------------------------------------

// 1. Deshabilitar CSP porque FCC lo requiere
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// 2. Solo permitir iframe desde same-origin
app.use(
  helmet.frameguard({
    action: 'sameorigin',
  })
);

// 3. No permitir DNS prefetching
app.use(
  helmet.dnsPrefetchControl({
    allow: false,
  })
);

// 4. Referrer solo desde same-origin
app.use(
  helmet.referrerPolicy({
    policy: 'same-origin',
  })
);
// ------------------------------------------------

// Rutas API
app.use('/api', apiRoutes);

// Home
app.get('/', (req, res) => {
  res.send('Message Board API is running');
});

// Puerto (Render usa process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
