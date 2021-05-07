var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost')
let $ = require('jquery')

var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;
let x, y = false;  //this is so that the controller doesn't send inputs when it's not in use

// Variables required for manual drive mode
var manualShift = false;
var manual = {};
var currentGear = 1; // Car's default gear is 1
var maxGear = 5;
//Maximum throttle (100) divided by maximum gear (5) currently gives us 20 throttle per gear
var throttlePerGear = 100 / maxGear;


const background = document.querySelector('html')
background.addEventListener('keydown', (e)=> {
    //Checks the mode upon pressing W
    if(e.key == 'w'){
        if(manualShift){
            client.publish('/smartcar/control/throttle', String(currentGear * throttlePerGear))
        } else {
            client.publish('/smartcar/control/throttle', '100')
        }
        manual[e.key] = true;
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
})


background.addEventListener('keyup', e => {
    //Activates/Deactivates cruise control if K is pressed
    if(e.key == 'c'){
        if(!cruiseControl){
            cruiseControl = true;
        } else {
            cruiseControl = false;
            // The car will slow down when cruise control is deactivated
            client.publish('/smartcar/control/throttle', '0');
        }
    }
    //Checks whether manual mode is activated (requires M press)
    if(e.key == 'm'){
        manualShift = true;
        //First time manual mode is activated, the car starts at first gear
        currentGear = 1;
    }
    //Reactivates automatic mode (requires N press)
    if(e.key == 'n'){
        manualShift = false;
    }
    //Increments gear by pressing shift
    if(e.key == 'Shift' && manualShift && manual['w']){
        //Limits the max gear
        if(currentGear < maxGear) {
            currentGear++;
        }
        client.publish('/smartcar/control/throttle', String(currentGear * throttlePerGear))
    }

    //Decrements gear by pressing CTRL
    if(e.key == 'Control' && manualShift && manual['w']){
        //Limits the minimum gear to 1
        if(currentGear > 1){
            currentGear--;
        }
        client.publish('/smartcar/control/throttle', String(currentGear * throttlePerGear))
    }

    if(e.key == 'w'){
        client.publish('/smartcar/control/throttle', '0')
        manual[e.key] = false;
    }
    if(e.key == 's'){
        client.publish('/smartcar/control/throttle', '0')
        cruiseControl = false;
    }
    if(e.key == 'a'){
        client.publish('/smartcar/control/steering', '0')
    }
    if(e.key == 'd'){
        client.publish('/smartcar/control/steering', '0')
    }
})



function startGamepad(fps) {  //limits the output speed
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



client.on('connect', () =>{
    client.subscribe('/smartcar/sensors/#', e => {})
})

//https://www.youtube.com/watch?v=nMUMZ5YRxHI
//https://stackoverflow.com/questions/21300921/how-to-convert-byte-array-to-image-in-javascript/21302108
//https://stackoverflow.com/questions/66672867/convert-framebuffer-dump-to-imagebmp-png-etc
client.on('message', function (topic, message) {
    // message is Buffer
    if(topic.includes('camera')) {
        let canvas = document.getElementById('backup-camera');
        let ctx = canvas.getContext('2d');
        var srcIndex = 0, dstIndex = 0;
        let width = 640;
        let height = 480;

        var mImgData = ctx.createImageData(width, height);
        for ( let i = 0; i < width * height; i ++) {
            mImgData.data[dstIndex] = message[srcIndex];            // r
            mImgData.data[dstIndex + 1] = message[srcIndex + 1];    // g
            mImgData.data[dstIndex + 2] = message[srcIndex + 2];    // b
            mImgData.data[dstIndex + 3] = 255; // 255 = 0xFF - constant alpha, 100% opaque
            srcIndex += 3;
            dstIndex += 4;
        }
        ctx.putImageData(mImgData, 0, 0);
}

     if (topic.includes('speed')) {
         var speedText = parseFloat(message)
         document.getElementById('speed').innerHTML = "Speed: " +  speedText + " m/s";
      }
     if (topic.includes('gyro')) {
        var angleText = parseFloat(message)
        document.getElementById('angle').innerHTML = "Angle: " +  angleText;
      }
     if (topic.includes('distance')) {
       var distanceText = parseFloat(message)/100
       document.getElementById('distance').innerHTML = "Distance: " +  distanceText + " m";
      }
})
