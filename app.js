
const fs = require('fs');

const express = require('express');
// execute express coz the express package returns a function
const app = express();
app.use('/add-product', (req, res)=>{
    res.send('<h1>This is the add product page route</h1>');

});
app.use('/', (req, res, next)=>{
    res.send('home page route');
   
});
app.listen(8000);