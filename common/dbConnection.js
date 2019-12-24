var mongoose = require('mongoose');
var dbcfg = require('../config/mongoConfig');

mongoose.connect('mongodb://' + dbcfg.host + ':' + dbcfg.port +'/' + dbcfg.dbname);
mongoose.set('bufferCommands', false);

module.exports = mongoose;