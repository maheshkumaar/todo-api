var request = require('supertest');
var expect = require('expect');
var {ObjectID} = require('mongodb');

var {app} = require('./../server/server.js');
var {Todo} = require('./../server/models/Todo.js');

var sampleTodos = [{
    _id : new ObjectID(),
    text : "Sample Todo 1"
},{
    _id : new ObjectID(),
    text : "Sample Todo 2"
}];

beforeEach((done) => {
   
    Todo.remove({}).then(() =>{
        
        Todo.insertMany(sampleTodos);
        done();
        
    });
    
});

describe('POST /todo',() => {
    
   it('should return added TODO',(done) => {
       
      var text = 'A sample TODO';
       
       request(app)
        .post("/todo")
        .send({text})
        .expect(200)
        .expect((res) => {
           
           expect(res.body.text).toBe(text);
           
       })
        .end((err,res) => {
           
           if(err){
               
               done(err);
               
           }else{
               
               Todo.find({text}).then((todos) => {
                   
                   expect(todos.length).toBe(1);
                   expect(todos[0].text).toBe(text);
                   done();
                   
               }).catch((err) => done(err));
               
           }
           
       });
        
       
   });
    
    it('should not add TODO for bad inputs',(done) => {
        
        request(app)
            .post("/todo")
            .send({text:""})
            .expect(400)
            .end((err,res) =>{
            
            if(err){
                
                done(err);
                
            }else{
                
                Todo.find({}).then((todos) => {
                    
                   expect(todos.length).toBe(2);
                    done();
                    
                }).catch((err) => done(err));
                
            }
        
        });
        
        
    });
    
});

describe('GET /todo',() => {
    
   it('should return all TODOS',(done) => {
       
        request(app)
        .get('/todo')
        .expect(200)
        .expect((res) => {
            
            expect(res.body.todos.length).toBe(2);
            
        })
        .end(done);
       
   }); 
    
});

describe('GET /todo/:id',() => {

   it('should return a TODO',(done) => {
       
        request(app)
            .get(`/todo/${sampleTodos[0]._id.toString('hex')}`)
            .expect(200)
            .expect((res) => {
            
                expect(res.body.text).toBe(sampleTodos[0].text);
            
            })
            .end(done);
       
    });
    
    it('should return a 404 for non-existing ID',(done) => {
        
        var id = new ObjectID();
        request(app)
            .get(`/todo/${id}`)
            .expect(404)
            .end(done);
        
    });
    
    it('should return 400 for invalid ID',(done) => {
        
        var id = (new ObjectID()).toString('hex') + '11';
        
        request(app)
            .get(`/todo/${id}`)
            .expect(400)
            .end(done);
        
    });

});