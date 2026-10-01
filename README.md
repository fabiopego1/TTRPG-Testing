# Runeterra Atlas — Demacia maps drawn to scale

Live: https://fabiopego1.github.io/TTRPG-Testing/ · or open `index.html` locally (no build, no dependencies).

Two gridless, illustrated maps — one **city** and one **below-city** site — authored in real feet (1 unit = 1 ft). No seeds, no random generation: every map is fixed data in `js/maps/`, so a change means editing that map. Locations carry a name and a description only, tagged **canon** (from the lore) or **invented**.

## The maps
| Level | Map | Size |
|---|---|---|
| I · City | **High Silvermere** — walls, river, Silvermere Falls, Knight's Rock with the Raptor Aerie, two main streets crossing at the market square, blocks of houses facing the streets with backyards, west/south gates, bridge, stables, shrine | 2,000 × 1,300 ft |
| II · Below the city | **House Crownguard Mansion** — ground-floor plan (kitchen, servants' hall, library, study, great hall, dining hall, drawing room), terrace, forecourt, grounds and the rock face behind. The house and its library are from the lore; the plan is invented | 200 × 130 ft |

The mansion sits at its true position and size inside the city map (location 2 → "Open map").

## Scale
- A token is the creature's **body footprint**: a person is **2.5 ft**; Tiny 1.25 · Large 5 · Huge 10 · Gargantuan 15. The same on the city and the site. The 5-ft D&D "square" is the space a creature controls, not its body.
- Objects are sized against a person: doors 3–3.5 ft (double 6, entrance 7), interior walls 1.6 ft, streets 16–26 ft, houses 20–30 ft frontage × 32–38 ft deep.
- No grid: tokens go anywhere and can be dragged; the **Ruler** measures feet.
- Export resolution is "px per 5 ft" (site 50/70/100/140 — 70 = Roll20, 100 = Foundry; city 10/15/20/30). The info line shows the image size and how many pixels a 5-ft step and a person are.

## Tools
Tokens, note markers and ruler · Day / night lighting · Session notes per entry · Export **VTT-ready PNG** (art only), PNG with labels, or SVG · Save/load tokens and notes as JSON.

## Design
Demacian art direction: ink and stone, hairline gold rules, notched controls, a bracket-framed map with a cartouche, and a codex-style entry panel. See `CLAUDE.md` for the design brief and the map rules.

## Lore sources
Official League of Legends Universe wiki (links in the app). Paraphrased; Demacia and League of Legends belong to Riot Games.

## Files
`js/scene.js` renderer · `js/maps/crownguard.js` hand-authored site · `js/maps/silvermere.js` baked city · `js/app.js` UI · `js/core.js` helpers & token sizes · `js/lore.js` sources · `css/style.css` design system · `.github/workflows/pages.yml` GitHub Pages deploy · `CLAUDE.md` project rules.
