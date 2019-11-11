const express = requires('express');
const tf = requires('tensorflow');

var app = express();

// function performs mitosis on two sets of weights
const mutate = function(theta1, theta2){
   var breakingPoint =  Math.floor(Math.random() * theta1.length);

   var newTheta1 = theta1.splice(0, breakingPoint).concact(theta2.splice(breakingPoint, theta2.length));
   var newTheta2 = theta2.splice(0, breakingPoint).concact(theta1.splice(breakingPoint, theta1.length));

   var children = {
       t1: newTheta1,
       t2: newTheta2
   };

   return children;
}

//the client will post the rolled weight matrix as well as the associated fitness scores
app.post("/train_phase", (req, res)=>{

    var matrixScoreMap = req.body.matrixMap; //asume for now the scores are given in proper order

});
