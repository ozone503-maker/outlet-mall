/* Fruity Puppy Outlet Mall — KUDOKEN (KDU) economy.
   Sibling to mall-tickets.js. Separate currency, separate key, separate ledger.

   The two currencies do different jobs and never merge:

       KDU is bought and WAGERED/SPENT   -> mall-kudokens.js  (this file)
       tickets are WON and REDEEMED      -> mall-tickets.js

   The loop, preserved from the 2021 Kudoken design:

       buy KDU -> spend KDU to play -> win tickets -> redeem tickets for goods

   API
     MallKudokens.get()                      current balance
     MallKudokens.canAfford(n)               boolean
     MallKudokens.price(gameId)              KDU cost to play, from config
     MallKudokens.spend(n, meta)             charge; balance, or null if refused
     MallKudokens.issue(n, meta)             grant; operator-side only
     MallKudokens.ledger()                   entries, newest first
     MallKudokens.report()                   spend totals by venue
     MallKudokens.onChange(fn)               subscribe; returns unsubscribe
     MallKudokens.format(n)                  "1,250 KDU"
     MallKudokens.config()                   loaded pricing config

   meta on spend/issue:
     { venue: "arcade" | "carnival" | "track" | "store",
       item:  "skeeball" | "mj:entry" | "sku-1234",
       ref:   optional free string }

   Venue is required on every spend. When one operator owns the arcade, the
   carnival and the track, the only real read on what is working is which venue
   is retiring currency. A spend without a venue is recorded as "unattributed"
   and shows up in report() so it can be found and fixed.

   PRICING IS NOT IN THIS FILE. It loads from /data/kdu-pricing.json.
   No game hardcodes its own entry fee — change the number in one place and
   every venue picks it up.

   STORAGE is per-browser today. When accounts and wallets land, only the
   read/write pair at the top changes; every venue keeps calling the same
   methods. Nothing else in the mall knows where the balance lives.

   PURCHASE IS DELIBERATELY NOT IMPLEMENTED. See purchase() at the bottom.
*/
(function (root) {
  "use strict";

  var KEY    = "fpom.kdu.v1";
  var LOG    = "fpom.kdu.ledger.v1";
  var CFGURL = "/data/kdu-pricing.json";
  var MAXLOG = 200;

  var mem  = { bal: null, log: [] };
  var subs = [];
  var cfg  = { default_play_cost: 5, venues: {}, games: {}, promotions: [] };

  /* ---------- storage: the only part that changes for accounts ---------- */
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

  function record(entry) { var a = readLog(); a.unshift(entry); writeLog(a); }
  function emit(bal, entry) {
    subs.forEach(function (fn) { try { fn(bal, entry); } catch (e) {} });
  }

  function clean(meta) {
    meta = meta || {};
    return {
      venue: meta.venue || "unattributed",
      item:  meta.item  || "",
      ref:   meta.ref   || ""
    };
  }

  /* ---------- pricing config ---------- */
  function activePromo(gameId, now) {
    now = now || Date.now();
    var hit = null;
    (cfg.promotions || []).forEach(function (p) {
      if (p.game && p.game !== gameId) return;
      if (p.venue && p.venue !== (cfg.games[gameId] || {}).venue) return;
      var from = p.from ? Date.parse(p.from) : -Infinity;
      var to   = p.to   ? Date.parse(p.to)   :  Infinity;
      if (now >= from && now <= to) hit = p;      // last match wins
    });
    return hit;
  }

  function price(gameId) {
    var g = (cfg.games || {})[gameId] || {};
    var base = typeof g.play_cost === "number"
      ? g.play_cost
      : (typeof cfg.default_play_cost === "number" ? cfg.default_play_cost : 5);
    var promo = activePromo(gameId);
    if (!promo) return Math.max(0, Math.round(base));
    if (typeof promo.play_cost === "number") return Math.max(0, Math.round(promo.play_cost));
    if (typeof promo.discount_pct === "number") {
      return Math.max(0, Math.round(base * (1 - promo.discount_pct / 100)));
    }
    return Math.max(0, Math.round(base));
  }

  function loadConfig() {
    if (!root.fetch) return Promise.resolve(cfg);
    return fetch(CFGURL, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { cfg = Object.assign(cfg, j); return cfg; })
      .catch(function () { return cfg; });   // defaults stand if it's missing
  }

  /* ---------- API ---------- */
  var API = {
    get: readBal,

    canAfford: function (n) { return readBal() >= Math.max(0, Math.round(n || 0)); },

    price: price,

    spend: function (n, meta) {
      n = Math.max(0, Math.round(n || 0));
      var cur = readBal();
      if (cur < n) return null;                 // refused, balance untouched
      var m = clean(meta);
      var bal = writeBal(cur - n);
      var e = { t: Date.now(), d: -n, v: m.venue, i: m.item, r: m.ref };
      record(e); emit(bal, e);
      return bal;
    },

    /* Operator-side grant. Bootstrapping, merchant seeding, comps, refunds.
       Not a purchase path — see purchase(). */
    issue: function (n, meta) {
      n = Math.max(0, Math.round(n || 0));
      if (!n) return readBal();
      var m = clean(meta);
      var bal = writeBal(readBal() + n);
      var e = { t: Date.now(), d: n, v: m.venue, i: m.item || "issued", r: m.ref };
      record(e); emit(bal, e);
      return bal;
    },

    ledger: readLog,

    /* Which venue is actually retiring currency. */
    report: function () {
      var out = {};
      readLog().forEach(function (e) {
        var v = e.v || "unattributed";
        out[v] = out[v] || { spent: 0, issued: 0, plays: 0 };
        if (e.d < 0) { out[v].spent += -e.d; out[v].plays += 1; }
        else out[v].issued += e.d;
      });
      return out;
    },

    onChange: function (fn) {
      subs.push(fn);
      return function () { subs = subs.filter(function (f) { return f !== fn; }); };
    },

    format: function (n) { return (n | 0).toLocaleString("en-US") + " KDU"; },

    config: function () { return cfg; },
    ready: loadConfig(),

    /* Only for a deliberate operator reset. Not for cleanup. */
    reset: function () {
      var bal = writeBal(0); writeLog([]);
      emit(bal, { t: Date.now(), d: 0, v: "system", i: "reset" });
      return bal;
    },

    /* ------------------------------------------------------------------
       PURCHASE — NOT IMPLEMENTED, ON PURPOSE.

       Taking money for KDU means custody of customer funds and, in most US
       states, money transmission. Whether chance games may consume a
       purchasable balance is a separate question again.

       Neither is settled, and neither should be settled by a function
       quietly appearing here. Until someone qualified has signed off on the
       specific economy, KDU enters circulation only through issue().

       When it is settled, the purchase path belongs behind a server. Never
       mint balance in the browser.
       ------------------------------------------------------------------ */
    purchase: function () {
      throw new Error(
        "MallKudokens.purchase is not implemented. KDU enters circulation " +
        "through issue() only. See the note in mall-kudokens.js."
      );
    }
  };

  if (LS) {
    root.addEventListener("storage", function (e) {
      if (e.key === KEY) emit(readBal(), null);
    });
  }

  root.MallKudokens = API;
})(window);
