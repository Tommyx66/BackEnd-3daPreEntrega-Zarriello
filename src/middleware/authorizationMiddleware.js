function checkAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).send('Acceso no autorizado');
  }
  
  function checkUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
      return next();
    }
    return res.status(403).send('Acceso no autorizado');
  }
  
  module.exports = {
    checkAdmin,
    checkUser,
  };
  