const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const { generateMockCarts } = require('../mocking'); // Importa la función de generación de carritos simulados

const cartsFilePath = path.join(__dirname, '../../data/carritos.json');

// Manejador de errores comunes
const errorHandler = (res, statusCode, message) => {
    res.status(statusCode).send(message);
};

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtiene un carrito por su ID.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Carrito obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '404':
 *         description: Carrito no encontrado.
 */

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cartsData = await fs.readFile(cartsFilePath, 'utf8');
        const carts = JSON.parse(cartsData);
        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            return errorHandler(res, 404, 'Carrito no encontrado');
        }

        res.send(cart.products);
    } catch (error) {
        errorHandler(res, 500, 'Error al obtener el carrito');
    }
});

// Ruta para obtener carritos con mocking (simulación)
router.get('/mockingcarts', async (req, res) => {
    try {
        const mockCarts = generateMockCarts(10); // Genera 10 carritos simulados
        res.json(mockCarts);
    } catch (error) {
        errorHandler(res, 500, 'Error al generar carritos simulados');
    }
});

module.exports = router;
