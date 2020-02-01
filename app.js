
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
// execute express coz the express package returns a function
const app = express();

// by default, response from express is not parsed so use middleware and parse all responses
app.use(bodyParser.urlencoded({extended: false}));

app.use('/add-product', (req, res)=>{
    res.send('<form action="/product" method="POST"><input type="submit" value="submit"></form>');

});
app.post('/product', (req, res)=>{
    console.log(req.body);
    res.redirect('/');

});
app.use('/', (req, res, next)=>{
    res.send('home page route');
   
});
app.listen(8000);