const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configura la estrategia de autenticación local
passport.use(new LocalStrategy({
  usernameField: 'email', // Campo del formulario para el email
  passwordField: 'password', // Campo del formulario para la contraseña
  passReqToCallback: false, // Si se pasa el objeto 'req' a la función de verificación
},
  (email, password, done) => {
    // Aquí debes implementar la lógica de autenticación
    // Verifica las credenciales del usuario y llama a done() con el resultado
  }
));

module.exports = passport;
