const db = require('../db'); // Importa el módulo de acceso a la base de datos

class UserRepository {
  constructor() {
    this.collection = db.collection('users'); // Asegúrate de que la colección exista en tu base de datos
  }

  async getUserByEmail(email) {
    return this.collection.findOne({ email });
  }

  async createUser(user) {
    return this.collection.insertOne(user);
  }
}

module.exports = new UserRepository();
