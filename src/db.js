const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/myecommercedb';

mongoose.connect(dbURI, {
     useNewUrlParser: true,
     useUnifiedTopology: true 
    });

    
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión a MongoDB establecida');
});

module.exports = db;
