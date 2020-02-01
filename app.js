
const fs = require('fs');

const express = require('express');
// execute express coz the express package returns a function
const app = express();
// create middleware using the .use();
app.use((req, res, next)=>{
    console.log('in the middleware');
    // allow the request to proceed by calling the next(); without it the request would never  jump out of this function
    next();

});
app.use((req, res, next)=>{
    res.send('this part of the file is now reachable');
   
});
app.listen(8000);