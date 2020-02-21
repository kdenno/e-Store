//const Sequelize = require('sequelize');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Product", productSchema); // the .model() defines the document name and it schema

/*
const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;
class Product {
  constructor(title, price, description, imageUrl, id, userid) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongoDb.ObjectID(id) : null;
    this.userId = new mongoDb.ObjectID(userid);
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // update product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this }); // set is a special key word understoon by mongo and helps us dictate on how to update the data
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => console.log(err));
  }
  static findById(id) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: new mongoDb.ObjectID(id) })
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongoDb.ObjectID(prodId) })
      .then(result => console.log("product deleted"))
      .catch(err => console.log(err));
  }
}
*/

// create product model/table
/*
const Product = connection.define('product', {
    id:{
    type: Sequelize.INTEGER,
    allowNull: null,
    primaryKey: true,
    autoIncrement: true
},
title: Sequelize.STRING,
price: {
    type: Sequelize.INTEGER,
    allowNull: false
},
imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
},
description: {
    type: Sequelize.TEXT,
    allowNull: false
}

});

module.exports = Product;
*/
