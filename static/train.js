import Block from "./block.js";
import Game from "./game.js";
import Model from './model.js';


class Train extends Game {

    constructor(numOfPlayers, canvas, epochs) {
        super(canvas);
        this.num = numOfPlayers;
        this.epochs = epochs;
        this.playerList = [];

    }
    //initalize players
    initPlayers() {

        this.playerList = [];
        for (var i = 0; i < this.num; i++) {
            
            //grab tiger player and set model
            var t = new Block(this.GAME_HEIGHT, this.GAME_WIDTH);
            t.setModel(Model.getModel());
            this.playerList.push(t);
            t.draw(this.ct);
        }
    }
    
    resetGame() {

        this.startEnviromentVars();
        //a way to pool the fittest candidates of the game with rouleete section

        var totalScore = 0;
        var top_fitness = [];
        var maxScore = 0;
        var index = 0;

        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].score > maxScore) {
                maxScore = this.playerList[i].score;
                index = i;
            }
            totalScore += this.playerList[i].score;
        }

        console.log("Max Score of Generation is: " + maxScore + " at: " + index);

        for (var j = 0; j < this.playerList.length / 2; j++) {

            var scoreSum = totalScore;
            var targetScore = Math.random() * scoreSum;
            var tempIndex = 0;
            var tempScore = this.playerList[0].score;
            var m1 = this.playerList[Math.floor(Math.random() * this.playerList.length)].model;
            var m2 = this.playerList[Math.floor(Math.random() * this.playerList.length)].model;

            console.log("----------------------------");
            for (var i = 0; i < this.playerList.length; i++) {
                if (targetScore - this.playerList[i].score < 0) {
                    m1 = this.playerList[i].model;
                    scoreSum -= this.playerList[i].score;
                    tempScore = this.playerList[i].score;
                    tempIndex = i;
                    this.playerList[i].score = 0;

                    break;
                }
                targetScore -= this.playerList[i].score;
            }

            var targetScore = Math.random() * scoreSum;
            for (var i = 0; i < this.playerList.length; i++) {
                if (targetScore - this.playerList[i].score < 0) {
                    m2 = this.playerList[i].model;
                    break;
                }
                targetScore -= this.playerList[i].score;
            }

            this.playerList[tempIndex].score = tempScore;
            top_fitness.push(m1, m2);
        }
        var newModelList = [];

        for (var i = 0; i < top_fitness.length - 1; i += 2) {

            var t1 = top_fitness[i];
            var t2 = top_fitness[i + 1];

            var models = Model.mitosis(t1, t2);

            newModelList.push(models[0]);
            newModelList.push(models[1]);
        }

        this.playerList = [];
        for (var k = 0; k < newModelList.length; k++) {
            var tiger = new Block(this.GAME_HEIGHT, this.GAME_WIDTH);
            tiger.setModel(newModelList[k]);
            this.playerList.push(tiger);
        }

        this.ct.clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        for (var i = 0; i < this.playerList.length; i++) {
            this.playerList[i].draw(this.ct);
        }

        console.log(this.epochs + " Epochs Left");
        this.epochs--;
        requestAnimationFrame(() => this.runGame());
    }

    start() {
        this.initPlayers();
        requestAnimationFrame(() => this.runGame());
    }

    //give a player's prediction based on enviroment variables
    predict(player) {

        //if a model exists then create features
        if (!player.inJump && !player.isDead) {

            var ob1 = {
                dist_x: -100,
                dist_y: -100,
                offest_y: -100,
                width: -100
            }

            for(var i = 0; i < this.obstacleQueue.length; i++){
                
                var nearestOb = this.obstacleQueue[i];
                ob1.dist_x = nearestOb.position.x - player.position.x;
                
                if(ob1.dist_x > 0){
                    ob1.dist_y = nearestOb.position.y;
                    ob1.offest_y = nearestOb.heightOffset;
                    ob1.width = nearestOb.width;
                    break;
                }
            }

            var features = [this.enemySpeed, ob1.dist_x, ob1.dist_y, ob1.offest_y, ob1.width];
            player.predict(features);
        }

        if (!player.isDead) {
            player.move();
            player.draw(this.ct);
        }
    }

    runGame() {

        this.ct.clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        var playListLength = this.playerList.length;

        if (this.gameOver) {
            if (this.epochs > 0) {
                this.resetGame();
            }
        } else {

            this.generateObstacle();

            //move and draw al obstacles in the queue
            for (var i = 0; i < this.obstacleQueue.length; i++) {
                this.obstacleQueue[i].move();
                this.obstacleQueue[i].draw(this.ct);
            }
            //check for obstacles
            if (this.obstacleQueue.length > 0) {
                this.checkForCollision();
                this.removeObstacle();
            }



            for (var i = 0; i < playListLength; i++) {
                this.predict(this.playerList[i]);
            }

            this.drawScoreboard(this.playerList[0].score);
            requestAnimationFrame(() => this.runGame());
        }
    }
}

/*
var trainingSess = new Train(12, document.getElementById("game"), 15);
trainingSess.start();
*/


export default Train;
