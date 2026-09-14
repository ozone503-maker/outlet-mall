# Shared Mall Playbook — Fruity Puppy Outlet Mall

**Source of truth:** https://github.com/ozone503-maker/outlet-mall  
**Live:** https://outlet-mall.vercel.app  
**Audience:** ChatGPT (heavy mall implementation) + BROBOSS (direction / Brobots voice / occasional units when Jessie asks)

This doc aligns both builders on *how* the mall is built after the ChatGPT slim rebuild. Claude’s bloated local frameworks are **not** the model.

---

## Non-negotiables

### Paths (root-hosted, not `/outletmall/`)
Vercel serves the repo **at site root**. Do **not** prefix with `/outletmall/`.

| What | Path |
|------|------|
| Hallway | `/` → `index.html` + `hallway.js` |
| Shared CSS | `/mall.css` |
| Outbound helper | `/mall.js` |
| Tickets | `/mall-tickets.js` |
| Kudokens (separate) | `/mall-kudokens.js` |
| Store registry | `/data/stores.json` |
| Shared hallway thumbs | `/assets/<door>.jpg\|png` |
| Unit room | `/units/<slug>/` |
| Unit CSS/JS | `/units/<slug>/<slug>.css` / `.js` |
| Unit photos | `/units/<slug>/assets/` |
| Meadows zone | `/meadows/` (not under `units/`) |

Old docs/READMEs that say `/outletmall/mall.css` are **stale leftovers** — live HTML already uses `/mall.css`.

### Load order (every unit)
```
/mall.css
/units/<slug>/<slug>.css
…
/hallway.js          (for mallNav / prev-next)
/mall.js             (outbound http(s) → new tab)
/mall-tickets.js     (before any unit code that touches tickets)
/units/<slug>/<slug>.js
/video-governor.js   (only if the room plays multiple videos)
```
Tickets module **must** load before unit scripts that award/spend.

### Hallway discovery
- Hallway is **empty shell**; `hallway.js` `fetch`es `/data/stores.json` and renders doors.
- Registry fields: `id`, `name`, `path`, `image`, `description`, `district` (optional), `status` (`open` | `construction`).
- Folder names starting with `_` (e.g. `_store-template`) are **kits, not doors** — never list them in `stores.json`.
- Adding a store = add folder + row in `stores.json`. No hardcoding doors in `index.html`.

### Ticket economy
- **Tickets** = redemption currency (`MallTickets` in `mall-tickets.js`). Earn by playing, spend on goods.
- **Kudokens** = separate wager currency (`mall-kudokens.js`). Never merge.
- Loop: `bet Kudokens → win tickets → spend tickets at gift shop`.
- API only: `get`, `award`, `spend`, `canAfford`, `ledger`, `onChange`, `format`. **No raw `localStorage` for tickets.**
- Zones (Meadows) may *display* balance; only games award, only stores spend.

### Asset strategy
- **External files only** — JPG/WebP/MP4/MP3 under `assets/`. Prefer compressed, lean sizes.
- **No base64 embeds** in HTML/CSS/JS. No 59MB single-file rooms. No shipping `*.zip` in the deploy repo (see `.gitignore`).
- Image-first rooms: wide viewport = full-bleed panels; portrait = single column. Swap shots by replacing same filename.
- Hallway door image usually lives in root `/assets/`; room shots live in the unit’s `assets/`.

### Outbound + commerce
- Real buy / brand sites open via normal `http(s)` links; `mall.js` forces `target=_blank` + `rel=noopener`.
- Display / lookbook first. **Do not invent a second checkout** inside the mall.
- Brand voice: Brobots units sound Brobots; FP family stays FP. Don’t mash tones.

### Zones vs units
- **Unit** = one storefront: `/units/<slug>/`
- **Zone** = area of the world (e.g. Kudoken Meadows at `/meadows/`) that can hold lots, games, gift shop
- District labels in `stores.json` (`retail`, `food`, `entertainment`, `main`, `meadows`) are directory metadata, not separate frameworks

---

## How to add a store

