require('express-async-errors');
const winston = require('winston');
const config = require('config');
require('winston-mongodb');

module.exports = function () {
    const db = config.get("db");

    process.on('unhandledRejection', (ex) => {
        // console.log('Got an Unhandle d Promise Rejection. ');
        // winston.error(ex.message, ex);
        // process.exit(1);

        //throw rejection as error to get logged.
        throw ex;
    });

    winston.exceptions.handle(
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );

    winston.add(new winston.transports.File({ filename: "logFile.log" }));
    winston.add(new winston.transports.MongoDB({
        db: db,
        level: 'info',
        options: {
            useUnifiedTopology: true
        }//mongodb params
    }));

    winston.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(true),
            winston.format.simple()
        ),
        handleExceptions: true
    }));
}//logging Handling