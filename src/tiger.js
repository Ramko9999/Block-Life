export default class Tiger{

    constructor(gH, gW){
        this.height = gH;
        this.width = gW;
        this.speed = 10;
        
        this.position = {
            x: 1,
            y: 1,
        }

    }

    //draws paddle based on provided context
    draw(ct){
        
        ct.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        );

    }


    jump(){

    }

    duck(){

    }

    move(dT){
        if(dT != null){
            this.position.x += this.speed * dT;
        }
    }
}