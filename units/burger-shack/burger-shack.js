var INLINE = {};
(function () {
  "use strict";

  /* Jimmy's arc lives here. Edit as the series moves. */
  var GOAL = {
    label: "jars sold toward quitting",
    now: 214,
    target: 1200,
    note: "Updated after each episode"
  };

  var EPISODES = [
    { n: "01", t: "The first jar",
      d: "Ipo comes through during a lunch rush and hands him something.",
      clip: "pitch01", live: true },
    { n: "02", t: "Telling his manager",
      d: "It goes about as well as you'd expect.", live: false },
    { n: "03", t: "The first sale",
      d: "A regular buys one. Jimmy does not handle it smoothly.", live: false },
    { n: "04", t: "Doing the math",
      d: "How many jars is one shift worth, exactly.", live: false }
  ];

  var MENU = [
    { n: "Single",        d: "",                p: "4.19" },
    { n: "Double",        d: "",                p: "5.79" },
    { n: "Shack basket",  d: "4 pc, fries",     p: "6.49" },
    { n: "Fries",         d: "",                p: "2.39" },
    { n: "Shake",         d: "Machine's fine",  p: "3.79" }
  ];

  var PARTNER_NOTE =
    "Results depend on the work you put in. Nothing here is a promise of income.";

  function src(f) { return "/outletmall/units/burger-shack/assets/" + f; }

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
    v.src = src(base + ".mp4");
    w.appendChild(p); w.appendChild(v);

    var seen = false;
    function go() {
      var pr = v.play();
      if (pr && pr.then) pr.then(function () { v.classList.add("on"); }).catch(function () {});
      else v.classList.add("on");
    }
    ["loadeddata", "canplay", "canplaythrough", "playing"].forEach(function (ev) {
      v.addEventListener(ev, function () { v.classList.add("on"); go(); });
    });
    v.load(); setTimeout(go, 350);
    players.push(go);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { seen = true; go(); } else if (seen) v.pause();
        });
      }, { threshold: 0.1 }).observe(w);
    } else { go(); }
    return w;
  }
  function kick() { players.forEach(function (g) { g(); }); }
  ["touchstart", "click", "scroll"].forEach(function (ev) {
    window.addEventListener(ev, kick, { passive: true });
  });

  /* build */
  var ap = document.getElementById("approach");
  if (ap) ap.insertBefore(mov("approach", "Burger Shack from the food court"), ap.firstChild);

  var jm = document.getElementById("jimmy-mov");
  if (jm) jm.appendChild(mov("pitch01", "Jimmy behind the counter"));

  var gm = document.getElementById("gang-mov");
  if (gm) gm.appendChild(mov("gang", "Three men reading a flyer at a food court table"));

  var sm = document.getElementById("softserve-mov");
  if (sm) sm.appendChild(mov("softserve", "The soft serve machine"));

  var fill = document.getElementById("goal-fill"),
      now  = document.getElementById("goal-now"),
      of_  = document.getElementById("goal-of"),
      note = document.getElementById("goal-note");
  if (fill) {
    var pct = Math.max(0, Math.min(100, GOAL.now / GOAL.target * 100));
    setTimeout(function () { fill.style.width = pct.toFixed(1) + "%"; }, 150);
    now.textContent = GOAL.now.toLocaleString("en-US");
    of_.textContent = "of " + GOAL.target.toLocaleString("en-US") + " " + GOAL.label;
    note.textContent = GOAL.note;
  }

  var eps = document.getElementById("eps");
  if (eps) EPISODES.forEach(function (e) {
    var el = document.createElement("article");
    el.className = "ep" + (e.live ? "" : " ep--soon");
    if (e.live && e.clip) el.appendChild(mov(e.clip, e.t));
    else {
      var s = document.createElement("div");
      s.className = "ep__slate"; s.textContent = "Not shot yet";
      el.appendChild(s);
    }
    var m = document.createElement("div");
    m.className = "ep__meta";
    m.innerHTML = "<em>Episode " + e.n + "</em><b>" + e.t + "</b><span>" + e.d + "</span>";
    el.appendChild(m); eps.appendChild(el);
  });

  var pn = document.getElementById("partner-note");
  if (pn) pn.textContent = PARTNER_NOTE;

  var m = document.getElementById("menu");
  if (m) {
    var ul = document.createElement("ul");
    MENU.forEach(function (it) {
      var li = document.createElement("li");
      li.innerHTML = "<b>" + it.n + "</b><i>" + it.d + "</i><span>" + it.p + "</span>";
      ul.appendChild(li);
    });
    m.appendChild(ul);
  }

  var pair = document.getElementById("pair");
  if (pair) [["counter.jpg",   "The counter, from the customer side."],
             ["jar.jpg",       "He keeps them behind the register."],
             ["gangface.jpg",  "One of them had questions."],
             ["dream.jpg",     "It is a very specific daydream."]]
    .forEach(function (p) {
      var f = document.createElement("figure"); f.style.margin = "0";
      f.appendChild(shot(p[0], p[1]));
      var c = document.createElement("figcaption"); c.textContent = p[1];
      f.appendChild(c); pair.appendChild(f);
    });

  var r = document.getElementById("rotate");
  if (r) {
    var x = document.getElementById("rotate-x");
    function hide() { r.style.display = "none"; }
    if (x) x.addEventListener("click", hide);
    setTimeout(hide, 9000);
    window.addEventListener("orientationchange", hide);
  }
})();
