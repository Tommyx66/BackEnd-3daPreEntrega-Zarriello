require('dotenv').config();
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
const swaggerSetup = require('./swagger'); 
const winston = require('winston');
const errorDictionary = require('./errorDictionary');




const PORT = 8080;

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: 'errors.log', level: 'error' }));
}

app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
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

app.get('/loggerTest', (req, res) => {
  logger.debug('Log de nivel debug');
  logger.info('Log de nivel info');
  logger.warn('Log de nivel warning');
  logger.error('Log de nivel error');
  res.send('Logs generados');
});

// Manejo de errores
app.use((err, req, res, next) => {
  if (!err) return next();
  const statusCode = err.status || 500;
  const message = errorDictionary[err.message] || err.message || errorDictionary.SERVER_ERROR;
  logger.error(`Error [${statusCode}]: ${message}`);
  res.status(statusCode).json({ error: message });
});

// Incluir rutas y configuración de Swagger
app.use('/api', productsRouter);
app.use('/api', cartsRouter);
app.use(swaggerSetup);

// Iniciar el servidor
app.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});