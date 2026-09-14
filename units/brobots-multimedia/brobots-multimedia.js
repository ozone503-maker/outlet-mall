/* Brobots Space Factory Multimedia Studios */
(function () {
  "use strict";

  var UNIT_ID = "brobots-multimedia";
  var SOUND_KEY = "brobots-multimedia.sound";
  var AMBIENT_VOL = 0.38;
  var AMBIENT_DUCK = 0.06;

  function wireNav() {
    if (!window.mallNav || !window.mallNav.ready) return;
    window.mallNav.ready.then(function () {
      var prev = document.getElementById("nav-prev");
      var next = document.getElementById("nav-next");
      if (!prev && !next) return;
      var p = window.mallNav.getPrev(UNIT_ID);
      var n = window.mallNav.getNext(UNIT_ID);
      if (prev) {
        if (p) prev.href = p.path;
        else prev.style.display = "none";
      }
      if (next) {
        if (n) next.href = n.path;
        else next.style.display = "none";
      }
    });
  }

  function soundWanted() {
    try {
      return sessionStorage.getItem(SOUND_KEY) === "on";
    } catch (e) {
      return false;
    }
  }

  function setSoundWanted(on) {
    try {
      sessionStorage.setItem(SOUND_KEY, on ? "on" : "off");
    } catch (e) {}
  }

  function wireSound() {
    var ambient = document.getElementById("ambient");
    var anthem = document.getElementById("anthem-video");
    var snd = document.getElementById("snd");
    var label = document.getElementById("snd-label");
    if (!ambient || !snd) return;

    var wanted = soundWanted();
    ambient.volume = AMBIENT_VOL;

    function paint() {
      snd.classList.toggle("is-muted", !wanted);
      snd.setAttribute("aria-pressed", wanted ? "false" : "true");
      snd.setAttribute(
        "aria-label",
        wanted
          ? "Sound on. Click to mute studio sound."
          : "Sound is muted. Click for studio sound."
      );
      if (label) label.textContent = wanted ? "Sound on" : "Muted";
    }

    function anthemPlaying() {
      return !!(anthem && !anthem.paused && !anthem.ended);
    }

    function syncAmbient() {
      if (!wanted) {
        ambient.pause();
        return;
      }
      if (anthemPlaying()) {
        ambient.volume = AMBIENT_DUCK;
      } else {
        ambient.volume = AMBIENT_VOL;
      }
      var p = ambient.play();
      if (p && p.catch) p.catch(function () {});
    }

    function enableSound() {
      wanted = true;
      setSoundWanted(true);
      paint();
      syncAmbient();
    }

    function muteSound() {
      wanted = false;
      setSoundWanted(false);
      paint();
      ambient.pause();
      if (anthem && !anthem.paused) {
        anthem.muted = true;
      }
    }

    snd.addEventListener("click", function () {
      if (wanted) muteSound();
      else {
        enableSound();
        if (anthem) anthem.muted = false;
      }
    });

    if (anthem) {
      ["play", "playing"].forEach(function (ev) {
        anthem.addEventListener(ev, function () {
          if (wanted) {
            ambient.volume = AMBIENT_DUCK;
            var p = ambient.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            /* User hit play on video while page sound is muted —
               unmute page sound so sticky state matches audible video */
            enableSound();
            ambient.volume = AMBIENT_DUCK;
          }
          anthem.muted = false;
        });
      });
      ["pause", "ended"].forEach(function (ev) {
        anthem.addEventListener(ev, function () {
          if (wanted) {
            ambient.volume = AMBIENT_VOL;
            var p = ambient.play();
            if (p && p.catch) p.catch(function () {});
          }
        });
      });
    }

    paint();
    if (wanted) syncAmbient();
  }

  function boot() {
    wireNav();
    wireSound();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
