/* Kudoken Gift Shop.
   Storefront shell wired to the mall ticket economy. Inventory is intentionally
   empty — add records to STOCK when merchandise is decided. Nothing else needs
   to change to open the shop.

   STOCK entry:
     { shelf: "Bottom shelf", name: "…", cost: 250, available: true }
*/
(function () {
  "use strict";

  var STOCK = [];        // no merchandise decided yet

  var balEl  = document.getElementById("bal");
  var caseEl = document.getElementById("case");
  var callEl = document.getElementById("call");
  var claimed = {};

  function paintBalance() {
    if (balEl && window.MallTickets) {
      balEl.textContent = MallTickets.format(MallTickets.get());
    }
  }

  function paintStock() {
    if (!caseEl) return;
    caseEl.querySelectorAll(".prize").forEach(function (btn) {
      var cost = +btn.dataset.cost, out = claimed[btn.dataset.name];
      btn.disabled = out || !MallTickets.canAfford(cost);
      btn.querySelector(".prize__cost").textContent =
        out ? "Claimed" : MallTickets.format(cost) + " tickets";
    });
  }

  function build() {
    if (!caseEl) return;
    var open = STOCK.filter(function (s) { return s.available !== false; });

    if (!open.length) {
      caseEl.innerHTML =
        '<div class="empty">Shelves are up. Nothing on them yet.' +
        '<span>Tickets you earn in the arcade will spend here.</span></div>';
      return;
    }

    var shelves = {};
    open.forEach(function (s) {
      (shelves[s.shelf || "Shelf"] = shelves[s.shelf || "Shelf"] || []).push(s);
    });

    Object.keys(shelves).forEach(function (name) {
      var sec = document.createElement("div"); sec.className = "shelf";
      var tag = document.createElement("p");
      tag.className = "shelf__tag"; tag.textContent = name;
      var grid = document.createElement("div"); grid.className = "goods";

      shelves[name].forEach(function (item) {
        var b = document.createElement("button");
        b.className = "prize"; b.type = "button";
        b.dataset.cost = item.cost; b.dataset.name = item.name;
        b.innerHTML = '<span class="prize__name">' + item.name + '</span>' +
                      '<span class="prize__cost"></span>';
        b.addEventListener("click", function () {
          if (claimed[item.name]) return;
          var left = MallTickets.spend(item.cost, "gift-shop:" + item.name);
          if (left === null) return;                // refused, nothing changed
          claimed[item.name] = 1;
          paintBalance(); paintStock();
          if (callEl) callEl.textContent = "Bagged. " + item.name + " is yours.";
        });
        grid.appendChild(b);
      });

      sec.appendChild(tag); sec.appendChild(grid); caseEl.appendChild(sec);
    });
    paintStock();
  }

  if (window.MallTickets) {
    paintBalance();
    MallTickets.onChange(function () { paintBalance(); paintStock(); });
  }
  build();
})();
