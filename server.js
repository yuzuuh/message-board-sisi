'use strict';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helmet EXACTO para FCC
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  helmet.frameguard({
    action: 'sameorigin',
  })
);

app.use(
  helmet.dnsPrefetchControl({
    allow: false,
  })
);

app.use(
  helmet.referrerPolicy({
    policy: 'same-origin',
  })
);

// FCC requiere una página en la raíz
app.use(express.static(__dirname + '/public'));

// Rutas API
app.use('/api', apiRoutes);

// Puerto Render / local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 
module.exports = app;
