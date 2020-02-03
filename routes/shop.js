const express = require('express');
const router = express.Router();

const path = require('path');
const rootPath = require('../helpers/path');
const adminData = require('./admin');


router.get('/', (req, res, next)=>{
   console.log(adminData.products);
   res.sendFile(path.join(rootPath, 'views', 'shop.html'));
   
});


module.exports = router;