const config = require('config');

module.exports = function() {
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey not defined.');     // Always throw Error object instead of string to get the Stack Trace
    }
}