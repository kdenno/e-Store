const express = require("express");
const fileHelper = require("../util/file");
const Product = require("../models/product");

exports.deleteAjx = (req, res, next) => {
  const productId = req.params.id;
  return Product.findById()
    .then(prod => {
      if (!prod) {
        return res.status(500).json({ message: "Product doesnt exist" });
      }
      // delete product image
      fileHelper.deleteFile(prod.imageUrl);
      return Product.deleteOne({
        _id: productId,
        userId: req.theuser._id
      }).then(() => {
        res.status(200).json({ message: "Success" });
      });
    })
    .catch(err => {
      return res.status(500).json({ message: "Error Occured" });
    });
};
