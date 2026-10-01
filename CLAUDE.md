# Runeterra Atlas — instructions for Claude

Static site (no build step) hosted on GitHub Pages: https://fabiopego1.github.io/TTRPG-Testing/
Repo: `fabiopego1/ttrpg-testing`. Pages deploys from `main` via `.github/workflows/pages.yml`.

## Always ship every change to the hosted site
The owner has given standing permission. After **every** change to the project (maps, UI, README, anything), do all of this without asking:

1. Test it first: load `index.html` in headless Chromium (Playwright is installed) and confirm no page errors; for map or UI changes also take a screenshot and **look at it** (desktop and a ~390 px mobile viewport for UI changes).
2. Commit on a feature branch (never directly on `main`). Add the Co-Authored-By / Claude-Session lines from the session's attribution reminder.
3. Push the branch, open a PR into `main` (end the body with the PR attribution line), and **merge it** (squash). Merging to `main` triggers the deploy workflow.
4. Watch the **Deploy to GitHub Pages** run until it succeeds; if it fails, read the job logs, fix, and repeat from step 2. Then confirm the live site serves the new files (compare hashes with `curl`; the sandbox browser cannot open the live URL because of the proxy certificate — do not bypass TLS checks).
5. Tell the owner the change is live, with the link. If something blocks the deploy, say exactly what and what is needed.

The integration cannot re-run or dispatch workflows (403), so a deploy is triggered by merging a change to `main`.

## Map rules (read before drawing or changing any map)
- **Maps are authored data, not generated.** No seeds, no randomness at runtime, no random tables. A map is fixed data in `js/maps/*.js` (1 unit = 1 ft). The owner asks Claude to create or change maps; edit the data. One-off layout tools may live in the scratchpad, but their output is baked into the map file and the tool is not shipped.
- **Gridless and exactly to scale.** Every object must have a believable real-world size next to a person. A person is a **1.5-ft token** (an adult is ~18 in across the shoulders — about the width of a chair); Tiny 0.75, Large 3, Huge 6, Gargantuan 12. The 5-ft D&D "square" is the space a creature controls, not its body. **Audit every object against this table before shipping**, on both maps (chairs vs token, doors vs token, houses vs token): chair 1.5 · armchair 2.5 · sofa 6.5×2.8 · bed 4×6.5 · dining table 3.2 wide with 2.2 ft per diner (10 seats ≈ 9 ft) · work table 3 wide · desk 5×2.5 · bookcase 1.2 deep · barrel 2.2 · crate 2 · hearth opening 5–7 · interior door 3 · double door 5 · entrance 6 · window 3 · interior wall 1.2 · exterior wall 2 · city wall 10 · stair 5–6 wide, 1 ft tread · fountain 12 · market stall 8×6 · street 14–24 · house 20–30 ft frontage × 32–38 deep · noble house 40–56 · tower 22–24 across · raptor wingspan ~20 ft. Realistic room sizes too: kitchen ~19×22, library ~27×22, dining ~24×29, study ~21×22. If an object looks wrong next to a token, the object (or room) is wrong — fix it; do not enlarge or shrink the token to hide it. After changing a map, zoom to a room/street, place person tokens beside the furniture and **look** at the proportions.
- **Layouts must be logical, never scattered.** Think like a surveyor: streets first, then blocks, then houses facing the street with backyards behind them; rooms sized and connected for their use; doors where people would walk; furniture where it would stand. **Do not add random stuff.** Every object, building or decoration must either come from the lore or serve an obvious function in the scene. When unsure, leave it out.
- **Descriptions only.** Locations carry a name, a short factual description and a canon/invented tag. **No hooks, rumours, NPCs, encounter tables or other game content** unless the owner asks for them.
- **Scope:** city level and below only (no continent or region maps). Demacia first; other regions later.
- **Lore:** research the official League of Legends Universe wiki. Tag every location `c:1` (canon) or `c:0` (invented); never present invented material as canon. Paraphrase; credit Riot Games.
- Export must stay correct: VTT PNG is art only; resolution is "px per 5 ft"; max 16,000 px per side. Keep the app dependency-free and working offline (fonts degrade gracefully).
- Keep `README.md` accurate. Do not put model identifiers in commits, PRs, code or files.

