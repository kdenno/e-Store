//const Sequelize = require('sequelize');
const getDb = require("../util/database").getDb;
class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
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
        console.log(products);
        return products;
      })
      .catch(err => console.log(err));
  }
}

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
*/
module.exports = Product;
