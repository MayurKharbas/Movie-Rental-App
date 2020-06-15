const express = require('express');
const app = express();
const mongoose = require('mongoose');

const genres = require('./routes/genres');
const customer = require('./routes/customers');

mongoose.connect('mongodb://localhost/movie_rental', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('Conneted To DB'))
    .catch(err => console.log('DB Connection Error', err.message));

app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers',customer);

const port = process.env.PORT || 3005;
app.listen(port, ()=>console.log("Listening on port 3005..."));