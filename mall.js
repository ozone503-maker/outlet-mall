/* Fruity Puppy Outlet Mall — shared behavior.
   Loaded by every unit and hall. Keep unit-specific logic in the unit's own JS. */

(function () {
  // Outbound links always open in a new tab. The mall stays where you left it.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href^='http']");
    if (!a) return;
    if (a.hostname === location.hostname) return;
    a.target = "_blank";
    a.rel = "noopener";
  });
})();

(function () {
  // Branded store subdomains (e.g. skincare.outletmall.space) serve one store at "/".
  // Hallway, Back, Previous/Next and other-store links go to the main mall host.
  var h = location.hostname;
  var MALL = "outletmall.space";
  if (h === MALL || h === "www." + MALL || h.slice(-(MALL.length + 1)) !== "." + MALL) return;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.hostname !== h || a.target === "_blank") return;
    var p = a.pathname;
    if (p === "/" || p.indexOf("/units/") === 0 || p.indexOf("/meadows/") === 0) {
      e.preventDefault();
      location.href = "https://" + MALL + p + a.search + a.hash;
    }
  });
})();
