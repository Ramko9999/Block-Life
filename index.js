const express = requires('express');

var app = express();

var mutate = function(theta1, theta2){
    
}

//the client will post the rolled weight matrix as well as the associated fitness scores
app.post("/train_phase", (req, res)=>{

    var matrixScoreMap = req.body.matrixMap;
    
    //find n highest scores and perform mutations


});
