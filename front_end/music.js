var tune = document.getElementById("myTune");

window.onload = function musicStart() {
  tune.currentTime = sessionStorage.getItem("audioLength");
    if (sessionStorage.getItem("musicOn") == "muted") {
      tune.autoplay = 0
    } else tune.autoplay = 1;
}
window.onbeforeunload = function musicUpdate() {
  sessionStorage.setItem("audioLength", tune.currentTime);
}


