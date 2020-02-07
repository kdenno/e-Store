const fs = require("fs");
const path = require("path");

// get path to file
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        // cart exists, update it
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        // increase the quantity
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        // get cart products
        cart.products = [...cart.products];
        // override product
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // new product, create its info and add it to cart products
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      // update the price
      cart.totalPrice = cart.totalPrice + +productPrice;

      // now save it back to file
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }
  static deleteCartProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent)=> {
      if(err){
        return;
      }
      const updatedCart = {...JSON.parse(fileContent)};
      const theProduct = updatedCart.products.find(prod => prod.id === id);
      const productIndex = updatedCart.products.findIndex(prod=>prod.id ===id);
      // product quantity
      const prodQty = theProduct.qty;
      // remove product from cart 
      updatedCart.products = updatedCart.products.filter(prod=> prod.id !== id);
      // update total price
      updatedCart.totalPrice = updatedCart.totalPrice - prodQty * productPrice;
      // write back to file
      fs.writeFile(p, JSON.stringify(updatedCart), (err)=>{
    
      });

    });

  }
  // Get cart products
  static getCartProducts(cb) {
    fs.readFile(p, (err, fileContent)=> {
      if(err) {
      cb(null);
      return;
      }
      const cartProducts = JSON.parse(fileContent);
      cb(cartProducts);
    

    });
  }
};
