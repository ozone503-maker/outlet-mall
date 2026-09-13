/* Outlet Mall — store template (rename to <slug>.js) */
(function () {
  var UNIT_ID = 'REPLACE_WITH_SLUG'; // e.g. 'thorny-toad'

  // Optional: wire hallway prev/next if the page has #nav-prev / #nav-next
  function wireNav() {
    if (!window.mallNav || !window.mallNav.ready) return;
    window.mallNav.ready.then(function () {
      var prev = document.getElementById('nav-prev');
      var next = document.getElementById('nav-next');
      if (!prev && !next) return;
      var p = window.mallNav.getPrev(UNIT_ID);
      var n = window.mallNav.getNext(UNIT_ID);
      if (prev) {
        if (p) prev.href = p.path; else prev.style.display = 'none';
      }
      if (next) {
        if (n) next.href = n.path; else next.style.display = 'none';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireNav);
  } else {
    wireNav();
  }
})();
