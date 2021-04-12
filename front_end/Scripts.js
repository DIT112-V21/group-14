
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
                console.log(button, gp.buttons.indexOf(button))
            }
        })
    }
}

updateGamepad()
