var tune = document.getElementById("backgroundMusic");
var output = document.getElementById("demo");

try {
  var slider = document.getElementById("volume");
  slider.value = localStorage.getItem("audioVolume") * 100;
  slider.oninput = function () {
    let percentageVolume = this.value / 100;
    tune.volume = percentageVolume;
    localStorage.setItem("audioVolume", percentageVolume);
  }
} catch (e) { }

function musicStart() {
  tune.currentTime = sessionStorage.getItem("audioLength");
  tune.volume = localStorage.getItem("audioVolume");
  if (localStorage.getItem("musicOn") == "muted") {
    tune.autoplay = 0
    try {
      let muteCheckbox = document.getElementById("music-toggle");
      muteCheckbox.checked = true;
    } catch (e) { }
  } else tune.autoplay = 1;
}

window.onbeforeunload = function musicUpdate() {
  sessionStorage.setItem("audioLength", tune.currentTime);
}

function musicControl() {
  clickSound();
  let muteCheckbox = document.getElementById("music-toggle");
  if (muteCheckbox.checked) {
    localStorage.setItem("musicOn", "muted");
    tune.pause();
  } else {
    localStorage.setItem("musicOn", "unmuted");
    tune.play();
  }
}

function clickSound() {
  try {
    let sound = document.getElementById("pop");
    sound.play();
  } catch (e) { }
}
