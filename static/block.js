import getRandomColor from './util/color.js';
import GAME from "./util/constants.js";

class Block {

    constructor() {
        this.height = GAME.BLOCK.HEIGHT
        this.width = GAME.BLOCK.WIDTH;
        this.color = getRandomColor();
        this.score = 0;
        this.position = {
            x: GAME.BLOCK.START_X,
            y: GAME.HEIGHT - this.height,
        };
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.inJump = false;
        this.inDuck = false;
        this.isDead = false;
        this.model;
    }


    getX() {
        return this.position.x;
    }

    getY() {
        return this.position.y;
    }

    getH() {
        return this.height;
    }

    getW() {
        return this.width;
    }

    setModel(model) {
        this.model = model;
    }

    SetYToGround() {
        this.position.y = GAME.HEIGHT - this.height
    }

    isBlockAtGround() {
        return this.position.y === GAME.HEIGHT - this.height;
    }

    draw(ct) {
        if (!this.isDead) {
            ct.fillStyle = this.color;
            ct.fillRect(
                this.position.x,
                this.position.y,
                this.width,
                this.height,
            );
            ct.fillText(
                `${this.score}`,
                this.position.x,
                this.position.y,
            );
        }
    }

    revive(){
        this.position = {
            x: GAME.BLOCK.START_X,
            y: GAME.HEIGHT - this.height,
        };
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.inJump = false;
        this.inDuck = false;
        this.isDead = false;
    }


    release() {
        this.inDuck = false;
        this.SetYToGround();
    }

    jump(multiplier) {
        if (this.inDuck) {
            this.inDuck = false;
            this.SetYToGround();
        }
        if (this.isBlockAtGround()) {
            this.velocity.y = -17 * multiplier;
            this.inJump = true;
        }
    }

    duck() {
        if (this.isBlockAtGround()) {
            this.inDuck = true;
            this.position.y = GAME.HEIGHT - this.height / 2;
        }
    }

    move() {
        if (this.inJump) {
            this.velocity.y += 1 / 2 * GAME.GRAVITY
            if (this.velocity.y < 0) {
                this.position.y += this.velocity.y;
            } else {
                this.position.y += this.velocity.y
                if (this.position.y >= GAME.HEIGHT - this.height) {
                    this.velocity.y = 0;
                    this.inJump = false;
                    this.SetYToGround();
                }
            }
        }
        this.position.x = this.position.x % GAME.WIDTH;
    }

    predict(features) {
        let predictions = this.model.predict(features);
        let mi = 0;
        predictions.forEach((value, i) => {
            if (predictions[mi] < value) {
                mi = i;
            }
        });

        let index = mi;
        switch (index) {
            case 1:
                this.jump(1);
                break;
            case 2:
                this.jump(1.5);
                break;
            case 3:
                this.duck();
                break;
            default:
                this.release();
                break;
        }
    }
}


export default Block;