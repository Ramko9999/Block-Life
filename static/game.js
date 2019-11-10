import Tiger from './tiger.js.js';
import InputManagement from './movement.js.js';
import Obstacle from './obstacle.js.js';


let canvas = document.getElementById("game");
//let scoreboard = document.getElementById("score");
let ct = canvas.getContext("2d");

//game variables
const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;
var enemySpeed = 5;



var player = new Tiger(GAME_HEIGHT, GAME_WIDTH);
new InputManagement(player);

//for generating enemy variabes and controlling game flow
var randomMultipler = 0.009;
var obstacleQueue = [];
var gameOver = false;
var minimumTiles = 25; // a cooldown counter

var counter = 0;

player.draw(ct);

var gameloop = function (){
    
    ct.clearRect(0,0,GAME_WIDTH, GAME_HEIGHT);

    if(gameOver){
        console.log("Game Over");
    }
    else{
        
        var random = Math.random();

        if(counter == 0){
            //generate an obstacle at that space
        
        if(random < randomMultipler){

            //generate obstacle and push onto queue
            var obstacle = new Obstacle(GAME_WIDTH - 15, GAME_HEIGHT, GAME_WIDTH, enemySpeed);
            obstacleQueue.push(obstacle);

            //reduce likeyhood for generating obstacle instantly and create a cooldown period
            randomMultipler -= randomMultipler * 0.1;
            counter = minimumTiles;
          
        }
        else{

            //increase likelyhood of obstacle generating
            randomMultipler += randomMultipler * 0.001;
        }
        }
        else{
            counter--;
        }

        //move and draw al obstacles in the queue
        for(var i = 0; i < obstacleQueue.length; i ++){
            obstacleQueue[i].move();
        }
    
        for(var j = 0; j < obstacleQueue.length; j++){
            obstacleQueue[j].draw(ct);
        }
        
        //check for obstacles
        if(obstacleQueue.length > 0){

            //check for collision with player
            var playerInXRange = (player.position.x + player.width) <=  (obstacleQueue[0].position.x + obstacleQueue[0].width) && (player.position.x + player.width) >= (obstacleQueue[0].position.x);
            var playerInYRange = (player.position.y + player.height) <= (obstacleQueue[0].position.y + obstacleQueue[0].height + obstacleQueue[0].heightOffset) && (player.position.y + player.height) >= (obstacleQueue[0].position.y);
            
            if(playerInXRange && playerInYRange){
                gameOver = true;
            }

            //dequeue obstacle if they fall of the game
            if(obstacleQueue[0].position.x  < 0){
                obstacleQueue.shift();
            }
        }
        player.move();
        player.draw(ct);

        enemySpeed *= 1.0005;
        requestAnimationFrame(gameloop);
    }

}

requestAnimationFrame(gameloop);
