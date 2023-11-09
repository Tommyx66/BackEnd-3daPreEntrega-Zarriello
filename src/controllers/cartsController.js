const Ticket = require('../models/ticketModel'); // Importa el modelo Ticket
const express = require('express');
const router = express.Router();

// Resto del código

router.post('/:cid/purchase', async (req, res) => {
  try {
    // Implementa la lógica de compra y genera el ticket

    const purchasedProducts = []; // Almacena los productos comprados
    const failedProducts = []; // Almacena los productos que no pudieron comprarse

    for (const product of cart.products) {
      const availableProduct = await Product.findById(product.product);

      if (availableProduct && availableProduct.stock >= product.quantity) {
        // Resta el stock del producto y añádelo a purchasedProducts
        availableProduct.stock -= product.quantity;
        await availableProduct.save();
        purchasedProducts.push(product);
      } else {
        // Agrega el producto a failedProducts
        failedProducts.push(product);
      }
    }

    if (purchasedProducts.length > 0) {
      // Calcula el total de la compra
      const totalAmount = purchasedProducts.reduce((total, product) => {
        return total + product.quantity * product.price;
      }, 0);

      // Crea un ticket
      const ticket = new Ticket({
        code: generateUniqueCode(), // Implementa una función para generar un código único
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: req.user.email,
      });

      // Guarda el ticket en la base de datos
      await ticket.save();

      // Elimina los productos comprados del carrito
      cart.products = cart.products.filter(product => !purchasedProducts.includes(product));
      await cart.save();
    }

    res.json({ purchased: purchasedProducts, failed: failedProducts });
  } catch (error) {
    res.status(500).send('Error al procesar la compra');
  }
});

