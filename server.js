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

// ------- Helmet requeridos por FCC -------
app.use(helmet({
  contentSecurityPolicy: false
}));

// 2. Allow iframe only from same origin
app.use(helmet.frameguard({ action: 'sameorigin' }));

// 3. Disable DNS prefetching
app.use(helmet.dnsPrefetchControl({ allow: false }));

// 4. Send referrer only for same-origin pages
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
// -----------------------------------------

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
