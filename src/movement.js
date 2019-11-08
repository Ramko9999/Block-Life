class InputManagement{

    constructor(player){
        
        this.player = player;

        document.addEventListener("keyup", event=>{
            
            switch(event.keyCode){
                
                case 32:
                    player.jump();
                    break;
                
                case 40:
                    player.duck();
                    break;
                
                default:
                    console.log("Invalid Key");

            }

            
        });
    
    }
}

export default InputManagement;