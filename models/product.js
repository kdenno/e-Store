// Defines a product
// const rootPath = require("../helpers/path");
const path = require("path");
const fs = require("fs");

// get path to file
const p = path.join(path.dirname(process.mainModule.filename), "data", "products.json");
function getProductsFromFile(cb) {
  fs.readFile(p, (err, fileContent)=> {
    if(err) {
        cb([]);
        return;

    }
    cb(JSON.parse(fileContent));

});

}

module.exports = class Product {
  constructor(title, imageUrl, price, description ) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
  save() {
    // create dummy id for the product
    this.id = Math.random().toString();
    // first get the filecontent 
    fs.readFile(p, (err, fileContent)=> {
        let products = []; 
        if(!err) {
            // convert to json
            products = JSON.parse(fileContent)
        }
        // push the current product to the array if no data returned from file push it to the empty array
        products.push(this); // since we are using arrow functions, this here points to the class

        // write back/update file
        fs.writeFile(p, JSON.stringify(products), (err)=>{
            console.log(err);
        });

    });
  }
  static fetchAll(cb) {
      /* Now at the moment the callback for the readFile function is only working for that function but our inherent fetchAll function does not return anything and this will cause errors down the road so what do we do? we provide a callback to the fetchall() as an argument, and call it whenever the readfile callback has exucted and pass the results of the readFile() back to the sender */
   getProductsFromFile(cb);
  }

  static fetchProduct(id, cb) {
    getProductsFromFile((products)=> {
      const product = products.find(p => p.id === id);
      cb(product);

    })

  }
};
