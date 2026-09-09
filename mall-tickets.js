/* Fruity Puppy Outlet Mall — TICKET economy.
   The single source of truth for tickets. Every game that pays out and every
   store that redeems goes through here. Nothing should touch localStorage
   directly. Load before any unit script.

   SCOPE — read this before extending:
   Tickets are the Outlet Mall REDEMPTION currency. Earned by playing, spent on
   goods. That is their whole job.

   Kudokens are a SEPARATE currency belonging to the Kudoken / Meadows side —
   the play currency you wager. The 2021 loop is:

       bet Kudokens -> win tickets -> spend tickets at the gift shop

   Do not rename this module to Kudokens and do not widen it to cover both.
   A second economy gets its own module (`mall-kudokens.js`) with its own key,
   its own ledger and its own rules. They stay separate because they do
   different jobs: one is wagered, one is redeemed.

   This module is deliberately built so a sibling can sit beside it — the
   storage keys are namespaced, the subscriber list is local, and nothing here
   assumes it is the only currency in the building.

     MallTickets.get()                      -> current balance
     MallTickets.award(n, source)           -> add n, returns new balance
     MallTickets.spend(n, item)             -> deduct n if affordable, returns
                                               new balance or null if refused
     MallTickets.canAfford(n)               -> boolean
     MallTickets.ledger()                   -> recent entries, newest first
     MallTickets.onChange(fn)               -> subscribe; fn(balance, entry)
                                               returns an unsubscribe function
     MallTickets.format(n)                  -> "1,250"

   Balance is per-browser today. If tickets ever move to an account or a
   server, only this file changes — every unit keeps calling the same methods.
*/
(function (root) {
  "use strict";

  var KEY    = "fpom.tickets.v1";      // namespaced: tickets only
  var LOG    = "fpom.tickets.ledger.v1";
  var MAXLOG = 40;

  var mem = { bal: null, log: [] };   // fallback when storage is unavailable
  var subs = [];

  function storage() {
    try {
      var t = "__fpom"; localStorage.setItem(t, "1"); localStorage.removeItem(t);
      return localStorage;
    } catch (e) { return null; }
  }
  var LS = storage();

  function readBal() {
    if (!LS) return mem.bal === null ? 0 : mem.bal;
    var v = parseInt(LS.getItem(KEY), 10);
    return isNaN(v) ? 0 : Math.max(0, v);
  }
  function writeBal(v) {
    v = Math.max(0, Math.round(v));
    if (LS) { try { LS.setItem(KEY, v); } catch (e) {} } else { mem.bal = v; }
    return v;
  }
  function readLog() {
    if (!LS) return mem.log.slice();
    try { return JSON.parse(LS.getItem(LOG)) || []; } catch (e) { return []; }
  }
  function writeLog(a) {
    a = a.slice(0, MAXLOG);
    if (LS) { try { LS.setItem(LOG, JSON.stringify(a)); } catch (e) {} }
    else { mem.log = a; }
  }

  function push(entry) {
    var a = readLog(); a.unshift(entry); writeLog(a);
  }
  function emit(bal, entry) {
    subs.forEach(function (fn) { try { fn(bal, entry); } catch (e) {} });
  }

  var API = {
    get: readBal,

    canAfford: function (n) { return readBal() >= Math.max(0, n | 0); },

    award: function (n, source) {
      n = Math.max(0, Math.round(n || 0));
      var bal = writeBal(readBal() + n);
      if (n) {
        var e = { t: Date.now(), d: n, src: source || "unknown" };
        push(e); emit(bal, e);
      }
      return bal;
    },

    spend: function (n, item) {
      n = Math.max(0, Math.round(n || 0));
      var cur = readBal();
      if (cur < n) return null;                    // refused, balance untouched
      var bal = writeBal(cur - n);
      var e = { t: Date.now(), d: -n, src: item || "redeemed" };
      push(e); emit(bal, e);
      return bal;
    },

    ledger: readLog,

    onChange: function (fn) {
      subs.push(fn);
      return function () { subs = subs.filter(function (f) { return f !== fn; }); };
    },

    format: function (n) { return (n | 0).toLocaleString("en-US"); },

    /* Only for a deliberate "clear my tickets" control. Not for cleanup. */
    reset: function () {
      var bal = writeBal(0); writeLog([]);
      emit(bal, { t: Date.now(), d: 0, src: "reset" });
      return bal;
    }
  };

  // balance follows the person across tabs
  if (LS) {
    root.addEventListener("storage", function (e) {
      if (e.key === KEY) emit(readBal(), null);
    });
  }

  root.MallTickets = API;
})(window);
