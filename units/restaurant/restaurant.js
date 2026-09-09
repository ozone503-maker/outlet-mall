var INLINE = {};
(function () {
  "use strict";

  var MENU = [
    { h: "Primi", n: "Before the plate", items: [
      { n: "Bread service",      d: "Rolls, sticks, garlic, oil",  p: "—"    },
      { n: "Minestrone",         d: "Cup or bowl",                 p: "6.50" },
      { n: "Antipasto",          d: "For the table",               p: "13.00"}
    ]},
    { h: "Pasta", n: "All served with bread", items: [
      { n: "Spaghetti al pomodoro", d: "The house plate",          p: "14.00"},
      { n: "Bolognese",          d: "Slow, since morning",         p: "17.50"},
      { n: "Baked ziti",         d: "Family style available",      p: "16.00"},
      { n: "Linguine vongole",   d: "When we have them",           p: "21.00"}
    ]},
    { h: "The rest", n: "", items: [
      { n: "Chicken parmigiana", d: "",                            p: "19.50"},
      { n: "Veal Milanese",      d: "",                            p: "24.00"},
      { n: "Tiramisu",           d: "Made here",                   p: "8.00" }
    ]}
  ];

  function shot(file, alt, eager) {
    var d = document.createElement("div"); d.className = "shot";
    var i = document.createElement("img");
    i.alt = alt || ""; i.loading = eager ? "eager" : "lazy"; i.decoding = "async";
    i.src = "/outletmall/units/restaurant/assets/" + file;
    d.appendChild(i); return d;
  }

  var a = document.getElementById("approach");
  if (a) a.insertBefore(shot("corridor.jpg", "The restaurant from the mall corridor", 1), a.firstChild);
  var dr = document.getElementById("doors");
  if (dr) dr.insertBefore(shot("doors.jpg", "At the entrance"), dr.firstChild);
  var ds = document.getElementById("dining-shot");
  if (ds) ds.appendChild(shot("dining.jpg", "Booths and banquettes"));
  var ts = document.getElementById("table-shot");
  if (ts) ts.appendChild(shot("longtable.jpg", "The long table in the back room"));

  var ws = document.getElementById("waiter-shot");
  if (ws) ws.appendChild(shot("waiter.jpg", "Staff photograph by the host stand"));
  var rs = document.getElementById("regulars-shot");
  if (rs) rs.appendChild(shot("regulars.jpg", "Regulars at their table"));

  var m = document.getElementById("menu");
  if (m) MENU.forEach(function (sec) {
    var h = document.createElement("h3"); h.textContent = sec.h; m.appendChild(h);
    if (sec.n) { var p = document.createElement("p"); p.textContent = sec.n; m.appendChild(p); }
    var ul = document.createElement("ul");
    sec.items.forEach(function (it) {
      var li = document.createElement("li");
      li.innerHTML = "<b>" + it.n + "</b><i>" + it.d + "</i><span>" + it.p + "</span>";
      ul.appendChild(li);
    });
    m.appendChild(ul);
  });

  var pair = document.getElementById("pair");
  if (pair) [["plate.jpg", "Spaghetti al pomodoro. The house plate."],
             ["bread.jpg", "Bread comes whether you want it or not."]]
    .forEach(function (p) {
      var f = document.createElement("figure"); f.style.margin = "0";
      f.appendChild(shot(p[0], p[1]));
      var c = document.createElement("figcaption"); c.textContent = p[1];
      f.appendChild(c); pair.appendChild(f);
    });
})();
