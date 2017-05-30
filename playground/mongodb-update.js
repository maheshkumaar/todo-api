var {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/sample",(err,db) => {
    
    if(err){
        
        console.log("Error occurred.");
        
    }else{
        
        db.collection("myTable").findOneAndUpdate({
            
            text : "Hola Amigos!"
            
        }, {
                $set : {
            
                text:"Hello peeps!"
            
                }
        },{
            
            returnOriginal : false
            
        }).then((result) => {
            
            console.log(result);
            
        },(err) => {
            
            console.log("Error occurred!");
            
        });
        
    }
    
});