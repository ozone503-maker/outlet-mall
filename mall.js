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

(function () {
  // Fallback Previous/Next for stores whose own JS doesn't wire them (links left at "#").
  var HOSTS = { fruitypuppy: "fruity-puppy-skincare", skincare: "fruity-puppy-skincare", merch: "fruity-puppy-merch",
    fpx: "fpx-boutique", spacefactory: "brobots-retail", multimedia: "brobots-multimedia", metaldicks: "metal-dicks-robot-lounge",
    thornytoad: "thorny-toad", lavaguava: "lava-guava", petersrocks: "peter-herres", badhabitats: "comic-shop",
    wetpets: "fish-store", shoestation: "shoe-store", kudoken: "meadows" };
  var m = location.pathname.match(/^\/units\/([^\/]+)\/?$/);
  var id = m ? m[1] : /^\/meadows\/?$/.test(location.pathname) ? "meadows" : HOSTS[location.hostname.split(".")[0]];
  if (!id) return;
  function wire() {
    if (!window.mallNav || !window.mallNav.ready) return;
    window.mallNav.ready.then(function () {
      [["nav-prev", "getPrev"], ["nav-next", "getNext"]].forEach(function (x) {
        var a = document.getElementById(x[0]);
        if (!a || a.getAttribute("href") !== "#") return;
        var u = window.mallNav[x[1]](id);
        if (u) a.href = u.path; else a.hidden = true;
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire); else wire();
})();
