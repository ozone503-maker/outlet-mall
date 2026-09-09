var INLINE = {};
(function () {
  "use strict";

  /* Ten machines. `g` is the glow colour pooling under each cabinet. */
  var CABS = [
    { f: "cab01", n: "01", g: "#3DD68C" },
    { f: "cab02", n: "02", g: "#22D3EE" },
    { f: "cab03", n: "03", g: "#C8FF3D" },
    { f: "cab04", n: "04", g: "#FF2D6F" },
    { f: "cab05", n: "05", g: "#FF8A1A" },
    { f: "cab06", n: "06", g: "#FF6A1A" },
    { f: "cab07", n: "07", g: "#4FD1E0" },
    { f: "cab08", n: "08", g: "#B57BFF" },
    { f: "cab09", n: "09", g: "#FFB020" }
  ];

  function src(f) { return "/outletmall/units/arcade/assets/" + f; }

  /* Phones cap how many videos decode at once. Keep the nearest few running
     and pause the rest, so ten on screen never becomes ten decoding. */
  var MAX_LIVE = (function () {
    var w = Math.max(screen.width, screen.height);
    return w < 900 ? 4 : 10;
  })();
  var live = [];

  function claim(rec) {
    if (live.indexOf(rec) !== -1) return;
    live.push(rec);
    while (live.length > MAX_LIVE) {
      var old = live.shift();
      if (old !== rec) old.v.pause();
    }
  }

  function cabinet(c) {
    var el = document.createElement("div");
    el.className = "cab";

    var glow = document.createElement("span");
    glow.className = "cab__glow"; glow.style.setProperty("--g", c.g);

    var w = document.createElement("div"); w.className = "mov";
    var p = document.createElement("img");
    p.className = "poster"; p.alt = ""; p.src = src(c.f + ".jpg");
    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.loop = true;
    v.autoplay = true; v.playsInline = true; v.controls = false;
    ["muted", "autoplay", "loop", "playsinline", "webkit-playsinline"]
      .forEach(function (a) { v.setAttribute(a, ""); });
    v.preload = "auto"; v.poster = src(c.f + ".jpg"); v.src = src(c.f + ".mp4");
    w.appendChild(p); w.appendChild(v);

    var no = document.createElement("span");
    no.className = "cab__no"; no.textContent = c.n;

    var step = document.createElement("span");
    step.className = "cab__step"; step.textContent = "Step up";
    el.appendChild(glow); el.appendChild(w); el.appendChild(no); el.appendChild(step);
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.dataset.idx = String(CABS.indexOf(c));

    var rec = { v: v };
    function go() {
      claim(rec);
      var pr = v.play();
      if (pr && pr.then) pr.then(function () { v.classList.add("on"); })
                           .catch(function () {});
      else v.classList.add("on");
    }
    ["loadeddata", "canplay", "playing"].forEach(function (ev) {
      v.addEventListener(ev, function () { v.classList.add("on"); });
    });
    v.load();

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) go();
          else { v.pause(); live = live.filter(function (r) { return r !== rec; }); }
        });
      }, { threshold: 0.15 }).observe(el);
    } else { go(); }

    rec.go = go;
    return { el: el, go: go };
  }

  /* room panels — our own footage, no credit chip */
  function roomPanel(id, base, alt) {
    var host = document.getElementById(id);
    if (!host) return null;
    var w = document.createElement("div"); w.className = "mov";
    var p = document.createElement("img");
    p.className = "poster"; p.alt = alt || ""; p.src = src(base + "-poster.jpg");
    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.loop = true;
    v.autoplay = true; v.playsInline = true; v.controls = false;
    ["muted","autoplay","loop","playsinline","webkit-playsinline"]
      .forEach(function (a) { v.setAttribute(a, ""); });
    v.preload = "auto"; v.poster = src(base + "-poster.jpg");
    v.src = src(base + ".mp4");
    w.appendChild(p); w.appendChild(v);
    host.insertBefore(w, host.firstChild);
    function go() {
      var pr = v.play();
      if (pr && pr.then) pr.then(function () { v.classList.add("on"); }).catch(function () {});
      else v.classList.add("on");
    }
    ["loadeddata","canplay","playing"].forEach(function (ev) {
      v.addEventListener(ev, function () { v.classList.add("on"); go(); });
    });
    v.load();
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { if (window.__arcadeOn) go(); } else v.pause();
        });
      }, { threshold: 0.15 }).observe(host);
    }
    return go;
  }

  var roomGos = [
    roomPanel("approach", "approach", "The arcade entrance from the mall"),
    roomPanel("aisle", "aisle", "Looking down the aisle"),
    roomPanel("pinball", "pinball", "Pinball row"),
    roomPanel("claw", "claw", "The Fruity Puppy claw machine"),
    roomPanel("walk", "walk", "Walking the back wall")
  ].filter(Boolean);

  /* the grab, standing on its own */
  var gm = document.getElementById("grab-mov");
  if (gm) {
    var gw = document.createElement("div"); gw.className = "mov";
    var gp = document.createElement("img");
    gp.className = "poster"; gp.alt = "The claw lifting a jar";
    gp.src = src("grab-poster.jpg");
    var gv = document.createElement("video");
    gv.muted = true; gv.defaultMuted = true; gv.loop = true;
    gv.autoplay = true; gv.playsInline = true;
    ["muted","autoplay","loop","playsinline","webkit-playsinline"]
      .forEach(function (a) { gv.setAttribute(a, ""); });
    gv.preload = "auto"; gv.poster = src("grab-poster.jpg");
    gv.src = src("grab.mp4");
    gw.appendChild(gp); gw.appendChild(gv); gm.appendChild(gw);
    var ggo = function () {
      var pr = gv.play();
      if (pr && pr.then) pr.then(function () { gv.classList.add("on"); }).catch(function () {});
      else gv.classList.add("on");
    };
    ["loadeddata","canplay","playing"].forEach(function (ev) {
      gv.addEventListener(ev, function () { gv.classList.add("on"); ggo(); });
    });
    gv.load();
    roomGos.push(ggo);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? ggo() : gv.pause(); });
      }, { threshold: 0.15 }).observe(gw);
    }
  }

  /* characters on the floor */
  var PLAYERS = [{ f: "play01" }, { f: "play02" }, { f: "play03" }];
  var pl = document.getElementById("players");
  if (pl) PLAYERS.forEach(function (p) {
    var fig = document.createElement("figure");
    fig.className = "player"; fig.style.margin = "0";
    var w = document.createElement("div"); w.className = "mov";
    var po = document.createElement("img");
    po.className = "poster"; po.alt = ""; po.src = src(p.f + "-poster.jpg");
    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.loop = true;
    v.autoplay = true; v.playsInline = true;
    ["muted","autoplay","loop","playsinline","webkit-playsinline"]
      .forEach(function (a) { v.setAttribute(a, ""); });
    v.preload = "auto"; v.poster = src(p.f + "-poster.jpg"); v.src = src(p.f + ".mp4");
    w.appendChild(po); w.appendChild(v);
    fig.appendChild(w); pl.appendChild(fig);

    function go() {
      var pr = v.play();
      if (pr && pr.then) pr.then(function () { v.classList.add("on"); }).catch(function () {});
      else v.classList.add("on");
    }
    ["loadeddata","canplay","playing"].forEach(function (ev) {
      v.addEventListener(ev, function () { v.classList.add("on"); go(); });
    });
    v.load();
    roomGos.push(go);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? go() : v.pause(); });
      }, { threshold: 0.15 }).observe(fig);
    }
  });

  /* machine 11 — the one with sound */
  var pm = document.getElementById("punchout-mov");
  if (pm) {
    var pw = document.createElement("div"); pw.className = "mov";
    var pp = document.createElement("img");
    pp.className = "poster"; pp.alt = "Punch-Out cabinet";
    pp.src = src("punchout-poster.jpg");
    var pv = document.createElement("video");
    pv.loop = true; pv.playsInline = true; pv.muted = true; pv.defaultMuted = true;
    pv.autoplay = true; pv.setAttribute("autoplay", "");
    ["loop","playsinline","webkit-playsinline","muted"]
      .forEach(function (a) { pv.setAttribute(a, ""); });
    pv.preload = "auto"; pv.poster = src("punchout-poster.jpg");
    pv.src = src("punchout.mp4");
    pw.appendChild(pp); pw.appendChild(pv); pm.appendChild(pw);
    var pgo = function () {
      var pr = pv.play();
      if (pr && pr.then) pr.then(function () { pv.classList.add("on"); }).catch(function () {});
      else pv.classList.add("on");
    };
    ["loadeddata","canplay","playing"].forEach(function (ev) {
      pv.addEventListener(ev, function () { pv.classList.add("on"); });
    });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { if (entered) pgo(); }
          else pv.pause();
        });
      }, { threshold: 0.25 }).observe(pw);
    }
    roomGos.push(function () { if (entered) pgo(); });
  }

  var wall = document.getElementById("wall");
  var all = [];
  if (wall) CABS.forEach(function (c) {
    var made = cabinet(c);
    wall.appendChild(made.el);
    all.push(made.go);
  });

  /* ---------- the aisle carousel ---------- */
  (function () {
    var track = document.getElementById("wall");
    if (!track) return;
    var dots  = document.getElementById("rail-dots");
    var prev  = document.getElementById("rail-prev");
    var next  = document.getElementById("rail-next");
    var count = document.getElementById("rail-count");
    var items = Array.prototype.slice.call(track.children);
    if (count) count.textContent = items.length + " machines";

    items.forEach(function (_, i) {
      if (!dots) return;
      var d = document.createElement("i");
      d.addEventListener("click", function () { scrollTo(i); });
      dots.appendChild(d);
    });

    function nearest() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = 1e9;
      items.forEach(function (el, i) {
        var c = el.offsetLeft + el.offsetWidth / 2, d = Math.abs(c - mid);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }
    function paint() {
      if (!dots) return;
      var n = nearest();
      Array.prototype.forEach.call(dots.children, function (d, i) {
        d.classList.toggle("on", i === n);
      });
    }
    function scrollTo(i) {
      i = Math.max(0, Math.min(items.length - 1, i));
      var el = items[i];
      track.scrollTo({
        left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2,
        behavior: "smooth"
      });
    }
    if (prev) prev.addEventListener("click", function () { scrollTo(nearest() - 1); });
    if (next) next.addEventListener("click", function () { scrollTo(nearest() + 1); });

    var raf = false;
    track.addEventListener("scroll", function () {
      if (raf) return; raf = true;
      requestAnimationFrame(function () { paint(); raf = false; });
    }, { passive: true });

    /* drag with a mouse the way you'd drag on a phone */
    var down = false, x0 = 0, s0 = 0, moved = 0;
    track.addEventListener("mousedown", function (e) {
      down = true; x0 = e.pageX; s0 = track.scrollLeft; moved = 0;
      track.classList.add("dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!down) return;
      e.preventDefault();
      moved = Math.abs(e.pageX - x0);
      track.scrollLeft = s0 - (e.pageX - x0);
    });
    window.addEventListener("mouseup", function () {
      if (!down) return;
      down = false; track.classList.remove("dragging");
      scrollTo(nearest());
    });
    track.addEventListener("click", function (e) {
      if (moved > 8) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    paint();

    /* ---------- step up to a machine ---------- */
    var focus = document.getElementById("focus");
    var stage = document.getElementById("focus-stage");
    var fx    = document.getElementById("focus-x");
    var fprev = document.getElementById("focus-prev");
    var fnext = document.getElementById("focus-next");
    var fno   = document.getElementById("focus-no");
    if (!focus || !stage) return;

    var openIdx = -1, home = null, node = null;

    function show(i) {
      i = (i + items.length) % items.length;
      restore();
      openIdx = i;
      var cab = items[i];
      node = cab.querySelector(".mov");
      home = cab;
      stage.insertBefore(node, stage.firstChild);
      if (fno) fno.textContent = "Machine " + String(i + 1).padStart(2, "0");
      focus.classList.add("is-open");
      document.body.style.overflow = "hidden";
      var v = node.querySelector("video");
      if (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    }
    function restore() {
      if (node && home) { home.insertBefore(node, home.querySelector(".cab__no")); }
      node = null; home = null;
    }
    function close() {
      restore();
      focus.classList.remove("is-open");
      document.body.style.overflow = "";
      openIdx = -1;
    }

    items.forEach(function (el, i) {
      el.addEventListener("click", function () { if (moved <= 8) show(i); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(i); }
      });
    });
    if (fx) fx.addEventListener("click", close);
    if (fprev) fprev.addEventListener("click", function () { show(openIdx - 1); });
    if (fnext) fnext.addEventListener("click", function () { show(openIdx + 1); });
    focus.addEventListener("click", function (e) { if (e.target === focus) close(); });
    window.addEventListener("keydown", function (e) {
      if (openIdx < 0) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(openIdx + 1);
      if (e.key === "ArrowLeft") show(openIdx - 1);
    });
  })();

  /* ---------- panels drift as you scroll ---------- */
  (function () {
    if (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
    if (!panels.length) return;
    var ticking = false;
    function drift() {
      var vh = window.innerHeight;
      panels.forEach(function (p) {
        var r = p.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var mid = (r.top + r.height / 2 - vh / 2) / vh;
        var m = p.querySelector(".mov");
        if (m) m.style.transform = "scale(1.06) translateY(" + (mid * -18).toFixed(1) + "px)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true; requestAnimationFrame(drift);
    }, { passive: true });
    drift();
  })();

  function kick() { all.concat(roomGos).forEach(function (g) { g(); }); }

  /* ---- two continuous audio loops: the room, and the Punch-Out cabinet ---- */
  var BEDS = [
    { el: document.getElementById("tone"), file: "roomtone.mp3",      level: 0.42 },
    { el: document.getElementById("game"), file: "punchout-audio.mp3", level: 0.55 }
  ].filter(function (b) { return b.el; });

  BEDS.forEach(function (b) {
    b.el.src = src(b.file);
    b.el.loop = true;
    b.el.volume = 0;
    b.el.load();
  });

  function fadeBeds(on, ms) {
    BEDS.forEach(function (b) {
      var from = b.el.volume, to = on ? b.level : 0, t0 = performance.now();
      (function step(now) {
        var k = Math.min(1, (now - t0) / ms);
        b.el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
        if (k < 1) requestAnimationFrame(step);
        else if (!on) b.el.pause();
      })(t0);
    });
  }

  var entered = false, muted = false;
  var gate  = document.getElementById("gate");
  var big   = document.getElementById("bigred");
  var snd   = document.getElementById("snd");
  var sndL  = document.getElementById("snd-label");

  function applySound() {
    if (muted) fadeBeds(false, 260);
    else {
      BEDS.forEach(function (b) {
        var p = b.el.play();
        if (p && p.catch) p.catch(function () {});
      });
      fadeBeds(true, 1100);
    }
    if (snd) {
      snd.classList.toggle("is-muted", muted);
      if (sndL) sndL.textContent = muted ? "Sound off" : "Sound on";
    }
  }

  function enter() {
    if (entered) return;
    entered = true; window.__arcadeOn = true;
    if (big) big.classList.add("is-on");
    applySound();
    kick();
    setTimeout(function () { if (gate) gate.classList.add("is-gone"); }, 420);
    if (snd) snd.classList.add("is-shown");
  }

  if (big) big.addEventListener("click", enter);
  if (gate) gate.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); }
  });
  if (snd) snd.addEventListener("click", function () { muted = !muted; applySound(); });

  var r = document.getElementById("rotate");
  if (r) {
    var x = document.getElementById("rotate-x");
    function hide() { r.style.display = "none"; }
    if (x) x.addEventListener("click", hide);
    setTimeout(hide, 9000);
    window.addEventListener("orientationchange", hide);
  }
})();
