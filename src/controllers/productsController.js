const Product = require('../models/product'); // Importa el modelo del producto

// Función para crear un nuevo producto
async function createProduct(req, res) {
  try {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, description });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
}

// Función para obtener todos los productos
async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
}

// Otras funciones como actualizar y eliminar productos podrían ir aquí

module.exports = {
  createProduct,
  getAllProducts,
  // Exporta otras funciones aquí si es necesario
};
