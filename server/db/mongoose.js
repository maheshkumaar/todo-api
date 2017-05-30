var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
 
mongoose.connect("mongodb://localhost:27017/TodoApp");

//mongoose.connect("mongodb://mahesh_kumaar:cryptic123@ds157631.mlab.com:57631/todo-api");

module.exports = {mongoose};