var darkmodeCheckbox = document.getElementById("darkmode-checkbox");

function styleStart() {
    dynamicClasses = document.querySelectorAll('[class^=dynamic]')
    dynamicClasses.forEach(element => {
      var relevantClass = element.className;
      if (sessionStorage.getItem("styleSetting") == "darkmode") {
        relevantClass = element.className + "-dark";
        try{
          darkmodeCheckbox.checked = true;
        }catch (e) {}

      } else if (relevantClass.includes("-dark")){
        relevantClass = relevantClass.replace("-dark", "");
      } // this is to avoid e.g. dynamic_background_colour-dark-dark
      element.setAttribute("class", relevantClass);
    });
}
function updateStyles() {


}

function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);
}

function styleControl(){
  if (darkmodeCheckbox.checked == true) {
    sessionStorage.setItem("styleSetting", "darkmode");
    styleStart();
  } else {
    sessionStorage.setItem("styleSetting", "lightmode");
    styleStart();
  }
}
