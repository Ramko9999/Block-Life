import GAME from "./util/constants.js";

class Obstacle {

    constructor(pX, v) {

        this.height = Math.max(Math.min(Math.random() * 100, GAME.OBSTACLE.MAX_HEIGHT), GAME.OBSTACLE.MIN_HEIGHT);
        this.width = Math.max(Math.min(Math.random() * 100, GAME.OBSTACLE.MAX_WIDTH), GAME.OBSTACLE.MIN_WIDTH);
        this.position = {
            x: pX,
            y: GAME.HEIGHT - this.height
        };
        this.velocity = {
            x: v,
            y: 0,
        };
        if (Math.random() < GAME.OBSTACLE.AIR_PROBABILITY) {
            this.position.y -= Math.max(Math.min(Math.floor(Math.random() * 100), GAME.OBSTACLE.MAX_HEIGHT_OFFSET),
                               GAME.OBSTACLE.MIN_HEIGHT_OFFSET);
        }
    }

    getX(){
        return this.position.x;
    }

    getY(){
        return this.position.y;
    }

    getH(){
        return this.height;
    }

    getW(){
        return this.width;
    }

    getNormY(){
        const delta = this.position.y - (GAME.HEIGHT - GAME.OBSTACLE.MAX_HEIGHT - GAME.OBSTACLE.MAX_HEIGHT_OFFSET);
        return delta/(GAME.OBSTACLE.MAX_HEIGHT_OFFSET + GAME.OBSTACLE.MAX_HEIGHT - GAME.OBSTACLE.MIN_HEIGHT);
    }

    draw(ct) {

        ct.fillStyle = "#FF0000";
        ct.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    move() {
        this.position.x -= this.velocity.x;
    }
}

export default Obstacle;