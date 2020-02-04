const express = require('express');
const router = express.Router();

const path = require('path');
const rootPath = require('../helpers/path');
const products = [];

router.get('/add-product', (req, res)=>{
    // res.sendFile(path.join(rootPath, 'views', 'add-product.html'));
    res.render('add-product', {pageTitle: 'Add Product', path: '/admin/add-product'});
});
router.post('/add-product', (req, res)=>{
    console.log(req.body);
    products.push({title: req.body.title});
    res.redirect('/');

});


exports.routes = router;
exports.products = products;