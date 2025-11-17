'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api');

const app = express();

// Middlewares
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

// --- MONGODB ---
const DB = process.env.DB || 'mongodb://127.0.0.1:27017/messageboard';

mongoose.set('strictQuery', false);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected');

    // Evitamos que el servidor arranque en modo test
    if (process.env.NODE_ENV !== 'test') {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () =>
        console.log(`Server running on port ${PORT}`)
      );
    }
  })
  .catch((err) => console.error('MongoDB error:', err));

module.exports = app;
