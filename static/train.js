
import Tiger from "./tiger.js";
import InputManagement from './movement.js';
import Obstacle from './obstacle.js';
import Model from './model.js';

class Game{

    constructor(canvas){
        this.ct = canvas.getContext("2d");
        
        //game variables
        this.GAME_HEIGHT = 600;
        this.GAME_WIDTH = 800;
        
        this.startEnviromentVars();
        this.playerList = [];
    }

    startEnviromentVars(){
        
        this.enemySpeed = 5;
        //for generating enemy variabes and controlling game flow
        this.randomMultipler = 0.029;
        this.obstacleQueue = [];
        this.gameOver = false;
        this.minimumTiles = 65; // a cooldown counter
        this.counter = 0;


    }

    createInputManagement(t){
        new InputManagement(t);
    }


    //checks for collision between players and obstacles
    checkForCollision(){
        
        var isEveryBodyDead = true;
        var nearestOb = this.obstacleQueue[0];
        var playListLength = this.playerList.length;

        for(var j = 0; j < playListLength; j++){
                
                //grab player and nearest obstacle
                var player = this.playerList[j];
              
                
                //check for collision with closest obstacle in the queue for all potential players
                var playerInXRange = (player.position.x + player.width) <=  (nearestOb.position.x +nearestOb.width) && (player.position.x + player.width) >= (nearestOb.position.x);
                
                //y axis bounds on object
                var obsYBounds = {
                    lower: this.GAME_HEIGHT - nearestOb.heightOffset,
                    upper: this.GAME_HEIGHT - nearestOb.heightOffset - nearestOb.height,

                };

                var playerInYRange = false;

                if(player.inJump){
                        playerInYRange = player.position.y + player.height >= obsYBounds.upper;
                }
                else if(player.inDuck){
                    playerInYRange = this.GAME_HEIGHT - (player.height/2) <= obsYBounds.lower; 
                }
                else{
                    if(nearestOb.heightOffset <= player.height){
                        playerInYRange = true;
                    }
                }

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

                
    }

    //used tp generate an obstacle
    generateObstacle(){

        var random = Math.random();
        if(this.counter == 0){
            //generate an obstacle at that space
        
        if(random < this.randomMultipler){

            //generate obstacle and push onto queue
            var obstacle = new Obstacle(this.GAME_WIDTH - 15, this.GAME_HEIGHT, this.GAME_WIDTH, this.enemySpeed);
            this.obstacleQueue.push(obstacle);

            //obstacle created

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
    }

    removeObstacle(){
        
        var playListLength  = this.playerList.length;

        //dequeue obstacle if they fall of the game
        if(this.obstacleQueue[0].position.x  < 0){
            this.obstacleQueue.shift();
            
            //add to score for jumping over enemies
            for(var i = 0; i < playListLength; i++){
                this.playerList[i].score += this.enemySpeed;
            }

        }
    }
    
    initPlayers(){
            var tiger = new Tiger(this.GAME_HEIGHT, this.GAME_WIDTH);
            this.playerList.push(tiger);
            this.createInputManagement(tiger);
            tiger.draw(this.ct);
    }

    start(){
        this.initPlayers()
        requestAnimationFrame(()=> this.runGame());
    }

    //reset the game for another epoch
    resetGame(){
        this.startEnviromentVars();
        this.playerList = [];
      
        this.initPlayers();
        requestAnimationFrame(()=> this.runGame());
    }

   runGame(){

        this.ct.clearRect(0,0,this.GAME_WIDTH, this.GAME_HEIGHT);
        var playListLength = this.playerList.length;

        if(this.gameOver){
            console.log("Game over");
        }
        else{
            
            this.generateObstacle();

            //move and draw al obstacles in the queue
            for(var i = 0; i < this.obstacleQueue.length; i ++){
                this.obstacleQueue[i].move();
                this.obstacleQueue[i].draw(this.ct);
            }
            //check for obstacles
            if(this.obstacleQueue.length > 0){
                this.checkForCollision();
                this.removeObstacle();
            }

            

            for(var i = 0; i < playListLength; i++){
                
                    if(!this.playerList[i].isDead){
                        this.playerList[i].move();
                        this.playerList[i].draw(this.ct);
                    }
                }
            }

            this.enemySpeed *= 1.0005;
            requestAnimationFrame(()=> this.runGame());
        }
    }

class Train extends Game{

    constructor(numOfPlayers, canvas, epochs){
        super(canvas);
        this.num = numOfPlayers;
        this.epochs = epochs;
        this.playerList =[];
        
    }
    //initalize players
    initPlayers(){

        this.playerList = [];
        for(var i = 0; i < this.num; i++){
            var t = new Tiger(this.GAME_HEIGHT, this.GAME_WIDTH);
            t.setModel(Model.getModel());
            this.playerList.push(t);
            t.draw(this.ct);
        }
    }
    resetGame(){
       
        this.startEnviromentVars();
        //a way to pool the fittest candidates of the game with rouleete section

        var scoreSum = 0;
        var top_fitness = [];
        var maxScore = 0;

        for(var i = 0; i < this.playerList.length; i++){
            if(this.playerList[i].score > maxScore){
                maxScore = this.playerList[i].score;
            }
            scoreSum += this.playerList[i].score;
        }

        console.log("Max Score of Generation is: " + maxScore);

        for(var j = 0; j < this.playerList.length/2; j++){
        
        var targetScore = Math.random() * scoreSum;
        var m1, m2;

        for(var i = 0; i < this.playerList.length; i++){
            if(targetScore - this.playerList[i].score < 0){
                m1 = this.playerList[i].model;
                scoreSum -= this.playerList[i].score;
                this.playerList[i].score = 0;
                break;
            }
            targetScore -= this.playerList[i].score;
        }

        var targetScore = Math.random() * scoreSum;
        for(var i = 0; i < this.playerList.length; i++){
            if(targetScore - this.playerList[i].score < 0){
                m2 = this.playerList[i].model;
                break;
            }
            targetScore -= this.playerList[i].score;
        }

        top_fitness.push(m1, m2);
    }   
        var newModelList =  [];
        
        for(var i = 0; i < top_fitness.length - 1; i+=2){

            var t1 = top_fitness[i];
            var t2 = top_fitness[i + 1];
        
            var models = Model.mitosis(t1, t2);
         
            newModelList.push(models[0]);
            newModelList.push(models[1]);
        }

        this.playerList = [];
        for(var k = 0; k < newModelList.length; k++){
            var tiger = new Tiger(this.GAME_HEIGHT, this.GAME_WIDTH);
            tiger.setModel(newModelList[k]);
            this.playerList.push(tiger);
        }

        this.ct.clearRect(0,0,this.GAME_WIDTH, this.GAME_HEIGHT);
        for(var i = 0; i < this.playerList.length; i++){
            this.playerList[i].draw(this.ct);
        }

        console.log(this.epochs + " Epochs Left");
        this.epochs --;
        requestAnimationFrame(()=> this.runGame()); 
    }

    start(){
        this.initPlayers();
        requestAnimationFrame(()=> this.runGame());
    }

    //give a player's prediction based on enviroment variables
    predict(player){
        
        //if a model exists then create features
        if(!player.inJump && !player.isDead){
        
            var ob1 = {
                dist_x: 800,
                dist_y: 0,
                offest_y: 0,
            }


            var ob2 = {
                dist_x: 800,
                dist_y: 0,
                offest_y: 0,
            }

            if(this.obstacleQueue.length > 0){
                var nearestOb = this.obstacleQueue[0];

                //grab distance from obstacle as well as height and offest
                ob1.dist_x = nearestOb.position.x - player.position.x;
                ob1.dist_y = nearestOb.position.y;
                ob1.offest_y = nearestOb.heightOffset; 
            }

            if(this.obstacleQueue.length > 1){

                var secondNearest = this.obstacleQueue[1];

                //grab distances from the closest obstacle

                ob2.dist_x = secondNearest - ob1.dist_x;
                ob2.dist_y = secondNearest.position.y;
                ob2.offest_y = secondNearest.heightOffset;
            }

            
            var features = [player.position.y, this.enemySpeed,  ob1.dist_x, ob1.dist_y, ob1.offest_y, ob2.dist_x, ob2.dist_y, ob2.offest_y];
            player.predict(features);
        }

        if(!player.isDead){
            player.score += this.enemySpeed * 0.1;
            player.move();
            player.draw(this.ct);
        }
    }

    runGame(){
        
        this.ct.clearRect(0,0,this.GAME_WIDTH, this.GAME_HEIGHT);
        var playListLength = this.playerList.length;
        
        if(this.gameOver){
            if(this.epochs > 0){
                this.resetGame();
            }
        }
        else{

            this.generateObstacle();

            //move and draw al obstacles in the queue
            for(var i = 0; i < this.obstacleQueue.length; i ++){
                this.obstacleQueue[i].move();
                this.obstacleQueue[i].draw(this.ct);
            }
            //check for obstacles
            if(this.obstacleQueue.length > 0){
                this.checkForCollision();
                this.removeObstacle();
            }

            

            for(var i = 0; i < playListLength; i++){
                this.predict(this.playerList[i]);
            }

            this.enemySpeed *= 1.0005;
            requestAnimationFrame(()=> this.runGame());
        }
    }
}

var trainingSession =  new Train(8, document.getElementById("game"), 10);
trainingSession.start();