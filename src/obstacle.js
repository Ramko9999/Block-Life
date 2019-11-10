class Obstacle{

    constructor(pX, gH, gW, v){

        var h = Math.max(Math.min(Math.random() * 100, 50), 25);
        this.position ={
            x: pX,
            y: gH - h
        };
        
        this.velocity ={
            x: v,
            y: 0,
        };

        this.width = 30;
        this.height = h;
        
        this.GAME_WIDTH = gW;
        this.GAME_HEIGHT = gH;

    }

    draw(ct){
        
        ct.fillStyle = "#FF0000";
        ct.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    move(){
        this.position.x -= this.velocity.x;
    }


}

export default Obstacle;