const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// {
//   email: 'andrew@example.com',
//   password: 'adpsofijasdfmpoijwerew',
//   tokens: [{
//     access: 'auth',
//     token: 'poijasdpfoimasdpfjiweproijwer'
//   }]
// }

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//to filter out the JSON file sent back
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  // console.log("))))))))))",user._id.toHexString)
  // console.log("))))))))))",JSON.stringify(user._id))
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'saltt').toString();
  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  })
}

UserSchema.statics.findByToken = function(token) {
const User = this;
var decoded; 
try {
 decoded = jwt.verify(token, 'saltt');
} catch(e) {
  return Promise.reject();
}
return User.find({
  '_id': decoded._id,
  'tokens.token': token,
  'tokens.access': decoded.access 
});
}

//for logining in
UserSchema.statics.findByCredentials = function(email, password) {
  const User = this;

  User.find({email}).then((user) => {
    if(!user) {
      return Promise.reject('User not found');
    }
    bcrypt.compare(password, user.password, (err, user) => {
      if(err) return Promise.reject('wrong password');
      return Promise.resolve(user);
    })
  }).catch((err) => {
    return Promise.reject();
  })
}

//for calling as middleware before save operation
UserSchema.pre('save', function(next) {
  const user = this;
  console.log("kKg", user, user.isModified('password'))
  console.log("----------------", user.password = '1234567890');
  console.log("----------------", user.isModified)
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        console.log('here')
        next();
      })
    })
  } else {
    next();
  }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User}
