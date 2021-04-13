
const background = document.querySelector('html')
background.addEventListener('keydown', (e)=> {
    console.log(e.key);
})



function updateGamepad(){
    requestAnimationFrame(updateGamepad)
    let gp = navigator.getGamepads()[0];
    if (gp !== null){
        gp.buttons.forEach(button => {
            if(button.pressed == true){
                console.log(button, gp.buttons.indexOf(button));
            }
        })
        if(gp.axes[0] > 0.15 || gp.axes[0] < -0.15) {
            console.log(gp.axes[0], "left X");
        } else if(gp.axes[1] > 0.15 || gp.axes[1] < -0.15) {
            console.log(gp.axes[1], "left Y (inverted)");
        } 
        if(gp.axes[2] > 0.15 || gp.axes[2] < -0.15) {
            console.log(gp.axes[2], "right X");
        } else if(gp.axes[3] > 0.15 || gp.axes[3] < -0.15) {
            console.log(gp.axes[3], "right Y (inverted)");
        }
    }
}


updateGamepad()
