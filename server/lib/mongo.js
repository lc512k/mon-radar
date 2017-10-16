const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
module.exports = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/monradar');
