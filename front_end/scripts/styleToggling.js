var darkmodeCheckbox = document.getElementById("darkmode-checkbox");

function styleStart() {
  dynamicClasses = document.querySelectorAll('[class^=dynamic]')
  dynamicClasses.forEach(element => {
    var relevantClass = element.className;
    if (localStorage.getItem("styleSetting") == "darkmode") {
      relevantClass = element.className + "-dark";
      try {
        darkmodeCheckbox.checked = true;
      } catch (e) { }

    } else if (relevantClass.includes("-dark")) {
      relevantClass = relevantClass.replace("-dark", "");
    } // this is to avoid e.g. dynamic_background_colour-dark-dark
    element.setAttribute("class", relevantClass);
  });
}

function swapStyleSheet(sheet) {
  document.getElementById("pagestyle").setAttribute("href", sheet);
}

function styleControl() {
  clickSound();
  if (darkmodeCheckbox.checked) {
    localStorage.setItem("styleSetting", "darkmode");
    styleStart();
  } else {
    localStorage.setItem("styleSetting", "lightmode");
    styleStart();
  }
}

function clickSound() {
  try {
    let sound = document.getElementById("pop");
    sound.play();
  } catch (e) { }
}
