/* Metal Dick's Robot Lounge */
(function () {
  "use strict";

  var UNIT_ID = "metal-dicks-robot-lounge";

  function wireNav() {
    if (!window.mallNav || !window.mallNav.ready) return;
    window.mallNav.ready.then(function () {
      var prev = document.getElementById("nav-prev");
      var next = document.getElementById("nav-next");
      if (!prev && !next) return;
      var p = window.mallNav.getPrev(UNIT_ID);
      var n = window.mallNav.getNext(UNIT_ID);
      if (prev) {
        if (p) prev.href = p.path;
        else prev.style.display = "none";
      }
      if (next) {
        if (n) next.href = n.path;
        else next.style.display = "none";
      }
    });
  }

  function boot() {
    wireNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
