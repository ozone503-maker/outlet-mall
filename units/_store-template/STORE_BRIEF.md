# New Outlet Mall store — brief (fill this out)

Hand this to the brand / ChatGPT / whoever is filling the room. One brief → one unit.

## Identity
- **Store id** (folder slug, kebab-case): `________________`
- **Display name:** `________________`
- **Unit number** (hallway order / eyebrow): `________________`
- **One-line directory blurb** (hallway card): `________________`
- **Brand voice** (what it must NOT sound like): `________________`
- **Standalone site URL** (outbound door, if any): `________________`
- **Mall reverse link owed on standalone site?** yes / no

## Room story (3–6 beats)
Write what the customer walks through, in order:
1. Approach / storefront —
2. Just inside —
3. Main beat —
4. Side beat —
5. Counter / ask (optional) —
6. Exit / outbound link —

## Shot list (required filenames)
Drop real photos into `assets/` under these exact names (swap later without code changes):

| File | What to shoot |
|------|----------------|
| `storefront.jpg` | Approach from the mall hallway |
| `entrance.jpg` | Just inside the door |
| `hero.jpg` | Main room / primary vibe |
| `detail-a.jpg` | Close detail (product, shelf, sign) |
| `detail-b.jpg` | Second detail |
| `counter.jpg` | Counter / register / desk |
| `staff.jpg` | Optional: person or character at work |
| `wide.jpg` | Wide establishing interior |

Optional video (keep short, compressed):
- `loop.mp4` + `loop-poster.jpg` — ambient loop for one panel

## Commerce rules
- Display / lookbook first. Do **not** invent a second checkout.
- Real buy links go **outbound** to the brand’s Shopify / site (new tab via `mall.js`).
- Tickets: only through `MallTickets` if this store redeems — never raw `localStorage`.
- Kudokens ≠ tickets. Don’t merge them.

## Registry entry (`data/stores.json`)
```json
{
  "id": "YOUR-SLUG",
  "name": "Your Store Name",
  "path": "/units/YOUR-SLUG/",
  "image": "/units/YOUR-SLUG/assets/storefront.jpg",
  "description": "One-line hallway blurb.",
  "status": "open"
}
```
Use `"status": "construction"` until photos + copy are real.

## Done when
- [ ] Folder copied from `_store-template` → `units/YOUR-SLUG/`
- [ ] Placeholders renamed (`store.css` / `store.js` → `YOUR-SLUG.css` / `.js`)
- [ ] `index.html` title, eyebrow, copy filled
- [ ] At least storefront + entrance + hero shots in `assets/`
- [ ] Entry added to `data/stores.json`
- [ ] Local / Vercel preview walks: hallway → room → outbound link
- [ ] Brand voice check (no mashed Fruity Puppy tone on Brobots, etc.)
