import Tiger from './tiger.js';
import InputManagement from './movement.js';


let canvas = document.getElementById("game");
let ct = canvas.getContext("2d");

const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;



var player = new Tiger(GAME_HEIGHT, GAME_WIDTH);
new InputManagement(player);

player.draw(ct);

var d = new Date();
var startTime = d.getSeconds();

var gameloop = function (){
    
    ct.clearRect(0,0,GAME_WIDTH, GAME_HEIGHT);

    
    player.move();
    player.draw(ct);

    requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);
