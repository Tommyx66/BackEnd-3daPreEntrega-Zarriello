const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../../data/productos.json');

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const productsData = await fs.readFile(productsFilePath, 'utf8');
        const products = JSON.parse(productsData);
        const product = products.find(p => p.id === productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.send(product);
    } catch (error) {
        res.status(500).send('Error al obtener el producto');
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
        const productsData = await fs.readFile(productsFilePath, 'utf8');
        let products = JSON.parse(productsData);

        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            return res.status(404).send('Producto no encontrado');
        }

        products.splice(productIndex, 1);

        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        res.send('Producto eliminado exitosamente');
    } catch (error) {
        res.status(500).send('Error al eliminar el producto');
    }
});

module.exports = router;