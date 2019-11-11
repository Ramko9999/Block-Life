import Tiger from './tiger.js';
import InputManagement from './movement.js';
import Obstacle from './obstacle.js';


class Game{

    constructor(numOfPlayers, canvas){
        this.ct = canvas.getContext("2d");
        
        //game variables
        this.GAME_HEIGHT = 600;
        this.GAME_WIDTH = 800;
        this.enemySpeed = 5;
        
        //keeping track of all the players
        this.playerList = [];

        //for generating enemy variabes and controlling game flow
        this.randomMultipler = 0.009;
        this.obstacleQueue = [];
        this.gameOver = false;
        this.minimumTiles = 25; // a cooldown counter
        this.counter = 0;

        if(numOfPlayers == 1){
            var player = new Tiger(this.GAME_HEIGHT, this.GAME_WIDTH);
            new InputManagement(player);
            this.playerList.push(player);
        }
        else{
            
            for(var k = 0; k < numOfPlayers; k++){
                this.playerList.push(new Tiger(this.GAME_HEIGHT, this.GAME_WIDTH));
            }
        }

        for(var i = 0; i < this.playerList.length; i++){
            
            this.playerList[i].draw(this.ct);
        }

        requestAnimationFrame(()=> this.runGame());

    }

    runGame(){

        this.ct.clearRect(0,0,this.GAME_WIDTH, this.GAME_HEIGHT);

        if(this.gameOver){
            console.log("Game Over");
        }
        else{
            
            var random = Math.random();
    
            if(this.counter == 0){
                //generate an obstacle at that space
            
            if(random < this.randomMultipler){
    
                //generate obstacle and push onto queue
                var obstacle = new Obstacle(this.GAME_WIDTH - 15, this.GAME_HEIGHT, this.GAME_WIDTH, this.enemySpeed);
                this.obstacleQueue.push(obstacle);
    
                //reduce likeyhood for generating obstacle instantly and create a cooldown period
                this.randomMultipler -= this.randomMultipler * 0.1;
                this.counter = this.minimumTiles;
              
            }
            else{
    
                //increase likelyhood of obstacle generating
                this.randomMultipler += this.randomMultipler * 0.001;
            }
            }
            else{
                this.counter--;
            }
    
            //move and draw al obstacles in the queue
            for(var i = 0; i < this.obstacleQueue.length; i ++){
                this.obstacleQueue[i].move();
            }
        
            for(var j = 0; j < this.obstacleQueue.length; j++){
                this.obstacleQueue[j].draw(this.ct);
            }
            
            //check for obstacles
            if(this.obstacleQueue.length > 0){

                var isEveryBodyDead = true;

                for(var j = 0; j < this.playerList.length; j++){
                
                //grab player and nearest obstacle
                var player = this.playerList[j];
                var nearestOb = this.obstacleQueue[0];
                
                //check for collision with closest obstacle in the queue for all potential players
                var playerInXRange = (player.position.x + player.width) <=  (nearestOb.position.x +nearestOb.width) && (player.position.x + player.width) >= (nearestOb.position.x);
                var playerInYRange = (player.position.y + player.height) <= (nearestOb.position.y + nearestOb.height + nearestOb.heightOffset) && (player.position.y + player.height) >= (nearestOb.position.y);
                
                if(playerInXRange && playerInYRange){
                    player.isDead = true;
                }

                if(!player.isDead){
                    isEveryBodyDead = false;
                }
                
                }

                if(isEveryBodyDead){
                    this.gameOver = true;
                }

                //dequeue obstacle if they fall of the game
                if(this.obstacleQueue[0].position.x  < 0){
                    this.obstacleQueue.shift();
                }
            }

            for(var i = 0; i < this.playerList.length; i++){
                this.playerList[i].move();
                this.playerList[i].draw(this.ct);
            }

            this.enemySpeed *= 1.0005;
            requestAnimationFrame(()=> this.runGame());
        }
    }
}

var newGame = new Game(1, document.getElementById("game"));


