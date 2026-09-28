# Interchange spec

The Outlet Mall is the connection between the house properties.
It is not a fifth brand. It is the hallway.

```
brobots.space          tools / bots / teachers / time
fruitypuppy.com        cream / Ipo / farm / sanctuary
ishipmyplants.shop     living inventory leaving FLASHTOWN
monkey-jockey          play loop that moves currency
        \                |                /
         \               |               /
          Fruity Puppy Outlet Mall
                    |
              Kudoken Meadows
                    |
         wallet / local KDU ledger
```

Repo: `ozone503-maker/outlet-mall`
Live: https://outlet-mall.vercel.app
Production branch: `main` only.

This file is the map. It does not implement wallets, purchases, or the game.
Implementation stays in the units and in `mall-kudokens.js` / `mall-tickets.js`.

---

## Creed (do not fork)

- Knowledge, tools, teachers, and borrowed BroBots stay free.
- Jessie's time / hybrid brain is what gets paid.
- Nobody needs Kudoken to get cream, a cutting, a lesson, or a BroBot.
- Kudoken makes the mall more fun to live in if you already wanted to be there.
- Guest can walk every door with nothing connected.
- Wallet connect is never on the directory.
- Ticker is never on the directory.
- Kudoken Meadows stays behind the mall and is allowed to look unfinished.

---

## Two chips, two jobs

Already true in code. Do not merge them.

| Chip | File | Job |
|---|---|---|
| **KDU** (Kudoken) | `mall-kudokens.js` | Spent to play. Venue required on every spend. |
| **Tickets** | `mall-tickets.js` | Won from play. Redeemed for goods. |

Current browser loop (from `mall-kudokens.js`):

```
KDU enters by issue() only
  -> spend KDU to play (venue: arcade | carnival | track | store)
  -> win tickets
  -> redeem tickets for goods
```

`MallKudokens.purchase()` is **not implemented on purpose**.
Taking money for KDU is custody + money-transmission territory.
Until that is signed off by someone qualified, KDU only enters circulation through `issue()`.
When accounts/wallets land, only the read/write pair at the top of `mall-kudokens.js` changes. Venues keep calling the same methods.

Pricing lives in `/data/kdu-pricing.json`. No game hardcodes its own fee.

### How this meets "the game feeds Kudoken into wallets"

Two honest paths. Pick one in writing before wiring chain.

1. **Play-first faucet (Jessie's sentence):** Monkey-Jockey grants KDU via `issue()` after a finished run, then the player may spend KDU elsewhere in the mall. Tickets can still be the prize layer.
2. **Arcade-cabinet loop (current code):** KDU is the token you put in the machine. Tickets are what come out. The game does not mint KDU; it retires it.

Until chain custody exists, both paths use the local ledger. Do not mint balance in the browser and call it a wallet.

---

## Property jobs

| Property | Mall door(s) | Job | Must never |
|---|---|---|---|
| BroBots Space Factory (`brobots.space`) | `brobots-retail`, `brobots-multimedia` | Tool crib + studio. Borrow a BroBot. Charge only for the brain. | Sell the library. Lock knowledge behind KDU. Look like a generic merch grid. |
| Fruity Puppy (`fruitypuppy.com`) | `fruity-puppy-skincare`, `lava-guava`, `thorny-toad`, `fruity-puppy-merch` | Product + Ipo + FLASHTOWN proof. | Become merch for a crypto game. |
| I Ship My Plants (`ishipmyplants.shop`) | greenhouse / living-inventory unit (Wet Pets adjacent or its own door) | Physical plants leaving the volcano. Card first, KDU optional later. | Pretend every plant is an NFT. |
| Monkey-Jockey | Arcade cabinet + Meadows | Play loop. Only loop allowed to move KDU as a consequence of play. | Become a slot wearing a monkey. Sit on the homepage. |
| Outlet Mall (this repo) | directory + shared scripts | One body, many stores. Shared identity later. | Force a wallet before someone can look at cream. |
| Kudoken Meadows | `/meadows/` | Backyard. Open grounds. Where the currency is allowed to be visible. | Ticker on the hallway. Fake "finished" landscaping. |

---

## What travels between sites

Travels:

- Story and place (FLASHTOWN, volcano, sanctuary).
- One passport later (account / wallet badge). Guest mode first.
- A short "also from this house" strip on each unit. Three links max.
- KDU + tickets balances once a venue opts in through the existing APIs.
- Outbound https links through `mall.js` (new tab), per playbook.

Does not travel:

- Paywalls on information.
- Factory seven-pass process sold as a token.
- Cream formula.
- Forced wallet modal on first paint.
- Cross-site cart until there is one checkout owner.

---

## Three lines each core door should say

**Directory (hallway)**  
Enter through any door.  
The mall connects the factory, the cream, the plants, and the game.  
You do not need a wallet to walk.

**Arcade**  
Nine machines, a claw full of skin cream, and one cabinet you can hear.  
That cabinet is Monkey-Jockey.  
Play lands in Meadows, not on this card as a ticker.

**BroBots retail**  
Imagination builds better humans.  
Borrow a robot. Keep your domain.  
Pay for the hybrid brain, never the library.

**Fruity Puppy skincare**  
Handmade biological skin cream, cold-extracted and refrigerated.  
Ipo works this counter and does not upsell.  
The farm is real; the jar is the proof.

**I Ship My Plants / greenhouse**  
Living things, packed on the volcano.  
Card works. Kudoken is optional later.  
Nothing here is an NFT unless Jessie says it is, in writing.

**Metal Dick's Robot Lounge**  
Robot comedy, rap, and live bands.  
No humans allowed.  
Tickets and sets live here; the currency does not advertise here.

**Kudoken Meadows**  
Behind the mall. Open grounds, mostly unfinished.  
This is where KDU is allowed to show its face.  
Leave it unfinished until it is actually a place.

---

## Wiring order (do not skip)

1. Keep guest hallway working. No wallet on directory.
2. Finish gold rooms per `HANDOFF-CHATGPT-CONSTRUCTION.md` and `docs/MALL_PLAYBOOK.md`.
3. BroBots retail becomes a dossier / borrow desk, not a broken merch grid.
4. Arcade card points at Monkey-Jockey without putting KDU on the hallway.
5. Meadows page explains the two chips in human language.
6. Only then: replace localStorage read/write in `mall-kudokens.js` with an account/wallet pair. Venues unchanged.
7. Purchase path stays thrown until legal sign-off.

---

## Also-from-this-house strips (copy to paste)

Use on unit pages. Never dump the whole portfolio.

- On cream: Factory · Plants · Meadows
- On factory: Cream · Arcade · brobots.space
- On plants: Cream · FLASHTOWN · Meadows
- On arcade: Meadows · Lounge · Factory
- On meadows: Arcade · Hallway · Factory

---

## Out of scope for this document

- Implementing Monkey-Jockey.
- Minting or listing a token.
- Redesigning gold rooms (arcade, fish-store, comic-shop, peter-herres, thorny-toad, fitting-room, brobots-multimedia).
- Path prefix `/outletmall/`.
