const mongoose = require('mongoose');

// Define el esquema del producto
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

// Crea el modelo de Producto
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
