var tune = document.getElementById("backgroundMusic");
var slider = document.getElementById("volume");
var output = document.getElementById("demo");

output.innerHTML = slider.value;// this line should show the default value of slider



//this code should update the current value of slider based on position 
slider.oninput = function() {
  output.innerHTML = this.value;
}

function volumecontrol()

function musicStart() {
  tune.currentTime = sessionStorage.getItem("audioLengthSettings");
  if (sessionStorage.getItem("musicOn") == "muted") {
    tune.autoplay = 0
    try{
      let muteCheckbox = document.getElementById("music-toggle");
      muteCheckbox.checked = true;

    }catch (e) {}

  } else tune.autoplay = 1;
}
window.onbeforeunload = function musicUpdate() {
  sessionStorage.setItem("audioLengthSettings", tune.currentTime);
}


function musicControl(){
  let muteCheckbox = document.getElementById("music-toggle");
  if (muteCheckbox.checked == true) {
    sessionStorage.setItem("musicOn", "muted");
    tune.pause();
  } else {
    sessionStorage.setItem("musicOn", "unmuted");
    tune.play();
  }
}
