/* Fruity Puppy Outlet Mall — video governor.

   The fish store has two videos and plays perfectly. The arcade asks for
   twenty at once and a phone simply refuses to hand out that many hardware
   decoders, so every clip freezes on its first frame.

   This caps how many videos are allowed to run at the same time. The ones
   nearest the middle of the screen get the decoders; everything else is
   paused and drops back to its poster image. Scroll, and the budget moves
   with you.

   The unit scripts keep their own logic — this only ever pauses what is far
   away and starts what is close. It never unmutes anything, so the audio
   beds are untouched.

   Load AFTER the unit script.
*/
(function () {
  "use strict";

  /* Small screens get a hard budget. Desktops can afford more. */
  var BUDGET = (function () {
    var w = Math.max(screen.width || 0, screen.height || 0);
    if (w < 900) return 2;
    if (w < 1400) return 4;
    return 8;
  })();

  var ticking = false;

  function centreDistance(v) {
    var r = v.getBoundingClientRect();
    if (!r.width || !r.height) return Infinity;
    var vh = window.innerHeight || 0;
    if (r.bottom < 0 || r.top > vh) return Infinity;     /* off screen */
    return Math.abs((r.top + r.bottom) / 2 - vh / 2);
  }

  function start(v) {
    if (!v.hasAttribute("playsinline")) v.setAttribute("playsinline", "");
    v.muted = true;
    v.defaultMuted = true;
    if (v.readyState >= 2) v.classList.add("on");
    if (!v.paused) return;
    var p = v.play();
    if (p && p.then) {
      p.then(function () { v.classList.add("on"); }).catch(function () {});
    } else {
      v.classList.add("on");
    }
  }

  function stop(v) {
    if (!v.paused) v.pause();
    /* fall back to the poster rather than sitting on a frozen frame */
    v.classList.remove("on");
  }

  function govern() {
    ticking = false;

    var vids = Array.prototype.slice.call(document.getElementsByTagName("video"));
    var ranked = vids
      .map(function (v) { return { v: v, d: centreDistance(v) }; })
      .filter(function (r) { return r.d !== Infinity; })
      .sort(function (a, b) { return a.d - b.d; });

    var keep = ranked.slice(0, BUDGET).map(function (r) { return r.v; });

    vids.forEach(function (v) {
      if (keep.indexOf(v) === -1) stop(v);
    });

    /* start the winners after the losers have released their decoders */
    setTimeout(function () { keep.forEach(start); }, 60);
  }

  function schedule() {
    if (ticking) return;
    ticking = true;
    if (window.requestAnimationFrame) requestAnimationFrame(govern);
    else setTimeout(govern, 100);
  }

  ["scroll", "resize", "orientationchange", "touchend", "click"]
    .forEach(function (ev) {
      window.addEventListener(ev, schedule, { passive: true });
    });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      var vids = document.getElementsByTagName("video");
      for (var i = 0; i < vids.length; i++) stop(vids[i]);
    } else {
      schedule();
    }
  });

  /* a slow heartbeat catches anything the unit script starts on its own */
  setInterval(schedule, 1500);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else {
    schedule();
  }

  window.__mallVideoBudget = BUDGET;
})();
