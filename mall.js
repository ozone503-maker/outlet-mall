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
