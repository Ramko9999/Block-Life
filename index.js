const express = require('express');
const path = require('path');
var app = express();



app.use(express.static('static'));

app.get("/", function(req, res){
    console.log("Grabbed");
    res.sendFile(path.join(__dirname, 'static', 'home.html'));
});

app.listen(1777);
console.log("Listening on 1777");
