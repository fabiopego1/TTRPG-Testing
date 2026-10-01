# Runeterra Atlas — instructions for Claude

Static site (no build step) hosted on GitHub Pages: https://fabiopego1.github.io/TTRPG-Testing/
Repo: `fabiopego1/ttrpg-testing`. Pages deploys from `main` via `.github/workflows/pages.yml`.

## Always ship every change to the hosted site
The owner has given standing permission. After **every** change to the project (maps, lore, UI, README, anything), do all of this without asking:

1. Test it first: load `index.html` in headless Chromium (Playwright is installed) and confirm no page errors; for map changes also take a screenshot and look at it.
2. Commit on a feature branch (never directly on `main`). Add the Co-Authored-By / Claude-Session lines from the session's attribution reminder.
3. Push the branch, open a PR into `main` (end the body with the PR attribution line), and **merge it** (squash). Merging to `main` triggers the deploy workflow.
4. Watch the **Deploy to GitHub Pages** run until it succeeds; if it fails, read the job logs, fix, and repeat from step 2. Then confirm `https://fabiopego1.github.io/TTRPG-Testing/` returns 200.
5. Tell the owner the change is live, with the link. If something blocks the deploy (e.g. permissions), say exactly what and what is needed.

The integration cannot re-run or dispatch workflows (403), so a deploy is triggered by merging a change to `main`.

## Project rules
- **Maps are authored data, not generated.** No seeds, no randomness at runtime, no random tables. A map is fixed data in `js/maps/*.js`. The owner asks Claude to create or change maps; edit the data. One-off layout tools live outside the repo (scratchpad) and their output is baked into the map file.
- **Gridless and to scale.** One map unit = 1 foot. A Medium creature (an average person) is a 5-ft token; Tiny 2.5, Large 10, Huge 15, Gargantuan 20. Door 4–5 ft, interior wall ~1.6 ft, street 20–26 ft, lane 12–14 ft. Always respect real-world sizes, and make tokens usable on the city map as well as the site map.
- **Scope:** city level and below only (no continent or region maps). Demacia first; other regions later.
- **Lore:** researched from the official League of Legends Universe wiki. Tag every location/NPC as `c:1` canon or `c:0` invented; do not present invented material as canon. Paraphrase; credit Riot Games.
- Export must stay correct: VTT PNG is art only; resolution is "px per 5 ft"; max 16,000 px per side.
- Keep `README.md` accurate when behavior changes. Keep the app dependency-free and working offline.
- Do not put model identifiers in commits, PRs, code or files.

## Layout
`index.html`, `css/style.css`, `js/core.js` (helpers, creature sizes), `js/lore.js` (Demacia lore pack), `js/scene.js` (renderer: textures, furniture, buildings), `js/maps/crownguard.js` (hand-authored site, 200×130 ft), `js/maps/silvermere.js` (baked city, 2000×1300 ft), `js/app.js` (UI, tokens, ruler, export).
