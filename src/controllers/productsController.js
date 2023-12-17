async function generateMockProducts(req, res) {
  try {
    const mockProducts = []; // Almacenará los productos simulados
    // Generar 100 productos simulados
    for (let i = 1; i <= 100; i++) {
      const product = new Product({
        name: `Product ${i}`,
        price: Math.floor(Math.random() * 100) + 1,
        description: `Description of Product ${i}`,
      });
      mockProducts.push(await product.save());
    }
    res.json(mockProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error al generar productos simulados' });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  generateMockProducts,
};