var env = process.env.NODE_ENV || 'development';
const config = require('./config.json');

if(env === 'development' || env === 'test') {
   configObj = config[env];
   Object.keys(configObj).forEach((key) => {
     process.env[key] = configObj[key];
   })
}
// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
