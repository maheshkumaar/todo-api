var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//var localhost_uri = "mongodb://localhost:27017/TodoApp";
//var mongodb_uri = localhost_uri; 
//mongoose.connect(mongodb_uri);

mongoose.connect("mongodb://mahesh_kumaar:cryptic123@ds157631.mlab.com:57631/todo-api");

module.exports = {mongoose};