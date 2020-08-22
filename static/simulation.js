'use strict';

import Block from "./block.js";
import Game from "./game.js";
import GAME from "./util/constants.js";
import NeuralNetwork from "./nn/nn.js";
import {isColliding} from "./util/collision.js"; 

class Simulation extends Game {

    constructor(n, canvas, epochs) {
        super(canvas);
        this.n = n;
        this.epochs = epochs;
        this.players;
        this.phase = 1000;
    }

    
    drawEpochs(){
        this.ct.font ="24px Arial";
        this.ct.fillStyle ="#000000";
        this.ct.fillText("Epochs: " + this.epochs, 8, 25);
    }


    generateRandomModels(){
        const models = [];
        for(let i = 0; i < this.n; i++){
            models.push(new NeuralNetwork(GAME.MODEL.INPUT, GAME.MODEL.HIDDEN, GAME.MODEL.OUTPUT));
        }
        return models;
    }

    initPlayers() {
       this.players = this.generateRandomModels().map((model)=> {
           const block = new Block();
           block.setModel(model);
           return block;
       });
    }

    rouletteSelection(scores){
        let x = Math.random();
        let i = 0;
        while (i < scores.length){
            if(x < scores[i]){
                return i;
            }
            x -= scores[i];
            i += 1;
        }
        return scores.length - 1;
    }

    performCrossover(a, b) {
        const createNeuralNet = (layers)=>{
            const netData = {
                input_nodes: GAME.MODEL.INPUT,
                hidden_nodes: GAME.MODEL.HIDDEN,
                output_nodes: GAME.MODEL.OUTPUT,
                weights_ih: {
                    rows: GAME.MODEL.INPUT,
                    cols:GAME.MODEL.HIDDEN,
                    data: layers[0]
                },
                weights_ho: {
                    rows: GAME.MODEL.HIDDEN,
                    cols: GAME.MODEL.OUTPUT,
                    data: layers[1]
                },
                bias_h: {
                    rows: GAME.MODEL.HIDDEN,
                    cols: 1,
                    data: layers[2]
                },
                bias_o: {
                    rows: GAME.MODEL.OUTPUT,
                    cols: 1,
                    data: layers[3]
                },
                learning_rate: 0.1
            }
            return NeuralNetwork.deserialize(netData);
        }

        const aLayers = a.flatten();
        const bLayers = b.flatten();
        const cLayers = [];
        const dLayers = [];
        for (let i = 0; i < aLayers.length; i++) {
            const {rows, cols} = aLayers[i];
            const aData = aLayers[i]["data"];
            const bData = bLayers[i]["data"];
            const cLayer = [];
            const dLayer = [];
            for(let j = 0; j < rows; j++){
                const cWeights = [];
                const dWeights = [];
                for(let k = 0; k < cols; k++){
                    if(Math.random() > 0.5){
                        cWeights.push(aData[j][k]);
                        dWeights.push(bData[j][k]);
                    }
                    else{
                        cWeights.push(bData[j][k]);
                        dWeights.push(aData[j][k]);
                    }
                }
                cLayer.push(cWeights);
                dLayer.push(dWeights);
            }
            cLayers.push(cLayer);
            dLayers.push(dLayer);
        }
        return [createNeuralNet(cLayers), createNeuralNet(dLayers)];  
    }

    breedPool(pool) {
        const swap = (pool, i, j) => {
            const temp = pool[j];
            pool[j] = pool[i];
            pool[i] = temp;
        }

        const pairs = [];
        for (let i = 0; i < pool.length; i++) {
            let range = pool.length - 1;
            swap(pool, i, range);
            let j = Math.floor(Math.random() * range);
            pairs.push([pool[j].model, pool[i].model]);
            swap(pool, i, range);
        }

        const children = [];
        pairs.forEach(([a, b]) => {
            const [A, B] = this.performCrossover(a, b);
            children.push(A);
            children.push(B);
        });
        return children;
    }

    createNextGeneration() {
        let totalFitness = 0;
        this.players.forEach((player)=>{
            totalFitness += player.score;
        })
        const scores = this.players.map((player) => {
            return player.score / totalFitness;
        });
        const pool = [];

        let i = 0;
        while(i < (this.players.length/2)){
            const j = this.rouletteSelection(scores);
            pool.push(this.players[j]);
            i += 1;
        }
        return this.breedPool(pool);
    }

    resetGame() {
        this.phase = 1000;
        const generation = this.createNextGeneration();
        this.startEnviroment();
        this.players = generation.map((model) => {
            const block = new Block();
            block.setModel(model);
            return block;
        });
        this.epochs--;
        requestAnimationFrame(() => this.runGame());
    }

    start() {
        this.initPlayers();
        requestAnimationFrame(() => this.runGame());
    }

    getFeatures(player) {
        let odx = 0;
        let oy = 0;
        let oh = 0;
        let ow = 0;
        for (const obstacle of this.obstacleQueue) {
            if (obstacle.getX() - player.getX() > 0) {
                odx = (obstacle.getX() - player.getX()) / (GAME.WIDTH);
                oy = obstacle.getNormY();
                oh = (obstacle.getH() - GAME.OBSTACLE.MIN_HEIGHT) / (GAME.OBSTACLE.MAX_HEIGHT - GAME.OBSTACLE.MIN_HEIGHT);
                ow = (obstacle.getW() - GAME.OBSTACLE.MIN_WIDTH) / (GAME.OBSTACLE.MAX_WIDTH - GAME.OBSTACLE.MIN_WIDTH);
                break;
            }
        }
        return [odx, oy, oh, ow];
    }

    removeObstacle() {
        if (this.obstacleQueue[0].position.x < 0) {
            this.obstacleQueue.shift();
            for (const player of this.players) {
                if(player.isDead){
                    player.revive();
                }
                else{
                    player.score += 1;
                }
            }
        }
    }
    
    checkForCollision() {
        let nearest = this.obstacleQueue[0];
        for (const player of this.players){
            let playerCoordinates = {x: player.getX(), y: player.getY(), w:player.getW(), h:player.getH()}
            let nearestCoordinates = {x: nearest.getX(), y:nearest.getY(), w:nearest.getW(), h:nearest.getH()}
            if (isColliding(playerCoordinates, nearestCoordinates)) {
                player.isDead = true;
            }
        }
    }

    runGame() {
        this.phase -= 1;
        this.ct.clearRect(0, 0, GAME.WIDTH, GAME.HEIGHT);
        if (this.phase === 0) {
            if (this.epochs > 0) {
                this.resetGame();
            }
        } 
        else {
            this.generateObstacle();
            for (const obstacle of this.obstacleQueue) {
                obstacle.move();
                obstacle.draw(this.ct);
            }
            if (this.obstacleQueue.length > 0) {
                this.checkForCollision();
                this.removeObstacle();
            }

            let maxScore = 0;
            for (const player of this.players) {
                if (!player.isDead) {
                    if (!player.inJump) {
                        player.predict(this.getFeatures(player));
                    }
                    player.move();
                    player.draw(this.ct);
                }
                maxScore= Math.max(maxScore, player.score);
            }

            this.drawScoreboard(maxScore);
            //this.drawEpochs();
            requestAnimationFrame(() => this.runGame());
        }
    }
}

export default Simulation;