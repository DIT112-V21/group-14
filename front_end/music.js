var tune = document.getElementById("backgroundMusic");
var output = document.getElementById("demo");

// output.innerHTML = slider.value;// this line should show the default value of slider



//this code should update the current value of slider based on position 
try{
  var slider = document.getElementById("volume");
  slider.value = sessionStorage.getItem("audioVolume")*100;
  slider.oninput = function() {
    let percentageVolume = this.value/100;
    tune.volume = percentageVolume;
    sessionStorage.setItem("audioVolume", percentageVolume);
  }
}catch (e) {}

function musicStart() {
  tune.currentTime = sessionStorage.getItem("audioLengthSettings");
  tune.volume = sessionStorage.getItem("audioVolume");
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
