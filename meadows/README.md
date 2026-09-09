# Kudoken Meadows

A zone, not a page. Sits behind the Outlet Mall, reached out the back of the
arcade. Built to hold several attractions; two exist so far, both shells.

    /outletmall/meadows/                  the zone
    /outletmall/meadows/gift-shop/        Kudoken Gift Shop
    /outletmall/meadows/data/             riders.json, dogs.json
    /outletmall/meadows/assets/           riders/, dogs/, signage
    /outletmall/units/arcade/monkey-jockey/   reserved game mount

## Adding an attraction

Add a record to `LOTS` at the top of `meadows.js`:

    { id, name, state: "open" | "soon", href, ico, desc }

`soon` renders greyed with no link. Set `state: "open"` and give it an `href`
when it's real. The zone imposes nothing else on what lives inside a lot.

## The way in

`index.html` opens with the back-of-the-mall approach, then the gate, then the
grounds. To wire the arcade's rear exit, drop a link to `/outletmall/meadows/`
at the bottom of the arcade unit — the transition reads correctly from there.

## Tickets

The zone displays the balance and never changes it. Only games award and only
stores spend, both through `MallTickets`.

## Legacy assets

2021 Kudoken material is canon, not clutter. Old signage, race advertising and
promo art belong in `assets/` and can be placed as period fixtures. Age is part
of the story here — nothing gets modernised just for looking its age.

## Restraint

The Kudoken is not explained. "Brought to you by the Kudoken" appears as legacy
branding and is left to do its work. No lore dump on this page.
