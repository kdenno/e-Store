const express = require('express');
const router = express.Router();

const path = require('path');
const rootPath = require('../helpers/path');
const adminData = require('./admin');


router.get('/', (req, res, next)=>{
   // res.sendFile(path.join(rootPath, 'views', 'shop.html'));
   const products = adminData.products;
   // render and pass data into the view
   res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});
   
});


module.exports = router;