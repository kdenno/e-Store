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
const getDb = require("../util/database").getDb;
const mongoDb = require("mongodb");
class User {
  constructor(username, email, cart, userid) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this.userid = userid;
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }
  
  static findUserById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongoDb.ObjectId(userId) })
      .then(result => {
        return result;
      })
      .catch(err => console.log(err));
  }

  // since we have a tight one on one relationship btn user and cart, we can have the add to cart method on the model
  addToCart(product) {
    /* const cartProduct = this.cart.findIndex(cp => {
      return product._id === cp._id;
    }); */
    const updatedCart = { items: [{ productId: new mongoDb.ObjectID(product._id), quantity: 1 }] };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectID(this.userid) },
        { $set: { cart: updatedCart } }
      );
  }
}
module.exports = User;