## Layout of the repo
`index.html`, `css/style.css` (design system), `js/core.js` (helpers, creature sizes), `js/lore.js` (reference + sources), `js/scene.js` (renderer: textures, furniture, buildings), `js/maps/crownguard.js` (hand-authored site, 200×130 ft), `js/maps/silvermere.js` (baked city, 2000×1300 ft), `js/app.js` (UI, tokens, ruler, export).

## Current visual system (applies the design brief below to this atlas — Demacian direction)
Flat ink and stone surfaces (`--ink`, `--stone`), hairline rules, one gold accent (`--gold`: rules, canon, primary action) and one blue (`--blue`: selection). Display face Marcellus, body Alegreya Sans, mono IBM Plex Mono for dimensions. Sharp corners; primary buttons are notched (chamfered). Signature elements, reused everywhere: (1) masthead with heraldic mark and Roman-numeral chapters, (2) double-rule bracket frame + cartouche around the map, (3) numbered index with dotted leaders and canon ◆ / invented ◇ marks, (4) octagonal numeral plates for map markers, (5) rule-with-diamond divider. No cards, gradients, glow or rounded boxes. Keep these when changing the UI.

---

# Design brief (owner-supplied — apply to all site design work)

The brief below was written for the Runeterra character creator, and the owner asked that it guide this site's design too. Treat "character creator" as "this interface"; keep functionality unchanged unless a small structural change is needed for the visual design.

Redesign the existing Runeterra character creator's VISUAL DESIGN and USER INTERFACE.
This is a League of Legends / Runeterra tabletop RPG character-creation interface based on the Sentinels RPG system. The project already has its functionality and structure. Your job here is primarily VISUAL DESIGN, INTERFACE COMPOSITION, and ART DIRECTION.
Do not remove or change existing functionality, rules, data, interactions, or application logic unless a very small structural adjustment is necessary to achieve the visual design.
The final result should feel like a deliberately art-directed game interface from the world of Runeterra, not like an AI-generated SaaS dashboard or generic fantasy character creator.

## CORE GOAL
Make the website feel: authored, distinctive, immersive, game-like, editorial, tactile, visually hierarchical, strongly connected to Runeterra.
Avoid the common "AI website" aesthetic. Do NOT make it look like: a generic SaaS dashboard; a modern startup landing page; a generic fantasy RPG character sheet; a Tailwind component showcase; a card-heavy admin interface; a generic AI-generated website.

## MOST IMPORTANT RULE
Do not treat the interface as a collection of cards. Design the page as a visual composition.
Use: typography, spacing, alignment, dividers, rules, panels, side rails, framing, large/small visual areas, whitespace, controlled asymmetry, contextual decoration — to create hierarchy.
A card should exist because grouping information into a contained surface is useful, not because every section needs a rounded rectangle.

## RUNETERRA VISUAL IDENTITY
The interface should feel like it belongs to the world of League of Legends. Use Runeterra as the source of the visual language rather than generic "fantasy" styling.
It should visually suggest things such as: regions, factions, magic, technology, warfare, mythology, ancient civilizations, political identities, heroic champions, dangerous environments.
Do not simply place League of Legends imagery everywhere. The goal is subtle worldbuilding through UI design.
Use details such as: heraldic framing; faction-inspired geometry; regional motifs; engraved lines; map-like markings; ornamental dividers; technical markings; subtle parchment/metal/stone/ink-like visual qualities when appropriate; contextual symbols; restrained textures. These details should support the interface rather than overwhelm it.

## REGIONAL / FACTION VISUAL LANGUAGE
The UI should have a strong core Runeterra identity while allowing regional identity to influence the interface. Possible visual directions:
- DEMACIA: formal, structured, noble, heraldic, polished metal, stone, clean geometry, restrained ornamentation.
- NOXUS: militaristic, severe, aggressive geometry, darker surfaces, stronger red accents, dense information, iron/metal references.
- PILTOVER: refined, technical, precise, mechanical, brass/gold influence, geometric construction, technical labels and fine lines.
- ZAUN: industrial, asymmetrical, dense, improvised, worn materials, warning markings, chemical/industrial accents.
- IONIA: elegant, organic, restrained, flowing forms, ink/brush influences, natural asymmetry, subtle ornamental details.
- SHURIMA: ancient, monumental, geometric, sun/stone/sand influences, archaeological/ritual visual language.
- FRELJORD: austere, rugged, large shapes, cold materials, weathered surfaces, strong contrast.
- SHADOW ISLES: dark, spectral, sparse, worn, atmospheric, subtle supernatural details.
- VOID: alien, unnatural, asymmetrical, organic geometry, restrained distortion.
These are visual references, not rigid requirements. Choose what actually fits the interface and its current content.

