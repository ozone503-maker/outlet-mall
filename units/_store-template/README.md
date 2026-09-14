# `_store-template` — Outlet Mall new-store kit

**Standard rooms to study:** `units/fish-store` (Wet Pets), `units/comic-shop`.  
**This folder** is the blank to copy — not a live hallway door.

## Quick start
1. Copy this folder:
   `cp -R units/_store-template units/my-new-store`
2. Rename:
   - `store.css` → `my-new-store.css`
   - `store.js` → `my-new-store.js`
3. In `index.html`, fix stylesheet/script paths + title/copy.
4. Fill `STORE_BRIEF.md`, drop photos into `assets/`.
5. Add a row to `/data/stores.json` (see brief).
6. Preview on https://outlet-mall.vercel.app after deploy.

## Paths (live GitHub mall)
Scripts/styles use root paths (not `/outletmall/`):

    /mall.css
    /mall.js
    /mall-tickets.js   (only if the unit spends/earns tickets)
    /hallway.js        (hallway only)
    /units/<slug>/<slug>.css
    /units/<slug>/<slug>.js

## Rules
- Image-first. Wide = full-bleed panels; portrait = single column (see CSS).
- Swap shots by replacing files under the same filename — no code change.
- Outbound `http(s)` links open in a new tab via `mall.js`.
- No inventing products, prices, or checkout. Link out to the real shop.
- Brobots units stay Brobots voice; FP family stays FP voice.

## Files in this kit
- `STORE_BRIEF.md` — hand to the store owner / builder
- `index.html` — room shell with labeled panels
- `store.css` / `store.js` — rename to the unit slug
- `assets/` — drop photos here (see brief shot list)
