var {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/sample",(err,db) => {
    
   if(err){
       
       console.log("Could not connect to database server.");
       
   }else{
       
       db.collection('myTable').deleteMany({
           
           text : "Hola Amigo"
           
       }).then((result) => {
           
           console.log(result.result);
           
       },(err) => {
           
           console.log("Error occurred.");
           
       });
       
   } 
    
});

// Functions Available:

// deleteMany()

//deleteOne()

//findOneAndDelete() - It finds a document , deletes it and returns the contents of the deleted document