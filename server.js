'use strict';
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/api');


const app = express();


// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // remove $ and . from reqs


// simple rate limiter
const limiter = rateLimit({
windowMs: 60 * 1000, // 1 minute
max: 100
});
app.use(limiter);


// routes
app.use('/api', routes);


// connect to DB
const DB = process.env.DB || 'mongodb://127.0.0.1:27017/messageboard';
mongoose.set('strictQuery', false);
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
if (process.env.NODE_ENV !== 'test') {
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
}
})
.catch(err => console.error('DB connection error:', err));


module.exports = app; // for testing