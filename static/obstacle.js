class Obstacle {

    constructor(pX, gH, gW, v) {

        var MAX_HEIGHT  = 65;
        var MIN_HEIGHT = 30;
        var MAX_WIDTH = 40;
        var MIN_WIDTH = 20;

        //controlling height
        var h = Math.max(Math.min(Math.random() * 100, MAX_HEIGHT), MIN_HEIGHT);

        //cntrolling width
        var w = Math.max(Math.min(Math.random() * 100, MAX_WIDTH), MIN_WIDTH);

        var obstacleRNG = Math.random() * 100;

        //controlling y position
        this.position = {
            x: pX,
            y: gH - h
        };

        this.velocity = {
            x: v,
            y: 0,
        };

        this.heightOffset = 0;

        //used to create flying obstacles
        if (obstacleRNG < 0) {
            this.heightOffset = Math.max(Math.min(Math.floor(Math.random() * 100), 40), 20)
            this.position.y -= this.heightOffset;
        }

        this.width = w;
        this.height = h;

        this.GAME_WIDTH = gW;
        this.GAME_HEIGHT = gH;

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