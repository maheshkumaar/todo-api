const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../server/models/Todo.js');
const {User} = require('./../../server/models/User.js');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var sampleTodos = [{
    _id : new ObjectID(),
    text : "Sample Todo 1",
    _creator : userOneId
},{
    _id : new ObjectID(),
    text : "Sample Todo 2",
    completed : true,
    completedAt : 33344,
    _creator : userTwoId
}];

var sampleUsers = [{
    
    _id : userOneId,
    email : 'mahesh@example.com',
    password : 'cryptic123',
    tokens : [{
        
        access : 'auth',
        token : jwt.sign({
            
            _id : userOneId,
            access : 'auth'
            
        },'abc123').toString()
        
    }]
    
},{
    
    _id : userTwoId,
    email : 'another@example.com',
    password : 'userTwoPass',
    tokens : [{
        
        access : 'auth',
        token : jwt.sign({
            
            _id : userTwoId,
            access : 'auth'
            
        },'abc123').toString()
        
    }]
    
}];

var populateTodos = (done) => {
   
    Todo.remove({}).then(() =>{
        
        Todo.insertMany(sampleTodos);
        done();
        
    });
    
};

var populateUsers = (done) => {
    
  User.remove({}).then(() => {
     
      var user1 = new User(sampleUsers[0]).save();
      var user2 = new User(sampleUsers[1]).save();
      
    return   Promise.all([user1,user2]);
      
  }).then(() => done());  
    
};

module.exports = {
    
    sampleTodos,
    populateTodos,
    sampleUsers,
    populateUsers
    
};