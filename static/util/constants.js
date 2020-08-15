const GAME = {
    HEIGHT: 600,
    WIDTH:  800,
    GRAVITY: 3,
    BLOCK:{
        ON_DUCK_REDUCTION: 0.5,
        HEIGHT: 30,
        WIDTH: 30,
        START_X: 75
    },
    OBSTACLE:{
        BASE_SPEED: 4,
        COOLDOWN: 65,
        MIN_HEIGHT: 30,
        MAX_HEIGHT: 50,
        MIN_WIDTH: 20,
        MAX_WIDTH: 30,
        AIR_PROBABILITY: 0.2
    }
}

export default GAME;