var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {User} = require('./models/User.js');

var app = express();

app.use(bodyParser.json());

app.post("/todo",(req,res) => {
    
   var todo = new Todo({
       
       text : req.body.text
       
   });
    
    todo.save().then((docs) => {
        
        res.status(200).send(docs);
        
    },(err) => {
        
       res.status(400).send(err); 
        
    });
    
});

app.get("/todo",(req,res) => {
    
    Todo.find().then((todos) => {
        
        res.status(200).send({todos});
        
    }).catch((err) => {
        
       res.status(400).send(err); 
        
    }); 
    
});

app.get("/todo/:id",(req,res) => {
    
   var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        
        res.status(400).send({
            
            errorMsg : "Invalid ID given"
            
        });
        
    }else{
        
        Todo.findById(id).then((todo) => {
           
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

app.delete('/todo/:id',(req,res) => {
    
    var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        
        res.status(400).send({
            
            errorMessage : "Invalid ID"
            
        });
        
    }else{
        
        Todo.findByIdAndRemove(id).then((todo) => {
            
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

var port = process.env.PORT || 8000;

app.listen(port,() => {
    
   console.log(`Server listening on port ${port}`); 
    
});

module.exports = {app};