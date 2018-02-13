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
  console.log("AKSHAY",  process.env.JWT)
  // console.log("))))))))))",user._id.toHexString)
  // console.log("))))))))))",JSON.stringify(user._id))
  const token = jwt.sign({_id: user._id.toHexString(), access},  process.env.JWT).toString();
  user.tokens.push({access, token});                                                                                    ``

  return user.save().then(() => {
    return token;
  })
}

// to remove the token
UserSchema.methods.removeToken = function(token) {
  const user = this;

  return user.update({
    $pull: { 
      tokens: {token}
    }
  })
}


UserSchema.statics.findByToken = function(token) {
const User = this;
var decoded; 
try {
 decoded = jwt.verify(token, process.env.JWT);
} catch(e) {
  return Promise.reject();
}
return User.findOne({
  '_id': decoded._id,
  'tokens.token': token,
  'tokens.access': decoded.access 
});
}

//for logining in
UserSchema.statics.findByCredentials = function(email, password) {
  const User = this;

  return User.findOne({email}).then((user) => {
    console.log("user----------->", user)
    if(!user) {
      return Promise.reject('User not found');
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        console.log("res",err,  res)
        if(err || !res) return reject('wrong password');
        return resolve(user);
      })
    })
  })
  // .catch((err) => {
  //   console.log("India")
  //   return Promise.reject(err);//the error wrong pass is migrating,plz check
  // })
}

//for calling as middleware before save operation
UserSchema.pre('save', function(next) {
  const user = this;
  // console.log("kKg", user, user.isModified('password'))
  // console.log("----------------", user.password = '1234567890');
  // console.log("----------------", user.isModified)
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User}
