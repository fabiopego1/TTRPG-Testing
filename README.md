# Runeterra Atlas — Demacia city & battle maps

Live: https://fabiopego1.github.io/TTRPG-Testing/ · or open `index.html` locally (no build, no dependencies).

Focused on **Demacia** first (other regions to follow). Two modes: **City** and **Battle**.

## Maps are authored, not random
There are no seeds or random tables. Each map is a fixed definition in `js/demacia.js` (cities) and `js/battle.js` (battle scenarios). To get a new or changed map, ask for it: layouts are tweaked by editing the map's definition (`seed` field, landmarks, features).

## City maps (6)
The Great City of Demacia · High Silvermere · Dawnhold · Terbisia · Fossbarrow · Meltridge.
Template-driven from the lore: walls, gates, districts, roads, rivers/sea, hills and landmarks. Click a numbered landmark or a district for description, NPC and hook. Landmarks are tagged **canon** (wiki) or **invented**. The **Era** switch swaps *Mageseekers' Reign* and *The Turmoil*, changing rumors and some landmark text.

## Battle maps (7, 36×24 squares = 180×120 ft)
Cloudwoods Road Ambush · Custodian Wall at Greenfang Pass · Great City Plaza Skirmish · Mageseekers Complex · Dawnhold Harbor Raid · Noble Manor Gala · Silverwing Aerie Cliffs. Every square has rules; each map lists its terrain at a glance.

## Scale (important)
- **Battle maps: 1 square = 5 ft.** An average person (Medium creature) fills **one square**: 40 px on screen, **70 px** in a default export (Roll20), **100 px** for Foundry — choose "Pixels per 5-ft square" before exporting.
- Token sizes: Tiny ½ square · Small/Medium 1 · Large 2×2 · Huge 3×3 · Gargantuan 4×4. Tokens snap to the grid.
- Objects are drawn to size: doors 5 ft, corridors 10 ft, trees 15 ft canopy, fountain 10 ft, wagon 10×5 ft.
- **City maps** are 1.5–2.5 ft per pixel (scale bar and optional 100-ft grid). A person would be ~1 px, so use pins for places/groups there, not person tokens.

## Tools
Pins and tokens, session notes, day/moonlit lighting, SVG / PNG export, **VTT-ready PNG** (no grid, labels or pins), save/load campaign JSON. Pins/notes persist in your browser.

## Lore sources
Official League of Legends Universe wiki: Demacia, The Great City of Demacia, High Silvermere, Dawnhold, Custodian Wall, Greenfang Mountains (links in the in-app “Demacia primer”). Lore is paraphrased; Demacia and League of Legends belong to Riot Games. All DCs and stat suggestions are table suggestions — adjust to your system. 

## Hosting
`.github/workflows/pages.yml` deploys the static site to GitHub Pages on every push to `main` (Settings → Pages → Source: GitHub Actions).

## Layout
`js/demacia.js` lore & scenarios · `js/city.js` city renderer · `js/battle.js` tile engine & map generators · `js/app.js` UI · `js/render.js`/`js/data.js` earlier continent/region engine (not shown in the UI; kept for future regions).
