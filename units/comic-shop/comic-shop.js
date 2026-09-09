var INLINE = {};
(function () {
  "use strict";

  var FEED = [
    { n: "Webtoon Canvas",  d: "Self-published serials, updated daily",
      t: "Free",    u: "https://www.webtoons.com/en/canvas" },
    { n: "Tapas",           d: "Indie comics, weekly episodes",
      t: "Free",    u: "https://tapas.io/comics" },
    { n: "GoComics",        d: "Newspaper strips, new every morning",
      t: "Daily",   u: "https://www.gocomics.com/" },
    { n: "Marvel free issues", d: "Rotating first issues",
      t: "Sampler", u: "https://www.marvel.com/comics/discover/584/free-digital-comics" },
    { n: "DC free reads",   d: "Rotating selection",
      t: "Sampler", u: "https://www.dc.com/comics" },
    { n: "SMBC",            d: "One-page strips, updated daily",
      t: "Free",    u: "https://www.smbc-comics.com/" }
  ];

  var BINS = [
    { tab: "A–F", n: "Comic Book Plus",     d: "Golden Age, indexed, reads in browser",
      u: "https://comicbookplus.com/" },
    { tab: "G–M", n: "Digital Comic Museum", d: "Pre-1959 scans, downloadable",
      u: "https://digitalcomicmuseum.com/" },
    { tab: "N–S", n: "Internet Archive",     d: "Deep, messy, enormous",
      u: "https://archive.org/details/comics" },
    { tab: "T–Z", n: "Grand Comics Database",d: "Look up any issue ever printed",
      u: "https://www.comics.org/" }
  ];

  function shot(file, alt, eager) {
    var d = document.createElement("div"); d.className = "shot";
    var i = document.createElement("img");
    i.alt = alt || ""; i.loading = eager ? "eager" : "lazy"; i.decoding = "async";
    i.src = "/outletmall/units/comic-shop/assets/" + file;
    d.appendChild(i); return d;
  }

  var ap = document.getElementById("approach");
  if (ap) ap.insertBefore(shot("storefront.jpg","Storefront from the mall",1), ap.firstChild);
  var ins = document.getElementById("inside");
  if (ins) ins.insertBefore(shot("interior.jpg","Walking into the shop"), ins.firstChild);

  var ws = document.getElementById("wall-shot");
  if (ws) ws.appendChild(shot("wall-new.jpg","Wall of new issues"));

  var feed = document.getElementById("feed");
  if (feed) FEED.slice(0, 4).forEach(function (f) {
    var a = document.createElement("a");
    a.className = "feed__row"; a.href = f.u; a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = "<em>" + f.t + "</em><b>" + f.n + "</b><span>" + f.d + "</span>";
    feed.appendChild(a);
  });

  /* ---- spinner rack: the sources, on a rack you can turn ---- */
  var bg = document.getElementById("rack-bg");
  if (bg) bg.appendChild(shot("room-wide.jpg", ""));

  var spin = document.getElementById("spin");
  var now  = document.getElementById("spinnow");
  if (spin) {
    var N = FEED.length, STEP = 360 / N, R = 152, deg = 0, cards = [];

    FEED.forEach(function (f, i) {
      var a = document.createElement("a");
      a.className = "card";
      a.href = f.u; a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = '<span class="card__tag">' + f.t + "</span>" +
                    '<span class="card__name">' + f.n + "</span>" +
                    '<span class="card__rule"></span>' +
                    '<span class="card__desc">' + f.d + "</span>";
      spin.appendChild(a); cards.push(a);
    });

    function dress() {
      cards.forEach(function (a, i) {
        var off = (i * STEP + deg) % 360;
        if (off > 180) off -= 360;
        if (off < -180) off += 360;
        var near = Math.max(0, Math.cos(off * Math.PI / 180));
        var s = 1 + 0.24 * Math.pow(near, 3);
        var lift = -12 * Math.pow(near, 3);
        a.style.transform = "rotateY(" + (i * STEP) + "deg) translateZ(" + R + "px) " +
          "translateY(" + lift + "px) scale(" + s.toFixed(3) + ")";
        a.style.opacity = (0.5 + 0.5 * near).toFixed(3);
        a.style.boxShadow = near > 0.9
          ? "0 20px 38px rgba(0,0,0,.7)" : "0 12px 26px rgba(0,0,0,.55)";
        a.style.zIndex = Math.round(near * 10);
      });
    }
    function face() {
      if (!now) return;
      var i = ((Math.round(-deg / STEP) % N) + N) % N, f = FEED[i];
      now.innerHTML = 'Front of rack: <a href="' + f.u +
        '" target="_blank" rel="noopener">' + f.n + "</a>";
    }
    function set(d) { deg = d; spin.style.setProperty("--deg", deg + "deg"); dress(); face(); }

    var bL = document.getElementById("spinL"), bR = document.getElementById("spinR");
    if (bL) bL.onclick = function () { set(deg + STEP); };
    if (bR) bR.onclick = function () { set(deg - STEP); };

    var down = false, x0 = 0, d0 = 0, moved = 0;
    function st(x) { down = true; x0 = x; d0 = deg; moved = 0; spin.classList.add("dragging"); }
    function mv(x) { if (!down) return; moved = Math.abs(x - x0); set(d0 + (x - x0) * 0.45); }
    function en() { if (!down) return; down = false; spin.classList.remove("dragging");
      set(Math.round(deg / STEP) * STEP); }
    spin.addEventListener("mousedown", function (e) { e.preventDefault(); st(e.clientX); });
    window.addEventListener("mousemove", function (e) { mv(e.clientX); });
    window.addEventListener("mouseup", en);
    spin.addEventListener("click", function (e) { if (moved > 6) e.preventDefault(); });
    spin.addEventListener("touchstart", function (e) { st(e.touches[0].clientX); }, { passive: true });
    spin.addEventListener("touchmove", function (e) { mv(e.touches[0].clientX); }, { passive: true });
    spin.addEventListener("touchend", en);
    set(0);
  }

  var pair = document.getElementById("pair");
  if (pair) [["case-figures.jpg","Behind glass, priced accordingly."],
             ["shelf-detail.jpg","Trades and collected editions, one shelf."]]
    .forEach(function (p) {
      var f = document.createElement("figure"); f.style.margin = "0";
      f.appendChild(shot(p[0], p[1]));
      var c = document.createElement("figcaption"); c.textContent = p[1];
      f.appendChild(c); pair.appendChild(f);
    });

  var bs = document.getElementById("bin-shot");
  if (bs) bs.appendChild(shot("longboxes.jpg","Long boxes under the wall"));

  var bins = document.getElementById("bins");
  if (bins) BINS.forEach(function (b) {
    var a = document.createElement("a");
    a.className = "bin"; a.href = b.u; a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = "<em>" + b.tab + "</em><b>" + b.n + "</b><span>" + b.d + "</span>";
    bins.appendChild(a);
  });

  var ds = document.getElementById("dru-shot");
  if (ds) ds.appendChild(shot("dru.jpg","Dru behind the counter"));
})();
