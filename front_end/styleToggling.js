var darkmodeCheckbox = document.getElementById("darkmode-checkbox");

function styleStart() {
  if (localStorage.getItem("styleSetting") == "darkmode") {
    swapStyleSheet("Style/Darkmode.css");
    darkmodeCheckbox.checked = true;
  } else swapStyleSheet("Style/Lightmode.css");
}

function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);
}

function styleControl(){
  if (darkmodeCheckbox.checked == true) {
    localStorage.setItem("styleSetting", "darkmode");
    swapStyleSheet("Style/Darkmode.css");
  } else {
    localStorage.setItem("styleSetting", "lightmode");
    swapStyleSheet("Style/Lightmode.css");
  }
}
