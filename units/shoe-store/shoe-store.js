/* Shoe Station: tiny enhancement: tap a photo to look closer */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var shots = document.querySelectorAll(".shot");
    for (var i = 0; i < shots.length; i++) {
      shots[i].addEventListener("click", function () {
        this.classList.toggle("zoom");
      });
    }
  });
})();
