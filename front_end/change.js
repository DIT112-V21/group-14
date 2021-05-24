function changeAIButtonText(){
    var elem = document.getElementById("ai-Button");
    if (elem.innerHTML === "AI View"){
        elem.innerHTML = "Normal View";
    } else {
        elem.innerHTML = "AI View";
    }
}