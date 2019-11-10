import Tiger from './tiger.js';
import InputManagement from './movement.js';
import Obstacle from './obstacle.js';


let canvas = document.getElementById("game");
//let scoreboard = document.getElementById("score");
let ct = canvas.getContext("2d");

const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;
var enemySpeed = 5;



var player = new Tiger(GAME_HEIGHT, GAME_WIDTH);
new InputManagement(player);

var randomMultipler = 0.009;
var obstacleQueue = [];
var gameOver = false;

player.draw(ct);

var gameloop = function (){
    
    ct.clearRect(0,0,GAME_WIDTH, GAME_HEIGHT);

    if(gameOver){
        console.log("Game Over");
    }
    else{
        var random = Math.random();

        //generate an obstacle at that space
        if(random < randomMultipler){
            var obstacle = new Obstacle(GAME_WIDTH - 15, GAME_HEIGHT, GAME_WIDTH, enemySpeed);
            obstacleQueue.push(obstacle);
            randomMultipler -= randomMultipler * 0.1;
          
        }
        else{
            randomMultipler += randomMultipler * 0.001;
        }
        
        for(var i = 0; i < obstacleQueue.length; i ++){
            obstacleQueue[i].move();
        }
    
        for(var j = 0; j < obstacleQueue.length; j++){
            obstacleQueue[j].draw(ct);
        }
        
        if(obstacleQueue.length > 0){

            var playerInXRange = (player.position.x + player.width) <=  (obstacleQueue[0].position.x + obstacleQueue[0].width) && (player.position.x + player.width) >= (obstacleQueue[0].position.x);
            var playerInYRange = (player.position.y + player.height) <= (obstacleQueue[0].position.y + obstacleQueue[0].height) && (player.position.y + player.height) >= (obstacleQueue[0].position.y)
            if(playerInXRange && playerInYRange){
                gameOver = true;
            }

            if(obstacleQueue[0].position.x  < 0){
                obstacleQueue.shift();
            }
    
            
        }
    
    
        player.move();
        player.draw(ct);
    
    
    
        requestAnimationFrame(gameloop);
    }


}

requestAnimationFrame(gameloop);
