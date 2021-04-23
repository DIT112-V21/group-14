var darkmodeCheckbox = document.getElementById("darkmode-checkbox");

function styleStart() {
  if (sessionStorage.getItem("styleSetting") == "darkmode") {
    swapStyleSheet("Style/Darkmode.css");
    darkmodeCheckbox.checked = true;
  } else swapStyleSheet("Style/Lightmode.css");
}

function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);
}

function styleControl(){
  if (darkmodeCheckbox.checked == true) {
    sessionStorage.setItem("styleSetting", "darkmode");
    swapStyleSheet("Style/Darkmode.css");
  } else {
    sessionStorage.setItem("styleSetting", "lightmode");
    swapStyleSheet("Style/Lightmode.css");
  }
}
