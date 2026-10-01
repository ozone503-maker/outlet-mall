/* Fruity Puppy Merch - tiny reveal enhancement; nav is inline in index.html */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var blocks = document.querySelectorAll('.block, .outbound');
    if (!('IntersectionObserver' in window) || !blocks.length) return;
    blocks.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    blocks.forEach(function (el) { io.observe(el); });
  });
})();
