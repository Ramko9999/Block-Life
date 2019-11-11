import * as tf from "@tensorflow/tfjs";

class Tiger{

    constructor(gH, gW){
        
        this.GAME_WIDTH = gW;
        this.GAME_HEIGHT = gH;

        
        this.model = tf.sequential();

        /*
        features: distance to nearest obstacle, distance for nearest obstacle to next, height1, offest1, height2, offest2
        */
        this.model.add(tf.layers.dense(
            {"units": 6, 
            "input": [6],
            "activation": 'sigmoid'
        }
        ));

        //probablity output
        this.model.add(tf.layers.dense(
            {
                "units": 3,
                "activation": "softmax"
            }
        ));

        this.weights = this.model.layers[0].getWeights.concact(this.model.layers[1].getWeights);



        this.height = 30
        this.width = 30;

        //score of the game
        this.score = 0;
        
        this.position = {
            x: 75,
            y: gH -  this.height,
        };

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.inJump = false;
        this.inDuck = false;
        this.isDead = false;

        this.gravity = 3;

    }


    //draws tiger based on provided context
    draw(ct){
        
        if(!this.isDead){
            ct.fillStyle = "#FF00FF";
            ct.fillRect(
                this.position.x,
                this.position.y,
                this.width,
                this.height,
            );
        }
       
    }

    //unbind player from ducking
    release(){
        this.inDuck = false;
        this.position.y = this.GAME_HEIGHT - this.height;
    }


    //handles when the player is supposed to jump
    jump(multipler){
        
        //making sure double jumps do not occur. one can only jump when the tiger is at its base position
        if(this.position.y == this.GAME_HEIGHT -  this.height){
            this.velocity.y = -17 * multipler;  //give inital velocity in y direction
            this.inJump = true;
            this.inDuck =  false;

        }

    }

    //handles when the player is suppoesed to duck
    duck(){
        
        //set the avatar to half its size
        if(this.position.y == this.GAME_HEIGHT - this.height){

            this.inDuck = true;
            this.position.y = this.GAME_HEIGHT - this.height/2;
        }

    }
    
    //handles automatic player movement
    move(){
        
        if(this.inJump){

            //cut velocity in an near instaneous manner to simulate gravity
            this.velocity.y += 1/2*this.gravity
            
            if(this.velocity.y < 0){
                this.position.y += this.velocity.y;
            }
            else{

                this.position.y += this.velocity.y
                
                //check for collision with ground
                if(this.position.y >= this.GAME_HEIGHT - this.height){
                    this.velocity.y = 0;
                    this.inJump = false;
                    this.position.y = this.GAME_HEIGHT - this.height;
                }
            }
        }

        this.position.x = this.position.x % this.GAME_WIDTH;
    }
    
    predict(){
    
    }
    

}


export default Tiger;