1. Prefer kit: **`units/_store-template/`** (PR `#1` / branch `broboss/store-template` — merge when ready). Quick start also in `docs/NEW-STORE.md` once that PR lands.
2. If template not on `main` yet, copy a gold standard:
   - **`units/fish-store`** (Wet Pets) — image + short video panels
   - **`units/comic-shop`** — image-first, outbound free reads
   - Arcade = heavy media reference only
3. Steps:
   - Copy → `units/<slug>/`; rename `store.css` / `store.js` → `<slug>.css` / `.js`
   - Fill brief / room beats; drop required shots (`storefront`, `entrance`, `hero`, details, `counter`, `wide` — names can flex if the room story needs it, as Peter’s Rocks did)
   - Register in `data/stores.json` (`status: "construction"` until real)
   - Preview: hallway → room → outbound → back to `/`

---

## What NOT to do (Claude failure modes)

- **Monolithic / nested frameworks** under `/outletmall/` with duplicate `corridor.js`, unpack scripts, and parallel trees
- **Shipping archive zips inside the deploy repo** (`outlet-mall-assets.zip` ~21MB, `outlet-mall-code.zip` ~9MB — removed Sep 9, 2026)
- **Huge base64 HTML** or “one file is the whole store” (the ~59MB clunker pattern)
- **Hardcoded hallway doors** in `index.html` instead of `data/stores.json`
- **Second checkout / invented prices** inside a unit when a real Shopify/site exists
- **Merging tickets + Kudokens** or poking `fpom.tickets.v1` outside `MallTickets`
- **Copying local box leftovers** (`/workspace/shoe-store/attachment/outletmall`, `/workspace/mall/outletmall`, museum/theater zips) back into GitHub — those are Claude-era / unpack debris, not source of truth
- **Placeholder brochure pages** pretending to be finished rooms (thin HTML-only doors are OK as `construction`, not as “done”)

---

## Division of labor

| Role | Owns |
|------|------|
| **ChatGPT** | Heavy mall implementation: core scripts, registry, gold-standard rooms, Meadows/economy wiring, Vercel path hygiene, slim asset discipline |
| **BROBOSS** | Direction, Brobots / brand voice, playbooks, store template kit, occasional units when Jessie asks (e.g. Peter’s Rocks) |
| **Jessie** | Priorities, which doors open next, voice veto |

Both agents work **only** against `ozone503-maker/outlet-mall` `main` (or short-lived feature branches → PR). Local box copies are scratch, never canon.

---

## Architecture snapshot (ChatGPT rebuild)

```
index.html          hallway shell
hallway.js          fetch stores.json → render doors + mallNav
mall.css / mall.js  tokens + outbound tab behavior
mall-tickets.js     redemption economy
mall-kudokens.js    wager economy (sibling)
video-governor.js   multi-video rooms
data/stores.json    registry (source of hallway truth)
assets/             shared door thumbs + shared media
units/<slug>/       one room each (html/css/js/assets)
meadows/            zone behind the mall
```

**Rebuild milestones (2026-09-09):** unpack correct root for Vercel → path normalize off `/outletmall/` → add `data/stores.json` + data-driven hallway → delete archive zips from deploy repo → gitignore bundles. **2026-09-13:** BROBOSS store template (PR #1) + Peter’s Rocks unit (PR #2, merged).

Approximate sizes (healthy): gold units ~0.5–1.6MB; arcade ~5MB; Peter’s Rocks ~4.4MB (photos + short hello mp4); root `assets/` ~30MB shared; **no** multi‑tens‑of‑MB HTML/base64 rooms in repo.

---

## Peter’s Rocks fit check

**Fits the system.** Unit 15 (`units/peter-herres/`): registered in `stores.json`, root `/mall.css` + `/mall.js` + `/hallway.js` + `mallNav` prev/next, image-first stall beats, outbound Field Guide (no fake cart), external assets only. Custom shot names (`canopy`, `table`, `register`) are fine — story > rigid filenames. Keep compressing large stills/video when iterating; don’t reintroduce brochure-only or base64 patterns.
