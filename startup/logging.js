require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');

module.exports = function () {
    process.on('unhandledRejection', (ex) => {
        // console.log('Got an Unhandle d Promise Rejection. ');
        // winston.error(ex.message, ex);
        // process.exit(1);

        //throw rejection as error to get logged.
        throw ex;
    });

    //logs to console
    winston.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
        handleExceptions: true
    }));

    //logs to a file
    winston.add(new winston.transports.File({
        filename: 'logFile.log'
    }));

    //logs exceptions only to a file
    winston.exceptions.handle(
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
      );
    
    //logs info to db
    winston.add(new winston.transports.MongoDB({
        db: 'mongodb://localhost/vidly', 
        level: 'info',
        options: {
            useUnifiedTopology: true
        }//mongodb params
    }));
}//logging Handling