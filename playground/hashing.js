//var {SHA256} = require('crypto-js');
//
//var message = "I am a random string";
//
//var hash = SHA256(message).toString();
//
//console.log(`Message : ${message}`);
//console.log(`Hash value : ${hash}`);

var bcrypt = require('bcryptjs');

var password = "cryptic123";

bcrypt.genSalt(10,(err,salt) => {
    
    console.log('salt:',salt);
    bcrypt.hash(password,salt,(err,hash) => {
        
        console.log('hash:',hash); 
        
    }); 
    
});