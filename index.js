const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');

const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

winston.handleExceptions(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

process.on('unhandledRejection', (ex) => {
    throw ex;
});

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(winston.transports.MongoDB, { 
    db: 'mongodb://localhost/movie_rental',
    level: 'info' 
});

if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/movie_rental', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('Connected To DB'))
    .catch(err => console.log('DB Connection Error', err.message));

app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

app.listen(3000, ()=>console.log("Listening on port 3000..."));