const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    const db = config.get('db');

    mongoose.createConnection(db, {
        useUnifiedTopology: true, 
        useNewUrlParser: true, 
        useFindAndModify: false
    })
    .then(() => winston.info(`Connected to ${db}...`));
}//dbHandler