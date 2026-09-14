# Brobots Space Factory Multimedia Studios

Image-first mall unit for the Brobots entertainment door — robots running a real multimedia factory (stage, Foley, edit, mix), funneling to the campus Multimedia Center.

**Outbound (required):** https://brobots-space-academy.vercel.app/multimedia.html  
**Secondary:** https://brobots.space

## Room beats
1. Approach — wide post bay + soundstage (`wide.jpg`)
2. Stage — LED wall / clapper *A Brighter Tomorrow* (`stage.jpg`)
3. Foley — boot in gravel (`foley.jpg`)
4. Edit bay — dual monitors / lunar cam (`edit.jpg`)
5. Mix + booth — red-eye vocalist (`mix.jpg`)
6. Studio anthem — `anthem.mp4` + poster (gold mustache mall tour → “hit the studio”)
7. Ambient — hidden `#ambient` (`ambient.m4a`); sticky Mute / Sound (`sessionStorage` `brobots-multimedia.sound`)
8. Outbound — Multimedia Center + brobots.space; hallway back; `mallNav` `brobots-multimedia`

## Assets
| File | Role |
|------|------|
| `wide.jpg` | Approach / hallway door source |
| `stage.jpg` | LED stage hero |
| `foley.jpg` | Foley robots |
| `edit.jpg` | Edit bay |
| `mix.jpg` | Mix room + booth |
| `anthem.mp4` | ~51s mall anthem (≤2.5MB, 640-wide) |
| `anthem-poster.jpg` | Anthem poster (gold robot) |
| `ambient.m4a` | Looping AAC bed from anthem audio |

Hallway thumb: `/assets/brobots-multimedia.jpg` (from `wide.jpg`).

## Mute
Default **Muted**. Sticky corner toggles ambient loop. Preference in `sessionStorage` key `brobots-multimedia.sound` (`on`/`off`). Ambient ducks while anthem video plays. Playing the anthem while muted turns Sound on so the sticky matches audible video.

## Brand
- Name: Brobots Space Factory Multimedia Studios / BroBots Multimedia Studios
- Voice: people agency run by robots; handmade; *A Brighter Tomorrow*
- Mottoes: Ideas robots stories worlds together · Stories worlds together · Fuel ideas render repeat
- Pipeline: Record / Mix / Master / Edit / Color / Sound / Deliver
- No fake products, prices, or cart
