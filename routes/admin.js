const express = require('express');
const router = express.Router();

router.get('/add-product', (req, res)=>{
    res.send('<form action="/product" method="POST"><input type="submit" value="submit"></form>');

});
router.post('/product', (req, res)=>{
    console.log(req.body);
    res.redirect('/');

});


module.exports = router;