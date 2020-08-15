class InputManagement{

    constructor(player){
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

                    //increase the power of jumps
                    this.jumpMultipler *= 1.22
                    this.jumpMultipler = Math.min(this.jumpMultipler, 1.5);
                    break;
            }

    })
    
    }
}

export default InputManagement;