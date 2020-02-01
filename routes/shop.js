const express = require('express');
const router = express.Router();


router.get('/', (req, res, next)=>{
    res.send('home page route');
   
});


module.exports = router;