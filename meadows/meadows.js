/* Kudoken Meadows — zone shell.
   Renders lots from data. Attractions are added to LOTS; the zone does not
   know or care what happens inside them. */
(function () {
  "use strict";

  var LOTS = [
    { id: "monkey-jockey", name: "Monkey Jockey", state: "soon",
      href: "/units/arcade/monkey-jockey/", ico: "flag",
      desc: "Brought to you by the Kudoken. The track is graded; the race is not running yet." },
    { id: "gift-shop", name: "Kudoken Gift Shop", state: "open",
      href: "/meadows/gift-shop/", ico: "shop",
      desc: "Spend arcade tickets. Shelves are still being stocked." },
    { id: "paddock", name: "The Paddock", state: "soon",
      href: "", ico: "paw",
      desc: "Where the dogs will be. Real names, real stories." },
    { id: "board", name: "Results Board", state: "soon",
      href: "", ico: "board",
      desc: "Race results and standings, once there are races." }
  ];

  var ICO = {
    flag:'<svg viewBox="0 0 40 40" fill="none" stroke="#C9A227" stroke-width="2"><path d="M10 36V5"/><path d="M10 7h22l-4 6 4 6H10z" fill="rgba(201,162,39,.2)"/></svg>',
    shop:'<svg viewBox="0 0 40 40" fill="none" stroke="#C9A227" stroke-width="2"><path d="M6 15h28v20H6z" fill="rgba(201,162,39,.15)"/><path d="M6 15l3-8h22l3 8"/><path d="M16 35V24h8v11"/></svg>',
    paw:'<svg viewBox="0 0 40 40" fill="none" stroke="#C9A227" stroke-width="2"><ellipse cx="20" cy="27" rx="9" ry="7" fill="rgba(201,162,39,.18)"/><ellipse cx="10" cy="16" rx="4" ry="5"/><ellipse cx="17" cy="11" rx="4" ry="5"/><ellipse cx="24" cy="11" rx="4" ry="5"/><ellipse cx="31" cy="16" rx="4" ry="5"/></svg>',
    board:'<svg viewBox="0 0 40 40" fill="none" stroke="#C9A227" stroke-width="2"><rect x="6" y="7" width="28" height="22" fill="rgba(201,162,39,.14)"/><path d="M11 14h18M11 19h18M11 24h11M14 29v6M26 29v6"/></svg>'
  };

  var wrap = document.getElementById("lots");
  if (wrap) {
    LOTS.forEach(function (l) {
      var open = l.state === "open" && l.href;
      var el = document.createElement(l.href ? "a" : "div");
      el.className = "lot lot--" + (open ? "open" : "soon");
      if (l.href) { el.href = l.href; }
      el.innerHTML =
        '<span class="lot__state">' + (open ? "Open" : "Coming soon") + '</span>' +
        '<span class="lot__ico">' + ICO[l.ico] + '</span>' +
        '<span class="lot__name">' + l.name + '</span>' +
        '<span class="lot__desc">' + l.desc + '</span>';
      wrap.appendChild(el);
    });
  }

  /* ticket strip — reads the mall economy, never writes to it */
  var b = document.getElementById("purse-bal");
  if (b && window.MallTickets) {
    var paint = function () { b.textContent = MallTickets.format(MallTickets.get()); };
    paint();
    MallTickets.onChange(paint);
  }
})();
