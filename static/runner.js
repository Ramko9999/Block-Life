import Game from "./game.js";
import Simulation from "./simulation.js";

function playGame(){
    const game = new Game(document.getElementById("game"))
    game.start();
}

function train(){
    const session = new Simulation(16, document.getElementById("game"), 30);
    session.start();
}

train();