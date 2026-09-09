var INLINE = {};
(function () {
  "use strict";

  var CAMS = [
    { n: "Moon Jellies",    d: "Monterey Bay Aquarium",
      u: "https://www.montereybayaquarium.org/animals/live-cams/jelly-cam" },
    { n: "Kelp Forest",     d: "Monterey Bay Aquarium",
      u: "https://www.montereybayaquarium.org/animals/live-cams/kelp-forest-cam" },
    { n: "Sea Otters",      d: "Monterey Bay Aquarium",
      u: "https://www.montereybayaquarium.org/animals/live-cams/sea-otter-cam" },
    { n: "Open Sea",        d: "Monterey Bay Aquarium",
      u: "https://www.montereybayaquarium.org/animals/live-cams/open-sea-cam" },
    { n: "Alligators",      d: "St. Augustine, Florida",
      u: "https://explore.org/livecams/alligators/alligator-swamp-cam" },
    { n: "Coral Reef",      d: "Explore.org",
      u: "https://explore.org/livecams/oceans/pearl-reef-cam" }
  ];

  function src(f) { return "/outletmall/units/fish-store/assets/" + f; }

  function shot(file, alt, eager) {
    var d = document.createElement("div"); d.className = "shot";
    var i = document.createElement("img");
    i.alt = alt || ""; i.loading = eager ? "eager" : "lazy"; i.decoding = "async";
    i.src = src(file); d.appendChild(i); return d;
  }

  var players = [];

  function mov(base, alt) {
    var w = document.createElement("div"); w.className = "mov";
    var p = document.createElement("img");
    p.className = "poster"; p.alt = alt || ""; p.src = src(base + "-poster.jpg");

    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.loop = true;
    v.autoplay = true; v.playsInline = true; v.controls = false;
    ["muted", "autoplay", "loop", "playsinline", "webkit-playsinline"]
      .forEach(function (a) { v.setAttribute(a, ""); });
    v.preload = "auto";
    v.poster = src(base + "-poster.jpg");
    v.src = src(base + ".mp4");          // direct src, not a <source> child

    var t = document.createElement("span");
    t.className = "mov__tag";
    t.innerHTML = "<i></i>" + (base === "salmon-loop" ? "Security" : "Live tank");
    w.appendChild(p); w.appendChild(v); w.appendChild(t);

    var seen = false;
    function go() {
      var pr = v.play();
      if (pr && pr.then) pr.then(function () { v.classList.add("on"); })
                           .catch(function () {});
      else v.classList.add("on");
    }
    ["loadeddata", "canplay", "canplaythrough", "playing"].forEach(function (ev) {
      v.addEventListener(ev, function () { v.classList.add("on"); go(); });
    });
    v.load();
    setTimeout(go, 350);

    players.push({ v: v, w: w, go: go });

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { seen = true; go(); }
          else if (seen) v.pause();
        });
      }, { threshold: 0.1 }).observe(w);
    } else { go(); }
    return w;
  }

  // some phones only allow playback after the first touch — take the first one
  function kick() {
    players.forEach(function (p) { p.go(); });
    ["touchstart", "click", "scroll"].forEach(function (ev) {
      window.removeEventListener(ev, kick);
    });
  }
  ["touchstart", "click", "scroll"].forEach(function (ev) {
    window.addEventListener(ev, kick, { passive: true, once: false });
  });

  function bleed(el, file, alt, eager) {
    if (!el) return;
    var d = document.createElement("div"); d.className = "shot";
    var i = document.createElement("img");
    i.alt = alt || ""; i.loading = eager ? "eager" : "lazy"; i.decoding = "async";
    i.style.position = "absolute";
    i.src = src(file); d.appendChild(i);
    el.insertBefore(d, el.firstChild);
  }
  bleed(document.getElementById("approach"), "storefront.jpg",
        "Wet Pets from the mall corridor", 1);
  bleed(document.getElementById("entry"), "entrance.jpg", "Walking into the store");

  var tm = document.getElementById("tank-mov");
  if (tm) tm.appendChild(mov("tank", "Tank 4, running"));
  var pm = document.getElementById("piranha-mov");
  if (pm) pm.appendChild(mov("piranha", "The piranha tank"));
  var tp = document.getElementById("tunnel-panel");
  if (tp) tp.insertBefore(mov("tunnel", "The tunnel at the back of the store"), tp.firstChild);

  var ws = document.getElementById("wall-shot");
  if (ws) ws.appendChild(shot("tankwall.jpg", "The freshwater wall"));

  var pair = document.getElementById("pair");
  if (pair) [["specimen.jpg", "Tank 4, lights on."],
             ["seating.jpg",  "Two chairs, put there by somebody."],
             ["tankwall.jpg", "Freshwater, both sides."],
             ["salmon.jpg",   "He was here Tuesday as well."]]
    .forEach(function (p) {
      var f = document.createElement("figure"); f.style.margin = "0";
      f.appendChild(shot(p[0], p[1]));
      var c = document.createElement("figcaption"); c.textContent = p[1];
      f.appendChild(c); pair.appendChild(f);
    });

  var cams = document.getElementById("cams");
  if (cams) CAMS.forEach(function (c) {
    var el = document.createElement("a");
    el.className = "cam"; el.href = c.u; el.target = "_blank"; el.rel = "noopener";
    el.innerHTML = "<em>Live</em><b>" + c.n + "</b><span>" + c.d + "</span>";
    cams.appendChild(el);
  });

  var ss = document.getElementById("salmon-shot");
  if (ss) ss.appendChild(mov("salmon-loop", "Security footage, back of the store"));
})();

/* rotate nudge — portrait phones only, once */
(function () {
  var el = document.getElementById("rotate");
  if (!el) return;
  var x = document.getElementById("rotate-x");
  function hide() { el.style.display = "none"; }
  if (x) x.addEventListener("click", hide);
  setTimeout(hide, 9000);
  window.addEventListener("orientationchange", hide);
})();
