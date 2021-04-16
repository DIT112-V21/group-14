var tune = document.getElementById("elevatorbossnova");
var muteCheckbox = document.getElementById("music-toggle");

window.onload = function pageStart() {
  tune.currentTime = sessionStorage.getItem("audioLengthSettings");
  if (sessionStorage.getItem("musicOn") == "muted") {
    tune.autoplay = 0
  } else tune.autoplay = 1;

// The muted button will revert to unchecked if you leave
if (sessionStorage.getItem("musicOn") == "muted") {
      muteCheckbox.checked = true;
  }
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