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
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return product._id.toString() == cp.productId.toString();
    });
    let newquantity = 1;
    let updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newquantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newquantity;
    } else {
      updatedCartItems.push({
        productId: new mongoDb.ObjectID(product._id),
        quantity: newquantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectID(this.userid) },
        { $set: { cart: updatedCart } }
      );
  }
  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() == p._id.toString();
            }).quantity
          };
        })
      })
      .catch(err=> console.log(err));
  }
}
module.exports = User;
