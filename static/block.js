import getRandomColor from './util/color.js';
import Model from './model.js';
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

    SetYToGround(){
        this.position.y = GAME.HEIGHT - this.height
    }

    isBlockAtGround(){
        return this.position.y === GAME.HEIGHT - this.height;
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


    setModel(model) {
        this.model = model;
    }

    //draws tiger based on provided context
    draw(ct) {

        if (!this.isDead) {
            ct.fillStyle = this.color;
            ct.fillRect(
                this.position.x,
                this.position.y,
                this.width,
                this.height,
            );
        }

    }

    release() {
        this.inDuck = false;
        this.position.y = GAME.HEIGHT - this.height;
    }

    jump(multiplier) {
        if(this.inDuck){
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

    //handles automatic player movement
    move() {

        if (this.inJump) {

            //cut velocity in an near instaneous manner to simulate gravity
            this.velocity.y += 1 / 2 * GAME.GRAVITY

            if (this.velocity.y < 0) {
                this.position.y += this.velocity.y;
            } else {

                this.position.y += this.velocity.y

                //check for collision with ground
                if (this.position.y >= GAME.HEIGHT - this.height) {
                    this.velocity.y = 0;
                    this.inJump = false;
                    this.position.y = GAME.HEIGHT - this.height;
                }
            }
        }

        this.position.x = this.position.x % GAME.WIDTH;
    }


    //used for the AI to predict when to jump and duck etc...
    predict(enviroment) {

        var index = Model.predict(this.model, enviroment);

        switch (index) {
            case 1:
                this.jump(1);
                break;
            case 2:
                this.jump(1.5);
                break;
            default:
                //ignore ducking for now

        }

    }
}


export default Block;