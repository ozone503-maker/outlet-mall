# Monkey Jockey — integration target

Reserved mount point. The game is built by Jessie + ChatGPT and delivered as a
package; this directory is where it installs. Nothing here implements gameplay.

## What to deliver

Drop the game's files into this directory. Expected shape:

    monkey-jockey/
      index.html          <- replace, or keep and mount into the root div
      monkey-jockey.js
      monkey-jockey.css
      assets/

If the game ships as a single self-contained file, replacing `index.html`
outright is fine. If it mounts into a container, use `#monkey-jockey-root`.

## The only two integrations that matter

### 1. Tickets

`MallTickets` is already loaded on this page. It is the single source of truth
for the mall economy. Do not read or write `localStorage` directly, and do not
create a second balance.

    MallTickets.get()                    // current balance
    MallTickets.award(n, "monkey-jockey")// pay out
    MallTickets.spend(n, "mj:entry-fee") // charge; returns null if refused
    MallTickets.canAfford(n)
    MallTickets.onChange(fn)             // fn(balance, entry)
    MallTickets.format(n)                // "1,250"

`spend` returns `null` and changes nothing when the balance is short — check the
return value rather than pre-checking and hoping.

Payout amounts, odds, and entry fees are the game's business. The mall does not
have an opinion; it only records what the game reports.

**Tickets are not Kudokens.** Tickets are what the game *pays out* — the mall's
redemption currency. Kudokens are what gets *wagered*, and they belong to the
Kudoken side. They do not exist yet and are not part of this module. If the game
needs a wagering currency before one is built, keep it internal to the game
rather than routing it through `MallTickets`.

### 2. Rosters

Riders and dogs load from data, not from code:

    /outletmall/meadows/data/riders.json
    /outletmall/meadows/data/dogs.json

Both are arrays with a documented field list inside the file. Nothing in the
mall assumes how many entries exist. Add records, don't add cases.

Exactly one rider carries `canonical: true` — the Monkey Jockey himself. Every
other rider comes from the Fruity Puppy universe.

The dogs are real rescues from FlashTown and Rooster Island, under their real
names. Treat those records as records.

## Art assets

    /outletmall/meadows/assets/riders/
    /outletmall/meadows/assets/dogs/

Reference by path from the JSON, so swapping art never touches code.

## What this page must keep

- The title `MONKEY JOCKEY`
- The line `Brought to you by the Kudoken`
- A way back to `/outletmall/meadows/`

## What the mall guarantees

- `mall.css` tokens are loaded — inherit them rather than declaring new fonts
- `mall.js` sends outbound links to a new tab automatically
- `mall-tickets.js` is loaded before any unit script
