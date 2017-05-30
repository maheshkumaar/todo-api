const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/Todo.js');
const {User} = require('./../server/models/User.js');

var user = new User({
    
    email : 'maheshkumaar2106@gmail.com'
    
});

var id = '592d1af19b67ca33a78ae9f1';

//user.save().then((todo) => {
//    
//    console.log(todo);
//    id = todo._id;
//    
//    
//}).catch((err) => console.log(err));

if(!ObjectID.isValid(id)){
    
    console.log("ID is not valid!");
    
}else{
    
    User.findById(id).then((user) => {
    
        if(user === null){
            
            console.log("ID  does not exist.");
            
        }else{
            
            console.log(user);    
            
        }
        
        
    
    });
    
}




