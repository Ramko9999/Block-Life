import Block from "./block.js";
import Game from "./game.js";
import GAME from "./util/constants.js";
import NeuralNetwork from "./nn/nn.js";
class Train extends Game {

    constructor(n, canvas, epochs) {
        super(canvas);
        this.n = n;
        this.epochs = epochs;
        this.players;
    }

    initPlayers() {
        this.players = [];
        for (let i = 0; i < this.n; i++) {
            let block = new Block();
            block.setModel(new NeuralNetwork(4, 4, 4));
            this.players.push(block);
            block.draw(this.ct);
        }
    }


    performCrossover(a, b) {

    }

    breedPool(pool) {
        const swap = (i, j) => {
            const temp = pool[j];
            pool[j] = pool[i];
            pool[i] = temp;
        }
        const pairs = [];
        for (let i = 0; i < pool.length; i++) {
            const range = pool.length - 1;
            swap(i, range);
            const fi = Math.floor(Math.random() * range);
            pairs.push([pool[fi].model, pool[i].model]);
            range -= 1;
            swap(fi, range - 1);
            const se = Math.floor(Math.random() * range);
            pairs.push([pool[se].model, pool[i].model]);
            swap(fi, range)
            range += 1;
            swap(i, range);
        }
        const children = [];
        pairs.forEach(([a, b]) => {
            [A, B] = this.performCrossover(a, b);
            children.push(A);
            children.push(B);
        });
        return children;
    }

    createNextGeneration() {
        const totalFitness = this.players.reduce((accm, value) => accm + value);
        const scores = this.players.map((value) => {
            return value / totalFitness;
        });
        let interval = 2 / (this.players.length);
        let prefixSum = 0
        let pointer = interval;
        const pool = [];
        scores.forEach((score, index) => {
            if (pointer >= prefixSum && pointer <= prefixSum + score) {
                pool.push(this.players[index]);
            }
            pointer += interval;
            prefixSum += score;
        });
        //const nextGen = breedPool(pool);
    }

    resetGame() {
        this.startEnviromentVars();
        this.ct.clearRect(0, 0, GAME.WIDTH, GAME.HEIGHT);
        this.initPlayers();
        console.log(this.epochs + " Epochs Left");
        this.epochs--;
        requestAnimationFrame(() => this.runGame());
    }

    start() {
        this.initPlayers();
        requestAnimationFrame(() => this.runGame());
    }


    getFeatures(player) {

        let odx, oy, oh, ow = 0;
        for (const obstacle of this.obstacleQueue) {
            if (obstacle.getX() - player.getX() > 0) {
                odx = (obstacle.getX() - player.getX())/(GAME.WIDTH);
                oy = obstacle.getNormY();
                oh = (obstacle.getH() - GAME.OBSTACLE.MIN_HEIGHT)/(GAME.OBSTACLE.MAX_HEIGHT - GAME.OBSTACLE.MIN_HEIGHT);
                ow = (obstacle.getW() - GAME.OBSTACLE.MIN_WIDTH)/(GAME.OBSTACLE.MAX_WIDTH - GAME.OBSTACLE.MIN_WIDTH);
                break;
            }
        }
        return [odx, oy, oh, ow];
    }

runGame() {
    this.ct.clearRect(0, 0, GAME.WIDTH, GAME.HEIGHT);
    if (this.gameOver) {
        if (this.epochs > 0) {
            this.resetGame();
        }
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
                if (!player.inJump) {
                    player.predict(this.getFeatures(player))
                }
                player.move();
                player.draw(this.ct);
            }

        }
        this.drawScoreboard(this.players[0].score);
        requestAnimationFrame(() => this.runGame());
    }
}
}

export default Train;