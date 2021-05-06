window.onload = function start(){
    musicStart();
    styleStart();

    window.addEventListener("beforeunload", function () {
      document.body.classList.add("animate-out");
    }); //animate out
  }
