/* The Theater — behaviour.

   The screen works on its own: it's the channel's uploads playlist, so every
   new episode appears without anyone touching this file.

   The showtimes wall is extra. It asks /api/marquee (the Vercel function in
   /api/marquee.js) for the channel's latest videos. If the endpoint isn't
   deployed, or the browser can't reach it, the wall simply stays hidden and
   the screen keeps playing. Nothing here is required for the room to work.
*/
(function () {
  "use strict";

  var CHANNEL = "UCtOyQmEcljP3LcxCEAFcTdA";
  var UPLOADS = "UU" + CHANNEL.slice(2);
  var player = document.getElementById("player");
  var wall = document.getElementById("showtimes");
  var grid = document.getElementById("posters");
  var titleEl = document.getElementById("marquee-title");
  var note = document.getElementById("showtimes-note");
  if (!player || !wall || !grid) return;

  function embed(id) {
    return "https://www.youtube-nocookie.com/embed/" + id +
      "?list=" + UPLOADS + "&rel=0&modestbranding=1&autoplay=1";
  }

  function when(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function render(videos) {
    grid.innerHTML = "";
    videos.forEach(function (v) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "poster";
      b.setAttribute("aria-label", "Play " + v.title);
      b.innerHTML =
        '<span class="poster__art"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' +
          v.id + '/hqdefault.jpg"></span>' +
        '<b></b><span></span>';
      b.querySelector("b").textContent = v.title;
      b.querySelector("span:last-child").textContent = when(v.published);
      b.addEventListener("click", function () {
        player.src = embed(v.id);
        if (titleEl) titleEl.textContent = v.title;
        Array.prototype.forEach.call(grid.children, function (c) { c.classList.remove("is-on"); });
        b.classList.add("is-on");
        document.getElementById("screen").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      grid.appendChild(b);
    });
    if (note) note.textContent = videos.length + (videos.length === 1 ? " episode" : " episodes") + ", newest first";
    wall.hidden = false;
  }

  fetch("/api/marquee", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (data) {
      if (data && data.videos && data.videos.length) render(data.videos);
    })
    .catch(function () { /* wall stays hidden; the screen is already playing */ });
})();
