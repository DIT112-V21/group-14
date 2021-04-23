var tune = document.getElementById("backgroundMusic");

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
