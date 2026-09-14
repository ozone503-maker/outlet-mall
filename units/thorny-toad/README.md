# Thorny Toad Toner Warehouse / Face Juice

Image-first mall unit for Hawaiʻi small-batch botanical facial toner.

## Room beats
1. Approach — mall storefront (`storefront.jpg`)
2. Inside — neon FACE JUICE wall (`wall.jpg`)
3. The juice — product bottle (`product.jpg`)
4. Five botanicals — ingredient trays (`ingredients.jpg`)
5. Shelves — jars + stock (`shelves.jpg`)
6. Small batch — lab pour (`lab-pour.jpg`)
7. Auntie hello — `toad-hello.mp4` + poster (visible controls; keep dialogue as-is)
8. Ambient — hidden `#ambient` (`ambient.m4a`); sticky Mute / Sound (`sessionStorage` `thorny-toad.sound`)
9. Outbound — shop.fruitypuppy.com Face Juice + brand page; hallway back; `mallNav` `thorny-toad`

## Assets
| File | Role |
|------|------|
| `storefront.jpg` | Approach / hallway door (also root `/assets/thorny-toad.jpg`) |
| `wall.jpg` | Inside neon wall |
| `product.jpg` | Bottle detail |
| `ingredients.jpg` | Five botanicals trays |
| `shelves.jpg` | Apothecary jars + bottles |
| `lab-pour.jpg` | Small-batch pour |
| `toad-hello.mp4` | ~9s shopkeeper hello |
| `toad-hello-poster.jpg` | Hello poster |
| `ambient.m4a` | Audio-only bed (extracted from long clip; **no** YouTube frame UI) |

## Mute
Default **Muted**. Sticky corner button toggles ambient loop. Preference in `sessionStorage` key `thorny-toad.sound` (`on`/`off`). Ambient ducks while hello video plays.
