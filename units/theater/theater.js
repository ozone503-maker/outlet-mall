/* The Theater - Skin Science house.
 Screen is the channel uploads playlist. Showtimes wall is optional (/api/marquee).
*/
(function () {
 "use strict";

 var UNIT_ID = "theater";
 var CHANNEL = "UCtOyQmEcljP3LcxCEAFcTdA";
 var UPLOADS = "UU" + CHANNEL.slice(2);

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

 function wireScreen() {
 var player = document.getElementById("player");
 var wall = document.getElementById("showtimes");
 var grid = document.getElementById("posters");
 var note = document.getElementById("showtimes-note");
 if (!player || !wall || !grid) return;

 function embed(id) {
 return "https://www.youtube-nocookie.com/embed/" + id +
 "?list=" + UPLOADS + "&rel=0&modestbranding=1&autoplay=1";
 }

 function when(iso) {
 var d = new Date(iso);
 if (isNaN(d)) return "";
 return d.toLocaleDateString(undefined, {
 month: "short", day: "numeric", year: "numeric"
 });
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
 "<b></b><span></span>";
 b.querySelector("b").textContent = v.title;
 b.querySelector("span:last-child").textContent = when(v.published);
 b.addEventListener("click", function () {
 player.src = embed(v.id);
 Array.prototype.forEach.call(grid.children, function (c) {
 c.classList.remove("is-on");
 });
 b.classList.add("is-on");
 var screen = document.getElementById("screen");
 if (screen) screen.scrollIntoView({ behavior: "smooth", block: "start" });
 });
 grid.appendChild(b);
 });
 if (note) {
 note.textContent =
 videos.length + (videos.length === 1 ? " episode" : " episodes") +
 ", newest first";
 }
 wall.hidden = false;
 }

 fetch("/api/marquee", { cache: "no-store" })
 .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
 .then(function (data) {
 if (data && data.videos && data.videos.length) render(data.videos);
 })
 .catch(function () { /* wall stays hidden; screen already plays */ });
 }

 function boot() {
 wireNav();
 wireScreen();
 }

 if (document.readyState === "loading") {
 document.addEventListener("DOMContentLoaded", boot);
 } else {
 boot();
 }
})();
