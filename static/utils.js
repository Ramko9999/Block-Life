export default function getRandomColor(){
    const possibleLetters = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', "C", 'D','E', 'F'];

    var colorString = '#';
    for(var i = 0; i <6; i++){
        colorString += possibleLetters[Math.floor(Math.random() * 15)]
    }

    return colorString;
}



