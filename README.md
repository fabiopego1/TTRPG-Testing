# Runeterra Atlas — interactive TTRPG map generator

Open `index.html` in a browser (no build step, no dependencies, works offline; Cinzel font loads from Google Fonts if online).

## Scales
| Scale | What you get |
|---|---|
| **Continent** | Hand-placed Runeterra (12 regions, 30 POIs, roads and sea routes) with procedural coastlines, terrain icons, optional hex overlay |
| **Region** | Zoomed, higher-detail map of one region plus seeded hamlets, camps, ruins, shrines and caves, each with a generated hook |
| **City** | Walled-city layout (gates, ring roads, districts, buildings, optional harbor) styled per culture |
| **Battle** | 36×24 five-foot grid with biome terrain (river/bridge, forest, bog, cliffs, rubble, ice…) and terrain rules per square |

## Interactivity
- Click a region / POI / district / square: encounter table with d6 roller, NPCs, quest hooks, random NPC/hook generators, session notes.
- Double-click a region or city to drill down. Wheel = zoom, drag = pan, `1`–`4` switch scale, `Esc` deselects.
- **Pins** (NPC / quest / encounter / note; hero / foe tokens on battle maps) with labels and notes; `Delete` removes the selected pin.
- Pins and notes persist in `localStorage`; **Save/Load** exports them as JSON.

## Export
- **SVG** and **PNG** of the current view.
- **VTT-ready PNG**: strips frame, pins and grid; battle maps export at 70 px per square.

## Customisation
Seed (re-rolls terrain scatter, generated POIs, cities, battle maps; continent coastlines stay canon), themes (Parchment / Hextech / Political), and toggles for labels, borders, terrain, routes, hex grid, square grid and frame.
Lore, tables and NPCs live in `js/data.js` — edit freely to match your campaign.

## Why a custom engine (research summary)
- **Fantasy Map Generator (Azgaar)** — browser-only and DOM-coupled; no stable headless API (a headless port is still in progress), and it generates random worlds rather than a fixed Runeterra.
- **Wargame Cartographer** — a Claude Code plugin built around real-world terrain data; not suited to a fictional continent.
- **RPG Map Creator (Smithery)** — no public API/extension point found.
- **D3 / d3-delaunay** — good for Voronoi terrain, but a dependency-free SVG renderer was simpler for a fixed canon layout plus click interaction.

Lore is paraphrased from the League of Legends universe for tabletop use; names and settings belong to Riot Games.
