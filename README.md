# Runeterra Atlas — Demacia city & battle maps

Live: https://fabiopego1.github.io/TTRPG-Testing/ · or open `index.html` locally (no build, no dependencies).

Focused on **Demacia** first (other regions to follow). Two modes: **City** and **Battle**.

## City maps (6)
The Great City of Demacia · High Silvermere · Dawnhold · Terbisia · Fossbarrow · Meltridge.
Each is template-driven from the lore: walls, gates, districts (noble, slum, market, military, harbor…), roads, rivers/sea, hills and landmark buildings. Click a numbered landmark or a district for description, NPC, hook and street encounters. Landmarks are tagged **canon** (from the wiki) or **invented** (table-ready additions). The **Era** switch swaps between *Mageseekers’ Reign* and *The Turmoil* (Sylas’ rebellion), changing rumors, encounters and some landmark text.

## Battle maps (7, 36×24 grid of 5 ft squares)
Cloudwoods Road Ambush · Custodian Wall at Greenfang Pass · Great City Plaza Skirmish · Mageseekers Complex (petricite cells) · Dawnhold Harbor Raid · Noble Manor Gala · Silverwing Aerie Cliffs.
Every square has tabletop rules (cover, difficult terrain, DCs). Each scenario has objectives, an enemy/encounter d6 table and a complications d6 table. The seed re-rolls terrain.

## Tools
Pins (NPC / quest / encounter / note; hero & foe tokens on battle maps), session notes, day/moonlit lighting, SVG / PNG export, **VTT-ready PNG** (no grid, labels or pins; battle maps at 70 px per square), save/load campaign JSON. Pins/notes persist in your browser.

## Lore sources
Official League of Legends Universe wiki: Demacia, The Great City of Demacia, High Silvermere, Dawnhold, Custodian Wall, Greenfang Mountains (links in the in-app “Demacia primer”). Lore is paraphrased; Demacia and League of Legends belong to Riot Games. All DCs and stat suggestions are table suggestions — adjust to your system. Edit `js/demacia.js` to change cities, NPCs, hooks and scenarios.

## Hosting
`.github/workflows/pages.yml` deploys the static site to GitHub Pages on every push to `main` (Settings → Pages → Source: GitHub Actions).

## Layout
`js/demacia.js` lore & scenarios · `js/city.js` city renderer · `js/battle.js` tile engine & map generators · `js/app.js` UI · `js/render.js`/`js/data.js` earlier continent/region engine (not shown in the UI; kept for future regions).
