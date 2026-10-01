# Runeterra Atlas — Demacia maps drawn to scale

Live: https://fabiopego1.github.io/TTRPG-Testing/ · or open `index.html` locally (no build, no dependencies).

Two gridless, illustrated maps — one **city** and one **below-city** site — authored in real feet (1 unit = 1 ft). No seeds, no random generation: every map is fixed data (`js/maps/*.js`), so a change means editing that map.

## The maps
| Level | Map | Size |
|---|---|---|
| City | **High Silvermere** — walls, river and Silvermere Falls, Knight's Rock with the Raptor Aerie, ~500 buildings, market, shrine, stables, gates | 2,000 × 1,300 ft |
| Below city | **House Crownguard Mansion** — ground-floor plan, courtyard, gardens and the rock face behind it (the house stands at the foot of Knight's Rock; the library and its Canticle are from the lore, the floor plan is invented) | 200 × 130 ft |

The mansion sits at its true position and size inside the city map (feature 2 → "Open map").

## Scale
- Tokens are drawn in feet: an **average person (Medium) is 5 ft across**; Tiny 2.5 · Large 10 · Huge 15 · Gargantuan 20 ft. Same on the city and the site.
- No grid: tokens go anywhere and can be dragged. Use the **Ruler** to measure feet.
- Export resolution is "px per 5 ft": site 50/70/100/140 (70 = Roll20, 100 = Foundry); city 10/15/20/30. The info line shows the resulting size and how many pixels a 5-ft token is.
- Door 4–5 ft · interior wall 1.6 ft · street 20–26 ft · lane 12–14 ft · city wall 12 ft thick.

## Tools
Click numbered locations for lore, NPCs and hooks (tagged **canon** or **invented**) · Era switch (Mageseekers' Reign / The Turmoil) · Day / night lighting · Tokens, note markers and ruler · Session notes · Export SVG, PNG with labels, or **VTT-ready PNG** (art only) · Save/load tokens and notes as JSON.

## Lore sources
Official League of Legends Universe wiki (links in the in-app “Demacia primer”). Paraphrased; Demacia and League of Legends belong to Riot Games.

## Files
`js/scene.js` renderer (textures, furniture, buildings…) · `js/maps/crownguard.js` hand-authored site · `js/maps/silvermere.js` baked city data · `js/app.js` UI · `js/lore.js` lore pack · `.github/workflows/pages.yml` GitHub Pages deploy.
