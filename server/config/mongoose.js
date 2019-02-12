const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const dbName = 'myProject';

const mongoose = require('mongoose');
mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${dbName}`, {
    useNewUrlParser: true,
    useCreateIndex: true
});

module.exports = mongoose;