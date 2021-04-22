var tune = document.getElementById("backgroundMusic");
var muteCheckbox = document.getElementById("music-toggle");

function musicStart() {
  tune.currentTime = sessionStorage.getItem("audioLengthSettings");
  if (sessionStorage.getItem("musicOn") == "muted") {
    tune.autoplay = 0
    muteCheckbox.checked = true;
  } else tune.autoplay = 1;
}
window.onbeforeunload = function musicUpdate() {
  sessionStorage.setItem("audioLengthSettings", tune.currentTime);
}

function musicControl(){
  if (muteCheckbox.checked == true) {
    sessionStorage.setItem("musicOn", "muted");
    tune.pause();
  } else {
    sessionStorage.setItem("musicOn", "unmuted");
    tune.play();
  }
}