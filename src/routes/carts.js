const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../../data/carritos.json');

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cartsData = await fs.readFile(cartsFilePath, 'utf8');
        const carts = JSON.parse(cartsData);
        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.send(cart.products);
    } catch (error) {
        res.status(500).send('Error al obtener el carrito');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const cartsData = await fs.readFile(cartsFilePath, 'utf8');
        let carts = JSON.parse(cartsData);

        const cartIndex = carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) {
            return res.status(404).send('Carrito no encontrado');
        }

        const cart = carts[cartIndex];

        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
        res.send(cart);
    } catch (error) {
        res.status(500).send('Error al agregar producto al carrito');
    }
});

module.exports = router;