const express = require('express');
const app = express();
const winston = require('winston');

//enabling logging
require('./startup/logging')();

//getting routeHandlers
require('./startup/routes')(app);

//getting db ready
require('./startup/db')();

//loading configurations
require('./startup/config')();

//getting validators
require('./startup/validation')();

const server = app.listen(3000, () =>winston.info("Listening on port 3000..."));

module.exports = server;