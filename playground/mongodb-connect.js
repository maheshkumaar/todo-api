var {MongoClient} = require('mongodb');   //Destructering an object - An ES6 feature 

MongoClient.connect("mongodb://localhost:27017/sample",(err,db) => {
    
    if(err){
        
        console.log("Connection to the server could not be established.");
        
    }else{
        
        console.log("connection to server established.");
        
        db.collection('myTable').find().toArray((err,docs) => {
            
            if(err){
                
                console.log("Error occurred.");
                
            }else{
                
                console.log(JSON.stringify(docs,undefined,2));
                
            }
            
        });
        
        db.close();
        
    } 
    
});

