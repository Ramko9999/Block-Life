import Game from "./game.js";
import Train from "./train.js";

function playGame(){
    const game = new Game(document.getElementById("game"))
    game.start();
}

function train(){
    const session = new Train(128, document.getElementById("game"), 100);
    session.start();
}

train();