const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const { applyFilters, sortProducts } = require('../filters'); // Importa las funciones de filtrado y ordenación
const { generateMockProducts } = require('../mocking'); // Importa la función de generación de productos simulados

const productsFilePath = path.join(__dirname, '../../data/productos.json');

// Manejador de errores comunes
const errorHandler = (res, statusCode, message) => {
    res.status(statusCode).send(message);
};

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtiene un producto por su ID.
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Producto obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Producto no encontrado.
 */

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const productsData = await fs.readFile(productsFilePath, 'utf8');
        const products = JSON.parse(productsData);
        const product = products.find(p => p.id === productId);
        if (!product) {
            return errorHandler(res, 404, 'Producto no encontrado');
        }
        res.send(product);
    } catch (error) {
        errorHandler(res, 500, 'Error al obtener el producto');
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
        const productsData = await fs.readFile(productsFilePath, 'utf8');
        let products = JSON.parse(productsData);

        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            return errorHandler(res, 404, 'Producto no encontrado');
        }

        products.splice(productIndex, 1);

        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        res.send('Producto eliminado exitosamente');
    } catch (error) {
        errorHandler(res, 500, 'Error al eliminar el producto');
    }
});

// Ruta para obtener productos con mocking (simulación)
router.get('/mockingproducts', async (req, res) => {
    try {
        const mockProducts = generateMockProducts(100); // Genera 100 productos simulados
        res.json(mockProducts);
    } catch (error) {
        errorHandler(res, 500, 'Error al generar productos simulados');
    }
});

module.exports = router;