## AVOID GENERIC AI DESIGN PATTERNS
Do NOT use these unless there is an extremely strong contextual reason: purple/blue gradient backgrounds; generic neon gradients; glassmorphism; excessive blur; glowing borders everywhere; excessive drop shadows; huge rounded cards; giant pills; icon inside circular colored background + title + description; repeated 3-card layouts; excessive floating UI; random abstract blobs; random circles; random decorative particles; random gradient text; generic "hero section"; excessive centered content; identical cards repeated for every section; excessive use of border-radius; generic dashboard sidebars; generic SaaS navigation; arbitrary visual decoration.
Changing purple to red does NOT solve the problem. Changing the font does NOT solve the problem. The composition itself needs to be distinctive.

## TYPOGRAPHY
Typography should feel intentional and game/editorial rather than generic SaaS. Do not automatically use Inter, Roboto, Arial, or another default UI font just because it is safe. Choose a strong display typeface appropriate to Runeterra and pair it with a highly readable UI/body typeface. Use no more than: 1 display typeface, 1 body/interface typeface, optional monospace for technical/statistical information.
Create an intentional hierarchy between: world/region labels; character name; character epithet/title; section headings; attribute labels; body text; metadata; small UI labels. Use typography itself to establish hierarchy instead of putting everything inside containers.

## LAYOUT
Avoid excessive symmetry. Do not automatically center everything. Use a strong layout grid, but allow deliberate asymmetry. Possible approaches: large character visual on one side + information on the other; narrow metadata rail; large typography balanced against dense information; asymmetric two-column compositions; side information rails; staggered sections; full-width dividers; large visual breaks between major stages; controlled overlap; variable content density. The composition should feel intentional. Do not create random asymmetry just to appear creative.

## VISUAL RHYTHM
The page should have changes in density. Do not make every section feel identical. For example: large character/identity area → concise identity information → dense mechanical selection → spacious narrative section → dense stats/traits → final character summary. Use whitespace intentionally. Some areas should breathe. Other areas should be information-dense.

## SHAPE LANGUAGE
Establish a deliberate shape system. Do NOT give every element a giant rounded corner. Use a combination of: sharp or near-sharp panels; subtle-radius controls; thin borders; framed important elements; rules/dividers; occasional distinctive shapes. The project should have a recognizable silhouette even before the user reads the content.

## COLOR
Create a restrained color system. Start from a strong Runeterra-inspired neutral foundation and use accent colors intentionally. Define: background, elevated surface, secondary surface, primary text, secondary text, border, accent, selected state, warning/error, success state. Do not use color merely for decoration. Accent color should have meaning. For example, region/faction identity can influence accents without turning the entire interface into a rainbow.

## SURFACES
Do not make every section look like a separate floating object. Use a mixture of: open sections; flat surfaces; framed panels; subtle surface changes; rules; separators; contained controls. The interface should feel like one designed environment rather than dozens of independent floating boxes.

## BORDERS AND DIVIDERS
Borders should contribute to the visual identity. Consider: fine rules; double-line treatments; ornamental separators; faction-inspired geometry; subtle framing; inset lines. Do not put a border around every element.

## DECORATION
Decoration must have a reason. Prefer Runeterra-specific visual motifs over generic decorative graphics. Good examples: heraldic marks; map symbols; regional geometry; engraved lines; subtle magical motifs; faction insignia; ancient markings; technical schematics; ritual symbols; military markings. Bad examples: random blobs; random glowing dots; generic stars; abstract waves; floating circles; decorative gradients with no narrative purpose. Every decorative element should either reinforce hierarchy, worldbuilding, or interaction.

## CHARACTER CREATION SHOULD FEEL LIKE A JOURNEY
The interface should communicate progression. The player should visually understand: 1. Where they are; 2. What they are choosing; 3. What they have already selected; 4. What remains; 5. What their character is becoming. Create a strong sense of progression without turning the page into a generic wizard. A progression rail, chapter structure, regional markers, or other distinctive navigation system can be used if appropriate. Do not automatically use a standard SaaS stepper.

## CHARACTER IDENTITY
The character itself should feel visually important. The character name, origin, region, role, and defining choices should have significantly greater visual weight than secondary information. Look for opportunities to create a strong identity composition around: character name; epithet; region; ancestry/background; role; portrait; major traits. The result should feel closer to a game character dossier, codex entry, or high-quality RPG character creation screen than to a web form.

