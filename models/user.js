/*
const sequelize = require("sequelize");
const connection = require("../util/database");

const User = connection.define('user', {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  email: sequelize.STRING,
  name: sequelize.STRING
});
*/
const getDb = require("../util/database");
const mongoDb = require("mongodb");
class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }
  static findUserById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ id: new mongoDb.ObjectId(userId) })
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }
}
module.exports = User;
