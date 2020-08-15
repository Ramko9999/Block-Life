export default function getRandomColor(){
    const possibleLetters = ['1', '2', '3', '4', '5', '6', '7', '8'];

    var colorString = '#';
    for(var i = 0; i <6; i++){
        colorString += possibleLetters[Math.floor(Math.random() * 8)];
    }

    return colorString;
}