## INFORMATION DESIGN
Do not hide important information inside layers of cards. Use typography and layout to distinguish: PRIMARY: character identity and major choices; SECONDARY: mechanical details and supporting information; TERTIARY: metadata, explanations, helper text. The most important information should be visible immediately.

## FORM CONTROLS
Forms should still feel like part of Runeterra. Avoid generic: SaaS dropdowns; huge rounded inputs; giant pill buttons; generic checkbox cards. Where appropriate, use: framed selections; engraved-looking selectors; faction markers; compact labels; strong selected states; clear visual hierarchy; contextual symbols. Interactions must remain easy to understand and accessible.

## BUTTONS
Buttons should have a distinct identity. Do not use "rounded rectangle + gradient + glow" for everything. Create a restrained button system with meaningful hierarchy: primary action; secondary action; subtle action; destructive action. The primary action should visually belong to the Runeterra design language.

## ICONOGRAPHY
Use one coherent icon style. Avoid mixing: random outline icons; random filled icons; emoji; unrelated icon libraries. Icons should look as though they belong to the same game/interface.

## MOTION
Use subtle motion only where it improves hierarchy or feedback. Good uses: selection transitions; panel transitions; hover states; progress transitions; subtle reveal animations. Avoid: constant floating motion; excessive glow animation; unnecessary parallax; animation everywhere. The interface should still look strong when completely static.

## SIGNATURE DESIGN ELEMENTS
Create 2–4 memorable visual elements that become part of this project's identity. Examples: a distinctive character portrait frame; a regional marker system; a unique section divider; a characteristic progression rail; a distinctive typography treatment for character names; a special attribute/stat presentation; a recognizable tab/navigation system. These should be reused consistently. The objective is that someone can see a screenshot and recognize: "This is the Runeterra RPG character creator."

## RESPONSIVE DESIGN
Keep the design fully responsive. Do not simply shrink the desktop design. At smaller widths: recomposition is allowed; columns can collapse; side rails can become horizontal sections; visual hierarchy must remain intact; important information must remain prominent; typography should scale appropriately; controls must remain usable. Preserve the visual identity on both desktop and mobile.

## DESIGN AUDIT
After implementing the redesign, inspect the result and explicitly audit it for these problems: 1. Too many cards; 2. Too much symmetry; 3. Too many rounded rectangles; 4. Generic typography; 5. Generic dashboard patterns; 6. Excessive gradients; 7. Excessive glow; 8. Excessive shadows; 9. Decorative elements with no purpose; 10. Insufficient Runeterra identity; 11. Uniform information density; 12. Weak visual hierarchy; 13. Too much centered content; 14. Components that look copied from a generic UI kit; 15. Lack of memorable visual identity. Remove or redesign anything that triggers these problems.

## HUMAN-DESIGN TEST
After finishing, answer these questions internally while reviewing the result: Would this still look appropriate if the logo and title were replaced with a crypto startup? Can the interface be visually recognized as a Runeterra project without reading the text? Are there at least 3 distinctive design decisions that belong specifically to this project? Does the interface have a clear visual hierarchy? Does every major section feel intentionally composed? Are cards being used because they are useful, rather than because they are the default? Does the interface feel like a game/worldbuilding product rather than a web dashboard? If any answer indicates the design is generic, continue refining it.

## IMPLEMENTATION PROCESS
Before modifying the code: 1. Inspect the existing HTML/CSS/JS structure. 2. Identify the current visual language. 3. Identify existing components that should be preserved. 4. Identify the most obvious generic/AI-looking patterns. 5. Establish the new Runeterra visual direction. 6. Establish the design tokens. 7. Redesign the overall composition. 8. Apply the new visual system consistently. 9. Review desktop and mobile. 10. Perform the AI-design audit above. 11. Remove anything that still feels generic. Do not blindly rewrite everything. Preserve useful existing work and functionality.

## FINAL PRINCIPLE
Do not make the site "fancier." Make it more intentional. Do not add decoration just to make it look designed. Make the typography, composition, spacing, materials, color, hierarchy, and visual motifs communicate: RUNETERRA + TABLETOP RPG + CHARACTER CREATION + A SPECIFIC, AUTHORIAL VISUAL IDENTITY. The final interface should look like an actual designed game product with its own art direction, rather than an AI-generated website assembled from familiar UI patterns.
