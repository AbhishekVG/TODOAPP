var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
// console.log('MONGODB_URI', process.env.MONGODB_URI)
// mongoose.connect("mongodb://todoappDB:password1234@ds125578.mlab.com:25578/todoapp");
module.exports = {mongoose};
