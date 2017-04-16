/**
 * Created by Le Reveur on 2017-04-17.
 */

module.exports = function() {
    var config = require('../config.js');
    var dbInit = require('./db_init.js');
    dbInit(config.db, function (err) {
        if (err) {
            console.log("Error");
        } else {
            console.log("Initialization is done");
        }
    });
}