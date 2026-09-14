(function () {
  "use strict";

  var UNIT_ID = "metal-dicks-robot-lounge";
  var player = document.getElementById("stage-player");
  var title = document.getElementById("act-title");
  var artist = document.getElementById("act-artist");
  var type = document.getElementById("act-type");
  var grid = document.getElementById("act-grid");
  var empty = document.getElementById("empty-booking");
  var acts = Array.prototype.slice.call(document.querySelectorAll(".act"));
  var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));

  function playAct(button) {
    if (!button || !player) return;
    var video = button.getAttribute("data-video");
    if (!/^[A-Za-z0-9_-]{11}$/.test(video || "")) return;

    player.src = "https://www.youtube-nocookie.com/embed/" + video + "?autoplay=1&rel=0&playsinline=1";
    player.title = (button.getAttribute("data-artist") || "Robot act") + " — " + (button.getAttribute("data-title") || "On stage");
    title.textContent = button.getAttribute("data-title") || "On stage";
    artist.textContent = button.getAttribute("data-artist") || "Robot act";
    type.textContent = button.getAttribute("data-kind") === "rap" ? "Robot rap" : button.getAttribute("data-kind");

    acts.forEach(function (act) {
      var playing = act === button;
      act.classList.toggle("is-playing", playing);
      var badge = act.querySelector(".act__thumb i");
      if (badge) badge.textContent = playing ? "On stage" : "Play";
    });

    document.querySelector(".stage-wrap").scrollIntoView({ behavior: "smooth", block: "center" });
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("video", video);
      history.replaceState(null, "", url);
    } catch (e) {}
  }

  function filterActs(kind, clicked) {
    var visible = 0;
    filters.forEach(function (filter) {
      var active = filter === clicked;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", active ? "true" : "false");
    });
    acts.forEach(function (act) {
      var show = kind === "all" || act.getAttribute("data-kind") === kind;
      act.hidden = !show;
      if (show) visible += 1;
    });
    if (grid) grid.hidden = visible === 0;
    if (empty) empty.hidden = visible !== 0;
  }

  acts.forEach(function (act) {
    act.addEventListener("click", function () { playAct(act); });
  });
  filters.forEach(function (filter) {
    filter.addEventListener("click", function () { filterActs(filter.getAttribute("data-filter"), filter); });
  });

  try {
    var requested = new URL(window.location.href).searchParams.get("video");
    var requestedAct = acts.find(function (act) { return act.getAttribute("data-video") === requested; });
    if (requestedAct) playAct(requestedAct);
  } catch (e) {}

  if (window.mallNav && window.mallNav.ready) {
    window.mallNav.ready.then(function () {
      var prev = document.getElementById("nav-prev");
      var next = document.getElementById("nav-next");
      var previousUnit = window.mallNav.getPrev(UNIT_ID);
      var nextUnit = window.mallNav.getNext(UNIT_ID);
      if (prev) {
        if (previousUnit) prev.href = previousUnit.path;
        else prev.hidden = true;
      }
      if (next) {
        if (nextUnit) next.href = nextUnit.path;
        else next.hidden = true;
      }
    });
  }
})();
