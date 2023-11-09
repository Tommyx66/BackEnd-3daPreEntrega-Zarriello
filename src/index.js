const express = require('express');
const session = require('express-session');
const app = express();
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const productsController = require('./controllers/productsController');
const cartsController = require('./controllers/cartsController');
const authController = require('./controllers/authController');
const authorizationMiddleware = require('./middleware/authorizationMiddleware');
const db = require('./db');

const PORT = 8080;

app.use(express.json());
app.use(session({
  secret: 'your-secret-key', // Cambiar a una clave segura
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi e-commerce backend!');
});

// Rutas de autenticación
app.post('/api/products/login', authController.login);
app.get('/api/products/logout', authController.logout);

// Rutas de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/api/products/current', (req, res) => {
  if (req.isAuthenticated()) {
    // Creamos un DTO del usuario con la información necesaria
    const userDTO = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    };
    res.json(userDTO);
  } else {
    res.status(401).send('No autenticado');
  }
});

app.post('/api/products', authorizationMiddleware.checkAdmin, productsController.createProduct);
app.put('/api/products/:pid', authorizationMiddleware.checkAdmin, productsController.updateProduct);
app.delete('/api/products/:pid', authorizationMiddleware.checkAdmin, productsController.deleteProduct);
app.post('/api/carts/:cid/message', authorizationMiddleware.checkUser, cartsController.addMessage);
app.post('/api/carts/:cid/product/:pid', authorizationMiddleware.checkUser, cartsController.addProduct);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


