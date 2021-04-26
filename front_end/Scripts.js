var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost')
let $ = require('jquery')

var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;
let x, y = false;  //this is so that the constoller doesn't send inputs when it's not in use 


const background = document.querySelector('html')
background.addEventListener('keydown', (e)=> {
    if(e.key == 'w'){
        client.publish('/smartcar/control/throttle', '100')
    }  
    if(e.key == 's'){
        client.publish('/smartcar/control/throttle', '-100')
    }  
    if (e.key == 'a'){
        client.publish('/smartcar/control/steering', '-45')
    }  
    if (e.key == 'd'){
        client.publish('/smartcar/control/steering', '45')
    } 
    console.log(e.key)
})


background.addEventListener('keyup', e => {
    if(e.key == 'w'){
        client.publish('/smartcar/control/throttle', '0')
    }
    if(e.key == 's'){
        client.publish('/smartcar/control/throttle', '0') 
    } 
    if(e.key == 'a'){
        client.publish('/smartcar/control/steering', '0') 
    }  
    if(e.key == 'd'){
        client.publish('/smartcar/control/steering', '0')
    }
})



function startGamepad(fps) {  //limit the output speed
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    updateGamepad();
}


function updateGamepad(){
    requestAnimationFrame(updateGamepad)
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        let gp = navigator.getGamepads()[0];
        if (gp !== null){
            gp.buttons.forEach(button => {
                if(button.pressed == true){
                    console.log(button, gp.buttons.indexOf(button));
                    client.publish('/smartcar/control/buttons', String(gp.buttons.indexOf(button)))
                }
            })
            if(gp.axes[2] >= 0.2 || gp.axes[2] <= -0.2) {
                console.log(gp.axes[2], "right X");
                client.publish('/smartcar/control/steering', String(gp.axes[2]*45));
                x = true
            } else if( (gp.axes[2] < 0.2 || gp.axes[2] > -0.2) && x == true){
                client.publish('/smartcar/control/steering', '0');
                x = false
            }
            
            if(gp.axes[3] >= 0.2 || gp.axes[3] <= -0.2) {
                console.log(gp.axes[3], "right Y (inverted)");
                client.publish('/smartcar/control/throttle', String(gp.axes[3]*-100));
                y = true
            } else if ( (gp.axes[3] < 0.2 || gp.axes[3] > -0.2) && y == true){
                client.publish('/smartcar/control/throttle', '0');
                y = false
            }
        }
    }
}



startGamepad(5)
