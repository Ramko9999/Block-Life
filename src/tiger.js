class Tiger{

    constructor(gH, gW){
        
        this.GAME_WIDTH = gW;
        this.GAME_HEIGHT = gH;


        this.height = 30
        this.width = 30;

        this.score = 0;
        
        this.position = {
            x: gW/2,
            y: gH -  this.height,
        };

        this.velocity = {
            x: 3,
            y: 0,
        }

        this.inJump = false;

        this.gravity = 6;

        this.incrementVelocity = function(counter){
            this.velocity.x += 0;
            return this.velocity.x;
        }

    }

   

    //draws tiger based on provided context
    draw(ct){
        
        ct.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        );

    }

    //handles when the player is supposed to jump
    jump(){
        
        //making sure double jumps do not occur. one can only jump when the tiger is at its base position
        if(this.position.y == this.GAME_HEIGHT -  this.height){
            this.velocity.y = -25; 
            this.inJump = true;

        }

    }

    //handles when the player is suppoesed to duck
    duck(){

        console.log("Ducked")

    }
    
    //handles automatic player movement
    move(){
        
        if(this.inJump){

            this.velocity.y += 1/2*this.gravity
            
            if(this.velocity.y < 0){
                this.position.y += this.velocity.y;
            }
            else{

                this.position.y += this.velocity.y
              
                if(this.position.y >= this.GAME_HEIGHT - this.height){
                    this.velocity.y = 0;
                    this.inJump = false;
                    this.position.y = this.GAME_HEIGHT - this.height;
                }
            }
        }

        this.position.x += this.incrementVelocity(10);
        this.position.x = this.position.x % this.GAME_WIDTH;
    }
}

export default Tiger;