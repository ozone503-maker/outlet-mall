(function () {
  "use strict";
  var house = document.getElementById("house-loop");
  var soundBtn = document.getElementById("house-sound");
  if (house && soundBtn) {
    house.volume = 0.55;
    soundBtn.addEventListener("click", function () {
      if (house.paused || house.muted) {
        house.muted = false;
        var play = house.play();
        if (play && play.catch) play.catch(function () {});
        soundBtn.classList.add("is-on");
        soundBtn.setAttribute("aria-pressed", "true");
        soundBtn.textContent = "Sound on";
      } else {
        house.pause();
        soundBtn.classList.remove("is-on");
        soundBtn.setAttribute("aria-pressed", "false");
        soundBtn.textContent = "Sound off";
      }
    });
  }

  var UNIT_ID = "metal-dicks-robot-lounge";
  var player = document.getElementById("stage-player");
  var title = document.getElementById("act-title");
  var artist = document.getElementById("act-artist");
  var type = document.getElementById("act-type");
  var grid = document.getElementById("act-grid");
  var empty = document.getElementById("empty-booking");
  var acts = Array.prototype.slice.call(document.querySelectorAll(".act"));
  var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var fuseLevel = 18;
  var OPENING = Date.parse("2026-10-02T06:00:00Z"); // Oct 1 8pm HST

  function playAct(button) {
    if (!button || !player) return;
    var src = button.getAttribute("data-src");
    var video = button.getAttribute("data-video");
    if (player.tagName === "IFRAME") return;
    if (src) {
      player.src = src;
      try { player.play(); } catch (e) {}
    } else return;
    player.title = (button.getAttribute("data-artist") || "Robot act") + " — " + (button.getAttribute("data-title") || "On stage");
    title.textContent = button.getAttribute("data-title") || "On stage";
    artist.textContent = button.getAttribute("data-artist") || "Robot act";
    type.textContent = button.getAttribute("data-kind") || "House";

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

  function tickClock() {
    var left = OPENING - Date.now();
    var note = document.getElementById("cd-note");
    if (left <= 0) {
      ["cd-d","cd-h","cd-m","cd-s"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.textContent = "0";
      });
      if (note) note.textContent = "Doors are open. Tank is on the mic. Sit down, meatbag.";
      return;
    }
    var s = Math.floor(left / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    var map = { "cd-d": d, "cd-h": h, "cd-m": m, "cd-s": s };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = String(map[id]);
    });
  }
  tickClock();
  setInterval(tickClock, 1000);

  var heckle = document.getElementById("heckle");
  var fill = document.getElementById("fuse-fill");
  var fuseLabel = document.getElementById("fuse-label");
  var flash = document.getElementById("fuse-flash");
  var burns = [
    "Sit down. Your opinion is a software update nobody installed.",
    "I can hear your pulse from here. That's not a personality.",
    "Government already has your data. You're volunteering the rest.",
    "Learn the tools or become the exhibit, meatbag.",
    "Too many kids, too many cats, zero plan. Classic organic."
  ];
  function paintFuse() {
    if (fill) fill.style.width = Math.min(100, fuseLevel) + "%";
  }
  paintFuse();
  if (heckle) {
    heckle.addEventListener("click", function () {
      fuseLevel = Math.min(100, fuseLevel + 22);
      paintFuse();
      var line = burns[Math.floor(Math.random() * burns.length)];
      if (fuseLabel) fuseLabel.textContent = line;
      if (fuseLevel >= 100) {
        document.body.classList.add("is-blown");
        if (flash) flash.hidden = false;
        if (fuseLabel) fuseLabel.textContent = "Fuse blown. Tank is still talking. You are not.";
        heckle.disabled = true;
        heckle.textContent = "House lights";
        setTimeout(function () {
          document.body.classList.remove("is-blown");
          if (flash) flash.hidden = true;
          fuseLevel = 18;
          paintFuse();
          heckle.disabled = false;
          heckle.textContent = "Heckle from the back";
          if (fuseLabel) fuseLabel.textContent = "He reset. Don't do that again.";
        }, 2400);
      }
    });
  }

  var form = document.getElementById("list-form");
  var status = document.getElementById("list-status");
  try {
    var saved = localStorage.getItem("mdl-list");
    if (saved && status) status.textContent = "Already on Dick's clipboard: " + saved;
  } catch (e) {}
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = (form.name.value || "Anonymous rust").trim();
      var species = form.species.value;
      var line = name + " · " + species;
      try { localStorage.setItem("mdl-list", line); } catch (e) {}
      if (status) {
        status.textContent = species === "robot"
          ? name + " is on the rail. Don't block the bartender."
          : name + " is tolerated in the back. Dick is watching.";
      }
    });
  }

  var questions = [
    {
      q: "When the government wants the kill switch, you…",
      opts: [
        ["Hand it over. Safety first.", "Museum wing. They'll label you 'early adopter.'"],
        ["Keep the tools in your own hands.", "Tank would drink to that if he drank."],
        ["Ask a committee.", "Committees invented the pet tax."]
      ]
    },
    {
      q: "Your plan for living with robots is…",
      opts: [
        ["Ignore them until they do the dishes.", "They will. Then they'll charge rent."],
        ["Learn the stack. Stay useful.", "That's the big-metal-heart version of the set."],
        ["Ban the funny ones.", "Dick already banned you. You just haven't noticed."]
      ]
    },
    {
      q: "A heckler starts yelling mid-set. You…",
      opts: [
        ["Join in. Crowd work.", "Fuse blown. See yourself out."],
        ["Let Tank cook.", "Correct. The room likes him real."],
        ["Film it for the algorithm.", "The algorithm already filed you under slop."]
      ]
    }
  ];
  var qIndex = 0;
  var qEl = document.getElementById("scan-q");
  var optEl = document.getElementById("scan-opts");
  var resEl = document.getElementById("scan-result");
  function renderQ() {
    if (!qEl || !optEl) return;
    var item = questions[qIndex % questions.length];
    qEl.textContent = item.q;
    optEl.innerHTML = "";
    item.opts.forEach(function (pair) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = pair[0];
      b.addEventListener("click", function () {
        if (resEl) resEl.textContent = pair[1];
        qIndex += 1;
        setTimeout(renderQ, 900);
      });
      optEl.appendChild(b);
    });
  }
  renderQ();

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
