const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect('mongodb://localhost/movie_rental')
    .then(() => winston.info('Connected To DB'));
}