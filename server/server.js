var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {User} = require('./models/User.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();

app.use(bodyParser.json());

app.post("/todo",authenticate,(req,res) => {
    
   var todo = new Todo({
       
       text : req.body.text,
       _creator : req.user._id
       
   });
    
    todo.save().then((docs) => {
        
        res.status(200).send(docs);
        
    },(err) => {
        
       res.status(400).send(err); 
        
    });
    
});

app.get("/todo",authenticate,(req,res) => {
    
    Todo.find({_creator : req.user._id}).then((todos) => {
        
        res.status(200).send({todos});
        
    }).catch((err) => {
        
       res.status(400).send(err); 
        
    }); 
    
});

app.get("/todo/:id",authenticate,(req,res) => {
    
   var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        
        res.status(400).send({
            
            errorMsg : "Invalid ID given"
            
        });
        
    }else{
        
        Todo.findOne({
            
            _creator : req.user._id,
            _id : id
            
        }).then((todo) => {
           
            if(todo === null){
                
                res.status(404).send({
                    
                    errorMessage : "TODO not found"
                    
                });
                
            }else{
                
                res.status(200).send(todo);    
                
            }
            
        });
        
    }
    
});

app.delete('/todo/:id',authenticate,(req,res) => {
    
    var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        
        res.status(400).send({
            
            errorMessage : "Invalid ID"
            
        });
        
    }else{
        
        Todo.findOneAndRemove({
            
            _creator : req.user._id,
            _id : id
            
        }).then((todo) => {
            
            if(todo === null){
                
                res.status(404).send({
                    
                    errorMessage : "Todo with the given ID not found"
                    
                });
                
            }else{
                
                res.status(200).send(todo);
                
            }
            
        });
        
    }
    
});

app.patch("/todo/:id",authenticate,(req,res) => {
    
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    
    if(!ObjectID.isValid(id)){
        
        res.status(400).send({
            
            errorMessage : "Invalid ID"
            
        });
        
    }else{
        
        if(_.isBoolean(body.completed) && body.completed){
            
            body.completedAt = new Date().getTime();
            
        }else{
            
            body.completed = false;
            body.completedAt = null;
            
        }
        
        Todo.findOneAndUpdate({
            
            _creator : req.user._id,
            _id : id
            
        },{
            
                $set : body 
            
            },{
            
                new : true
            
            })
            .then((todo) => {
            
            if(todo === null){
                
                res.status(404).send({
                    
                    errorMessage : "Todo with the given ID not found"
                    
                });
                
            }else{
                
                res.status(200).send(todo);
                
            }
            
        });
        
    }
    
});

app.post("/user",(req,res) => {
    
    var body = _.pick(req.body, ['email','password']);
    
    var user = new User(body);
    
    user.save().then(() => {
        
            user.generateAuthToken().then((token) => {
                
                res.status(200).header('x-auth', token).send(user);    
                
            });
            
        
        })
        .catch((err) => {
        
        res.status(400).send({
            
            errorMessage : "Could not add user"
            
        });
        
    });
    
});

app.get("/user/me",authenticate,(req,res) => {
    
    res.status(200).send(req.user);
    
});

app.post("/user/login",(req,res) => {
    
    var body = _.pick(req.body,['email','password']);
    
    User.findByCredentials(body.email,body.password).then((user) => {
        
        user.generateAuthToken().then((token) => {
            
            res.status(200).header('x-auth',token).send(user);
            
        });
            
        
    }).catch((err) => {
        
        res.status(400).send({
            
            errorMessage : "Invalid Credentials"
            
        });
        
    });
    
});

app.delete("/user/me/token",authenticate,(req,res) => {
    
    req.user.removeToken(req.token).then(() => {
        
        res.status(200).send({
            
            message : "You are logged out."
            
        });
        
    },() => {
        
        res.status(401).send(); 
        
    }); 
    
});

var port = process.env.PORT || 8000;

app.listen(port,() => {
    
   console.log(`Server listening on port ${port}`); 
    
});

module.exports = {app};