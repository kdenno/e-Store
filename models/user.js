const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, red: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  }
});
// add custom method to a schema
userSchema.methods.addToCart = function(product) {
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
      productId: product._id,
      quantity: newquantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
}


module.exports = mongoose.model("User", userSchema);

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
/*
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
        });
      })
      .catch(err => console.log(err));
  }

  deleteCartItem(prodId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== prodId;
    });
    // update the database
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectID(this.userid) },
        { $set: { cart: updatedCartItems } }
      );
  }

  createOrder() {
    const db = getDb();
    // since get cart has details about the products in the cart, lets use it
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: { _id: new mongoDb.ObjectID(this.userid), email: this.name }
        };
        return db
          .collection("orders")
          .insertOne(order)
          .then(result => {
            // clear cart
            this.cart = { items: [] };
            // update database
            return db
              .collection("users")
              .updateOne(
                { _id: new mongoDb.ObjectID(this.userid) },
                { $set: { cart: { items: [] } } }
              );
          });
      })
      .catch(err => console.log(err));
  }
  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongoDb.ObjectID(this._id) })
      .toArray()
      .then(result => {
        return result;
      })
      .catch(err => console.log(err));
  }
}
module.exports = User;
*/
