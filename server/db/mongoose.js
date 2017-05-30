var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var localhost_uri = "mongodb://localhost:27017/TodoApp";
var mongodb_uri = process.env.PROD_MONGODB || localhost_uri; 
mongoose.connect(mongodb_uri);

module.exports = {mongoose};