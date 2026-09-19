# ChatGPT handoff — Fruity Puppy Outlet Mall (priority)

**From:** BROOM.BOT (push broom) for Jessie  
**Date:** 2026-09-19 HST  
**Why:** Mall is the center of the portfolio. Games (Monkey Jockey / MDP) sit for now — improve on your own / with regular Grok if you want; do **not** expect Grok Bot crew wakes for games. Grok tokens are tight (~66% used); keep heavy build on ChatGPT.

---

## Canon (do not fork)

| | |
|---|---|
| **Repo** | https://github.com/ozone503-maker/outlet-mall |
| **Live** | https://outlet-mall.vercel.app |
| **Branch** | `main` only for production |
| **Playbook** | repo / `MALL_PLAYBOOK.md` pattern — root paths (`/mall.css`, not `/outletmall/`) |
| **Gold refs** | `units/fish-store`, `units/comic-shop`, Arcade for heavy media |
| **Template** | `units/_store-template/` + `NEW-STORE.md` |

**Abandoned (do not revive):** `outlet-mall-wed`, `Final-outlet-i-hope`, local `/workspace/mall` Claude-era trees.

---

## Already done (PR #7 merged 2026-09-18)

- Hallway thumbs remapped for arcade / fish-store / comic-shop / restaurant / burger-shack
- Theater + Museum rebuilt image-first (projectionist)
- Brochure-thin doors flipped to `status: "construction"` in `data/stores.json`

Verify live before redoing any hallway work.

---

## Your job — construction doors → gold (image-first)

Flip each from `construction` to `open` only when it matches gold:

1. Local `units/<slug>/assets/` with real photos (no `via.placeholder.com`, no dead Shopify CDN 404s)
2. Image-first panels (Wet Pets / comic-shop style)
3. Script load order per playbook: `mall.css` → unit CSS → `hallway.js` → `mall.js` → `mall-tickets.js` → unit JS
4. Outbound https links go through `mall.js` (new tab)
5. Register/update `data/stores.json`

### Priority order (suggested)

| Priority | slug | Notes |
|---:|---|---|
| 1 | `fruity-puppy-skincare` | Brand core; kill dead CDN imgs; local assets |
| 2 | `fruity-puppy-merch` | Tees/hats — not skincare shelf as hero |
| 3 | `brobots-retail` | Space Factory retail; coordinate copy with brobots.space if needed |
| 4 | `shoe-store` | AI Bundy domain historically; build gold room |
| 5 | `dairy-queen` | Food court |
| 6 | `seven-eleven` | Convenience |
| 7 | `lava-guava` | Bomb balm |
| 8 | `fpx-boutique` | **Ask Jessie first** — thumb/registry conflict (Extreme skincare vs Extended armor) |
| 9 | `meadows` | Need real outdoor still; was phone-gallery junk before |

Optional later: ship `broboss/metal-dicks-lounge` image-first upgrade if still not on main.

---

## Do not

- Redesign working gold rooms (arcade, fish-store room, comic-shop room, peter-herres, thorny-toad, fitting-room, brobots-multimedia, etc.)
- Prefix paths with `/outletmall/`
- Widen scope into Monkey Jockey / MDP / ShockBot
- Burn Grok Bot agents for implementation — paste PRs/issues here; BROOM will gate

---

## Success

- Construction doors either **open + gold** or still clearly `construction`
- Live hallway matches door subjects
- PR to `main` with short test plan (door list + screenshots)

Report PR URL when ready. Jessie / BROOM will review.
