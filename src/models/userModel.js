const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
