class InputManagement{

    constructor(player){
        
        this.player = player;
        this.jumpMultipler = 1;
        this.counter = 0 ;

        document.addEventListener("keyup", event=>{
            player.release();
            
            switch(event.keyCode){
                
                case 32:
                    player.jump(this.jumpMultipler);
                    this.jumpMultipler = 1;
                    break;
            }
        });

        document.addEventListener("keydown", event=>{

            switch(event.keyCode){
                
                case 40:
                    player.duck();
                    break;
                
                case 32:
                    this.jumpMultipler *= 1.09
                    this.jumpMultipler = Math.min(this.jumpMultipler, 1.2);
                    break;
            }

    })
    
    }
}

export default InputManagement;