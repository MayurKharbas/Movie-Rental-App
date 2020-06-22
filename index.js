const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rental = require('./routes/rental');

mongoose.connect('mongodb://localhost/movie_rental', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('Conneted To DB'))
    .catch(err => console.log('DB Connection Error', err.message));

app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rental', rental);

app.listen(3000, ()=>console.log("Listening on port 3000..."));