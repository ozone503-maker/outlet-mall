var INLINE = {};
/* Unit 05 — the discount clothing store.
   Photography carries the room. This file supplies content data, the shot
   placeholders, and the one interaction: the fitting room doors.

   Every image is declared once in SHOTS. Drop the file into assets/ with the
   matching name and the placeholder disappears — no other change needed. */
(function () {
  "use strict";

  var SIGN = { name: "The Rack", line:
    "Four racks, no order to any of it. Six fitting rooms, five that latch." };

  var DIR = "/units/fitting-room/assets/";
  
  /* filename : [role, aspect] — matches SHOTS.md */
  var SHOTS = {
    "storefront.jpg":      ["The entrance, from the mall hallway", "9:16 · 4:5"],
    "hero-floor.jpg":      ["Interior, entering the store", "3:4 · 16:9"],
    "rack-01.jpg":         ["Full rack, three-quarter",     "4:5"],
    "rack-02.jpg":         ["Second rack, colour variety",  "4:5"],
    "rack-03.jpg":         ["Outerwear rail",               "4:5"],
    "table-folded.jpg":    ["Folded stacks on a table",     "4:5"],
    "aisle-depth.jpg":     ["Second angle, depth",          "4:5"],
    "detail-fabric.jpg":   ["Fabric close-up",              "1:1"],
    "detail-tag.jpg":      ["Price tag macro",              "1:1"],
    "rooms-doors.jpg":     ["Bank of fitting room doors",   "4:5 · 16:9"],
    "rooms-inside.jpg":    ["Empty stall, mirror and bench","4:5 · 16:9"],
    "desk-attendant.jpg":  ["Attendant at the service desk","4:5"]
  };

  function shot(file, cls) {
    var meta = SHOTS[file] || ["Shot", ""];
    var d = document.createElement("div");
    d.className = "shot" + (cls ? " " + cls : "");
    var img = document.createElement("img");
    img.alt = meta[0];
    img.loading = file === "storefront.jpg" ? "eager" : "lazy";
    img.decoding = "async";
    var ph = document.createElement("div");
    ph.className = "shot__ph";
    ph.innerHTML = "<b>" + meta[0] + "</b><span>" + file + " &middot; " + meta[1] + "</span>";
    img.addEventListener("load", function () { ph.remove(); });
    img.addEventListener("error", function () { img.remove(); });
    img.src = DIR + file;
    d.appendChild(img); d.appendChild(ph);
    return d;
  }

  var RAILS = [
    { file: "rack-01.jpg",      name: "Men's shirts",  was: "38.00", now: "12.99" },
    { file: "rack-02.jpg",      name: "Loud shirts",   was: "44.00", now: "9.99"  },
    { file: "rack-03.jpg",      name: "Outerwear",     was: "89.00", now: "34.99" },
    { file: "table-folded.jpg", name: "Folded tees",   was: "22.00", now: "5.99"  },
    { file: "aisle-depth.jpg",  name: "Everything else", was: "—",   now: "Dig"   }
  ];

  var ROOMS = [
    { no: "1", state: "Open",   say: "Empty. Someone left a hanger on the hook." },
    { no: "2", state: "Open",   say: "Mirror's angled wrong. Everyone looks shorter in room 2." },
    { no: "3", state: "In use", say: "Pile of shirts on the bench and nobody in sight." },
    { no: "4", state: "Open",   say: "Bench, hook, mirror. The light hums." },
    { no: "5", state: "Broken", say: "Door won't latch. It's been like that a while." }
  ];

  /* ---- hero ---- */
  var app = document.getElementById("approach");
  if (app) {
    app.insertBefore(shot("storefront.jpg"), app.firstChild);
    var an = document.getElementById("approach-name");
    if (an) an.textContent = SIGN.name;
  }
  var hero = document.getElementById("hero");
  if (hero) hero.insertBefore(shot("hero-floor.jpg"), hero.firstChild);
  var lede = document.getElementById("lede");
  if (lede) lede.textContent = SIGN.line;

  /* ---- abundance strip ---- */
  var strip = document.getElementById("strip");
  if (strip) {
    RAILS.forEach(function (r) {
      var c = document.createElement("figure");
      c.className = "cell"; c.style.margin = "0";
      c.appendChild(shot(r.file));
      var m = document.createElement("figcaption");
      m.className = "cell__meta";
      m.innerHTML = "<b>" + r.name + "</b><span>" +
        (r.was === "—" ? "" : "Comp. " + r.was + " &nbsp;") +
        '<span class="now">' + r.now + "</span></span>";
      c.appendChild(m);
      strip.appendChild(c);
    });
  }

  /* ---- detail pair ---- */
  var pair = document.getElementById("pair");
  if (pair) {
    [["detail-fabric.jpg", "The material is the whole argument."],
     ["detail-tag.jpg",    "Tags are usually missing."]].forEach(function (p) {
      var f = document.createElement("figure");
      f.style.margin = "0";
      f.appendChild(shot(p[0]));
      var cap = document.createElement("figcaption");
      cap.textContent = p[1];
      f.appendChild(cap);
      pair.appendChild(f);
    });
  }

  /* ---- fitting rooms ---- */
  var stage  = document.getElementById("rooms-stage");
  var inside = document.getElementById("rooms-inside");
  var pick   = document.getElementById("rooms-pick");
  var say    = document.getElementById("rooms-say");

  if (stage) stage.insertBefore(shot("rooms-doors.jpg"), stage.firstChild);
  if (inside) inside.appendChild(shot("rooms-inside.jpg"));

  if (pick) {
    ROOMS.forEach(function (r) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = "<b>" + r.no + "</b><small>" + r.state + "</small>";
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") === "true";
        pick.querySelectorAll("button").forEach(function (o) {
          o.setAttribute("aria-pressed", "false");
        });
        b.setAttribute("aria-pressed", on ? "false" : "true");
        if (inside) inside.classList.toggle("is-on", !on);
        if (say) say.textContent = on ? "Pick a room." : r.say;
      });
      pick.appendChild(b);
    });
  }

  /* ---- desk ---- */
  var desk = document.getElementById("desk-shot");
  if (desk) desk.appendChild(shot("desk-attendant.jpg"));
})();
