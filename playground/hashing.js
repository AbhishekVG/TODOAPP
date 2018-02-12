// const { SHA256 } = require('crypto-js');
// const message = SHA256('').toString();

// console.log(message);

const jwt = require('jsonwebtoken');

const data = {
    text: 'hi there'
};

const hashedData = jwt.sign(data, 'saltt');
console.log("____> ", hashedData)

const verified = jwt.verify(hashedData, 'saltt');
console.log('___> ', verified);
