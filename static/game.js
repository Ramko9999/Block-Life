import Block from "./block.js";
import InputManagement from './movement.js';
import Obstacle from './obstacle.js';
import GAME from "./util/constants.js";
import {isColliding} from "./util/collision.js";

export class GameStateHandler {
    static PAUSE = "Paused";
    static RUN = "Running";
    static START = "Start";

}

class Game {

    constructor(canvas) {
        this.ct = canvas.getContext("2d");
        this.startEnviromentVars();
        this.players = [];
    }

    startEnviromentVars() {
        this.obstacleSpeed = GAME.OBSTACLE.BASE_SPEED;
        this.randomMultipler = 0.045;
        this.obstacleQueue = [];
        this.gameOver = false;
        this.minimumTiles = GAME.OBSTACLE.COOLDOWN; // a cooldown counter
        this.counter = 0;
    }

    drawScoreboard(score){
        this.ct.font = "24px Arial";
        this.ct.fillStyle = "#000000";
        this.ct.fillText("Score: " + score, 8, 25);
    }

    createInputManagement(t) {
        new InputManagement(t);
    }

    checkForCollision() {
        let isEveryBodyDead = true;
        let nearest = this.obstacleQueue[0];

        for (const player of this.players) {
            let playerCoordinates = {x: player.getX(), y: player.getY(), w:player.getW(), h:player.getH()}
            let nearestCoordinates = {x: nearest.getX(), y:nearest.getY(), w:nearest.getW(), h:nearest.getH()}
            if (isColliding(playerCoordinates, nearestCoordinates)) {
                player.isDead = true;
            }
            if (!player.isDead) {
                isEveryBodyDead = false;
            }
        }

        if (isEveryBodyDead) {
            this.gameOver = true;
        }
    }

    generateObstacle() {
        let random = Math.random();
        if (this.counter == 0) {
            if (random < this.randomMultipler) {
                let obstacle = new Obstacle(GAME.WIDTH - 15, this.obstacleSpeed);
                this.obstacleQueue.push(obstacle);

                //reduce likeyhood for generating obstacle instantly and create a cooldown period
                this.randomMultipler -= this.randomMultipler * 0.1;
                this.counter = this.minimumTiles;
                this.obstacleSpeed *= 1.005;

            } else {
                this.randomMultipler += this.randomMultipler * 0.001;
            }
        } else {
            this.counter--;
        }
    }

    removeObstacle() {
        if (this.obstacleQueue[0].position.x < 0) {
            this.obstacleQueue.shift();

            for (const player of this.players) {
                player.score += 1;
            }
        }
    }

    initPlayers() {
        let block = new Block();
        this.players.push(block);
        this.createInputManagement(block);
        block.draw(this.ct);
    }

    start() {
        this.initPlayers()
        requestAnimationFrame(() => this.runGame());
    }

    resetGame() {
        this.startEnviromentVars();
        this.players = [];
        this.start();
    }

    runGame() {

        this.ct.clearRect(0, 0, GAME.WIDTH, GAME.HEIGHT);

        if (this.gameOver) {
            console.log("Game over");
        } else {

            this.generateObstacle();

            for (const obstacle of this.obstacleQueue) {
                obstacle.move();
                obstacle.draw(this.ct);
            }
          
            
            if (this.obstacleQueue.length > 0) {
                this.checkForCollision();
                this.removeObstacle();
            }

            for (const player of this.players) {
                if (!player.isDead) {
                    player.move();
                    player.draw(this.ct);
                }
            }
        }

        this.drawScoreboard(this.players[0].score);

        this.obstacleSpeed *= 1.0005;
        requestAnimationFrame(() => this.runGame());
    }
}

export default Game;