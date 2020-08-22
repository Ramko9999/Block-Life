import Game from "./game.js";
import Simulation from "./simulation.js";

function playGame(){
    const game = new Game(document.getElementById("game"))
    game.start();
}

function train(){
    const session = new Simulation(64, document.getElementById("game"), 5);
    session.start();
}

train();