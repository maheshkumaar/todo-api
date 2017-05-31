var request = require('supertest');
var expect = require('expect');
var {ObjectID} = require('mongodb');

var {app} = require('./../server/server.js');
var {Todo} = require('./../server/models/Todo.js');
var {User} = require('./../server/models/User.js');
var {sampleTodos,populateTodos,sampleUsers,populateUsers} = require('./seed/seed.js');



beforeEach(populateTodos);
beforeEach(populateUsers);
describe('POST /todo',() => {
    
   it('should return added TODO',(done) => {
       
      var text = 'A sample TODO';
       
       request(app)
        .post("/todo")
        .set('x-auth',sampleUsers[0].tokens[0].token)
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
            .set('x-auth',sampleUsers[0].tokens[0].token)
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
        .set('x-auth',sampleUsers[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            
            expect(res.body.todos.length).toBe(1);
            
        })
        .end(done);
       
   }); 
    
});

describe('GET /todo/:id',() => {

   it('should return a TODO',(done) => {
       
        request(app)
            .get(`/todo/${sampleTodos[0]._id.toString('hex')}`)
            .set('x-auth',sampleUsers[0].tokens[0].token)
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
            .set('x-auth',sampleUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
        
    });
    
    it('should return 400 for invalid ID',(done) => {
        
        var id = (new ObjectID()).toString('hex') + '11';
        
        request(app)
            .get(`/todo/${id}`)
            .set('x-auth',sampleUsers[0].tokens[0].token)
            .expect(400)
            .end(done);
        
    });

});


describe('DELETE /todo/:id',() => {
    
    it('should delete appropriate TODO',(done) => {
        
        request(app)
            .delete(`/todo/${sampleTodos[0]._id.toString('hex')}`)
            .set('x-auth',sampleUsers[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
            
                expect(res.body._id).toBe(sampleTodos[0]._id.toString('hex'));
            
            })
            .end((err,res) => {
            
                if(err){
                    
                    done(err);
                    
                }else{
                    
                    Todo.findById(sampleTodos[0]._id.toString('hex')).then((todo) => {
                        
                        expect(todo).toBe(null);
                        done();
                        
                    }).catch((err) => done(err));
                    
                }
            
        });
        
    }); 
    
     it('should return a 404 for non-existing ID',(done) => {
        
        var id = new ObjectID();
        request(app)
            .get(`/todo/${id}`)
            .set('x-auth',sampleUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
        
    });
    
    it('should return 400 for invalid ID',(done) => {
        
        var id = (new ObjectID()).toString('hex') + '11';
        
        request(app)
            .get(`/todo/${id}`)
            .set('x-auth',sampleUsers[0].tokens[0].token)
            .expect(400)
            .end(done);
        
    });
    
});

describe('PATCH /todo/:id',() => {
    
    it('should update todo if completed is true',(done) => {
        
        request(app)
            .patch(`/todo/${sampleTodos[0]._id.toString('hex')}`)
            .set('x-auth',sampleUsers[0].tokens[0].token)
            .send({
            
                text : "Sample change 1",
                completed : true
            
            })
            .expect(200)
            .expect((res) => {
            
                expect(res.body.text).toBe("Sample change 1");
                expect(res.body.completed).toBe(true);
                expect(res.body.completedAt).toBeA('number');
            
            }).end((err,res) => {
            
                if(err){
                    
                    done(err);
                    
                }else{
                    
                    Todo.findById(sampleTodos[0]._id.toString('hex')).then((todo) => {
                        
                        expect(todo).toBeA(Todo);
                        done();
                        
                    }).catch((err) => done(err));
                    
                }
            
            });
        
    });
    
    it('should set completedAt to false if it is already true',(done) => {
        
        request(app)
            .patch(`/todo/${sampleTodos[1]._id.toString('hex')}`)
            .set('x-auth',sampleUsers[1].tokens[0].token)
            .send({
            
                text : "Sample change 2",
                completed : false
            
            })
            .expect(200)
            .expect((res) => {
            
                expect(res.body.text).toBe("Sample change 2");
                expect(res.body.completed).toBe(false);
                expect(res.body.completedAt).toBe(null);
            
            }).end((err,res) => {
            
                if(err){
                    
                    done(err);
                    
                }else{
                    
                    Todo.findById(sampleTodos[0]._id.toString('hex')).then((todo) => {
                        
                        expect(todo).toBeA(Todo);
                        done();
                        
                    }).catch((err) => done(err));
                    
                }
            
            });
        
    });
    
});

describe('GET /user/me',() => {
    
    it('should return user if authenticated',(done) => {
        
         request(app)
            .get('/user/me')
            .set('x-auth',sampleUsers[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
             
                expect(res.body._id).toBe(sampleUsers[0]._id.toString('hex'));
                expect(res.body.email).toBe(sampleUsers[0].email);
             
            })
            .end(done);
        
    }); 
    
    it('should return 401 if not authenticated',(done) => {
        
        request(app)
            .get('/user/me')
            .set('x-auth',123)
            .expect(401)
            .expect((res) => {
            
                expect(res.body.errorMessage).toBeA('string');
            
            })
            .end(done);
        
    });
    
});

describe('POST /user',() => {
    
    it('should create user for valid request',(done) => {
        
        request(app)
            .post('/user')
            .send({
            
                email : 'abc@example.com',
                password : 'samplePass!'
            
            })
            .expect(200)
            .expect((res) => {
            
                expect(res.body.email).toBe('abc@example.com');
                expect(res.headers['x-auth']).toExist();
            
            })
            .end((err,res) => {
            
               if(err){
                   
                   done(err);
                   
               }else{
                   
                   User.find({email:'abc@example.com'}).then((users) => {
                       
                        expect(users.length).toBe(1);
                        expect(users[0].email).toBe('abc@example.com');
                        expect(users[0].password).toNotBe('samplePass!');
                        done();
                       
                   }).catch((err) => done(err));
                   
               } 
            
            });
            
        
    });
    
    it('should not create user for bad request',(done) => {
        
        request(app)
            .post('/user')
            .send({
            
                email : ' ',
                password : ' '
            
            })
            .expect(400)
            .expect((res) => {
            
                expect(res.body.errorMessage).toExist();
            
            })
            .end((err) => done(err));
        
    });
    
    it('should not create user for duplicate email',(done) => {
        
        request(app)
            .post('/user')
            .send({
            
                email : sampleUsers[0].email,
                password : sampleUsers[0].password
            
            })
            .expect(400)
            .expect((res) => {
            
                expect(res.body.errorMessage).toExist();
            
            })
            .end((err,res) => {
            
                if(err){
                    
                    done(err);
                    
                }else{
                    
                    User.find({
                        
                        email : sampleUsers[0].email
                        
                    }).then((users) => {
                        
                        expect(users.length).toBe(1);
                        expect(users[0].email).toBe(sampleUsers[0].email);
                        done();
                        
                    }).catch((err) => done(err));
                    
                }
            
            });
        
    });
    
});

describe('POST /user/login',() => {
    
    it('should return token for valid request',(done) => {
        
        request(app)
            .post("/user/login")
            .send({
            
                email : sampleUsers[1].email,
                password : sampleUsers[1].password
            
            })
            .expect(200)
            .expect((res) => {
            
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(sampleUsers[1].email);
            
            })
            .end((err,res) => {
            
                if(err){
                    
                    done(err);
                    
                }else{
                    
                    User.findById(sampleUsers[1]._id).then((user) => {
                        
                        expect(user.tokens[1]).toInclude({
                            
                            access : 'auth',
                            token : res.headers['x-auth']
                            
                        });
                        done();
                        
                    }).catch((err) => done(err));
                    
                }
            
            });
        
    }); 
    
    it('should not return token for invalid requests',(done) => {
        
        request(app)
            .post("/user/login")
            .send({
            
                email : 'sample',
                password : 'password'
            
            })
            .expect(400)
            .expect((res) => {
            
                expect(res.header['x-auth']).toNotExist();
            
            })
            .end((err,res) => {
            
                if(err){
                    
                    done(err);
                    
                }else{
                    
                    User.findById(sampleUsers[1]._id).then((user) => {
                        
                        expect(user.tokens.length).toBe(1);
                        done();
                        
                    }).catch((err) => done(err));
                    
                }
            
            });
        
    });
    
});

describe('DELETE /user/me/token', () => {
    
    it('should delete token for the specific logged in user',(done) => {
        
        request(app)
            .delete('/user/me/token')
            .set('x-auth',sampleUsers[0].tokens[0].token)
            .expect(200)
            .end((err,res) => {
            
                if(err){
                    
                    done(err);
                    
                }else{
                    
                    User.findById(sampleUsers[0]._id).then((user) => {
                        
                        if(!user){
                            
                            done(err);
                            
                        }else{
                            
                            expect(user.tokens).toNotInclude({
                                
                                access : 'auth',
                                token : sampleUsers[0].tokens[0].token
                                
                            });
                            done();
                            
                        }
                        
                    }).catch((err) => done(err));
                    
                }
            
            });
        
    }); 
    
});