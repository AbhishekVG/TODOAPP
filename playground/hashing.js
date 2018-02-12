const { SHA256 } = require('crypto-js');
const message = SHA256('').toString();
const bcrypt = require('bcryptjs');

//------------------------------------------------SHA256--------------------------------------------------------

// console.log(message);

// const jwt = require('jsonwebtoken');

// const data = {
    //     text: 'hi there'
    // };
    
    // const hashedData = jwt.sign(data, 'saltt');
    // console.log("____> ", hashedData)
    
    // const verified = jwt.verify(hashedData, 'saltt');
    // console.log('___> ', verified);
    
//------------------------------------------------SHA256--------------------------------------------------------

//------------------------------------------------bcrypt--------------------------------------------------------
 const password ="password";
 var hashedPass;
 var promisE =() => {
     return new Promise((resolve, reject) => {
        bcrypt.genSalt(15, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                console.log(hash)
                hashedPass = hash.toString();
                return resolve(hashedPass);
            })
        })
     })
 };
//  promisE().then(hashedPass => bcrypt.compare('password', hashedPass, (err, res) => {  //res = false
 promisE().then(hashedPass => bcrypt.compare(password, hashedPass, (err, res) => { //res = true
     console.log('err = ', err)
     console.log('res = ', res)
 }))
//------------------------------------------------bcrypt--------------------------------------------------------