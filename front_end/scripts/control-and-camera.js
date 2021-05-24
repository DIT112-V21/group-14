var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost')
let $ = require('jquery')

let fpsInterval, startTime, now, then, elapsed;
let x, y = false;  //Limit the controller's input
var manualShift = false;
var manual = {};
var currentGear = 1; 
var maxGear = 5; //Maximum throttle divided by maximum gear 
var throttlePerGear = 100 / maxGear;
let aiSpeed = 0;
var ai = false;
var cruiseControl = false;

const background = document.querySelector('html');
background.addEventListener('keydown', (e) => {
    if (e.key == 'w') {
        if (manualShift) {
            client.publish('/smartcar/control/throttle', String(currentGear * throttlePerGear));
        } else {
            client.publish('/smartcar/control/throttle', '100');
        }
        manual[e.key] = true;
    }
    if (e.key == 's') {
        client.publish('/smartcar/control/throttle', '-100');
    }
    if (e.key == 'a') {
        client.publish('/smartcar/control/steering', '-45');
    }
    if (e.key == 'd') {
        client.publish('/smartcar/control/steering', '45');
    }
})

background.addEventListener('keyup', e => {
    if (e.key == 'c') {
        if (!cruiseControl) {
            cruiseControl = true;
        } else {
            cruiseControl = false;
            client.publish('/smartcar/control/throttle', '0');
        }
    }
    if (e.key == 'm') {
        manualShift = true;
        currentGear = 1; //The car starts at first gear
    }
    if (e.key == 'n') {
        manualShift = false;
    }
    if (e.key == 'Shift' && manualShift && manual['w']) {
        if (currentGear < maxGear) {
            currentGear++;
            gearShiftAudio();
        }
        client.publish('/smartcar/control/throttle', String(currentGear * throttlePerGear));
    }
    if (e.key == 'Control' && manualShift && manual['w']) {
        if (currentGear > 1) {   //Limits the minimum gear to 1
            currentGear--;
            gearShiftAudio();
        }
        client.publish('/smartcar/control/throttle', String(currentGear * throttlePerGear));
    }
    if (e.key == 'w' && !cruiseControl) {
        client.publish('/smartcar/control/throttle', '0');
        manual[e.key] = false;
    }
    if (e.key == 's') {
        client.publish('/smartcar/control/throttle', '0');
        cruiseControl = false;
    }
    if (e.key == 'a') {
        client.publish('/smartcar/control/steering', '0');
    }
    if (e.key == 'd') {
        client.publish('/smartcar/control/steering', '0');
    }
})

function gearShiftAudio() {
    let getGearAudio = "sfx_gearShift" + currentGear;
    let sfx_gearShift = document.getElementById(getGearAudio);
    sfx_gearShift.volume = 0.15;
    sfx_gearShift.play();
}

function startGamepad(fps) {  //limits the output speed
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    updateGamepad();
}

function updateGamepad() {
    requestAnimationFrame(updateGamepad);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        let gp = navigator.getGamepads()[0];
        if (gp !== null) {
            gp.buttons.forEach(button => {  //curently not used 
                if (button.pressed == true) {
                    client.publish('/smartcar/control/buttons', String(gp.buttons.indexOf(button)));
                }
            })
            if (gp.axes[2] >= 0.2 || gp.axes[2] <= -0.2) {
                client.publish('/smartcar/control/steering', String(gp.axes[2] * 45));
                x = true;
            } else if ((gp.axes[2] < 0.2 || gp.axes[2] > -0.2) && x == true) {
                client.publish('/smartcar/control/steering', '0');
                x = false;
            }
            if (gp.axes[3] >= 0.2 || gp.axes[3] <= -0.2) {
                client.publish('/smartcar/control/throttle', String(gp.axes[3] * -100));
                y = true;
            } else if ((gp.axes[3] < 0.2 || gp.axes[3] > -0.2) && y == true) {
                client.publish('/smartcar/control/throttle', '0');
                y = false;
            }
        }
    }
}

startGamepad(5)

document.getElementById('ai-Button').addEventListener('click', e => {
    if (ai) ai = false;
    else if (!ai) ai = true;
})

function camera(message, canvasID) {
    let canvas = document.getElementById(canvasID);
    let ctx = canvas.getContext('2d');
    var srcIndex = 0, dstIndex = 0;
    let width = 640;
    let height = 480;
    var mImgData = ctx.createImageData(width, height);
    for (let i = 0; i < width * height; i++) {
        mImgData.data[dstIndex] = message[srcIndex];            // r
        mImgData.data[dstIndex + 1] = message[srcIndex + 1];    // g
        mImgData.data[dstIndex + 2] = message[srcIndex + 2];    // b
        mImgData.data[dstIndex + 3] = 255; // 255 = 100% opaque
        srcIndex += 3;
        dstIndex += 4;
    }
    ctx.putImageData(mImgData, 0, 0);
}

client.on('connect', () => {
    client.subscribe('/smartcar/sensors/#', e => { })
})

client.on('message', function (topic, message) {
    if (topic.includes('camera')) {
        aiSpeed++;
        if (aiSpeed == 30) {  //slow the feed for the ai vision
            client.publish('/smartcar/sensors/ai/camera_raw', message);
            aiSpeed = 0;
        }
    }
    if (topic.includes('camera') && !ai) {
        camera(message, 'backup-camera');
    }
    if (topic.includes('camera') && ai){
        camera(message, 'other-camera');
    }
    if (topic.includes('camer_ai') && ai) {  //typo on purpose to avoid mqtt conflicts 
        camera(message, 'backup-camera');
    }
    if (topic.includes('camer_ai') && !ai) {
        camera(message, 'other-camera');
    }
    if (topic.includes('speed')) {
        var speedText = parseFloat(message);
        document.getElementById('speed').innerHTML = "Speed: " + speedText + " m/s";
    }
    if (topic.includes('gyro')) {
        var angleText = parseFloat(message);
        document.getElementById('angle').innerHTML = "Angle: " + angleText;
    }
    if (topic.includes('distance')) {
        var distanceText = parseFloat(message) / 100;
        document.getElementById('distance').innerHTML = "Distance: " + distanceText + " m";
    }
    if (manualShift || !manualShift) {
        document.getElementById('manual').innerHTML = "Manual Mode: " + manualShift;
    }
    if (currentGear) {
        if (manualShift == false) {
            document.getElementById('gear').innerHTML = "Gear: Automatic";
        } else {
            document.getElementById('gear').innerHTML = "Gear: " + currentGear;
        }
    }
    if (cruiseControl) {
        document.getElementById('cruise').innerHTML = "Cruise Control: Active";
    } else {
        document.getElementById('cruise').innerHTML = "Cruise Control: Disabled";
    }
})
