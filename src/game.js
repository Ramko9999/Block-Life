let canvas = document.getElementById("game");
let ct = canvas.getContext("2d");

const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;

const PLAYER_HEIGHT = 60;
const PLAYER_WIDTH  = 30;

var player = new Tiger(PLAYER_HEIGHT, PLAYER_WIDTH);
player.draw(ct);

