/* Demacia battle maps: tile engine + 7 scenario generators (36x24 grid, 5 ft squares). Overrides RT.renderBattle. */
(function (RT) {
  const C = 40, COLS = 36, ROWS = 24, OX = 80, OY = 20;
  RT.BATTLE = { cols: COLS, rows: ROWS, cell: C, ox: OX, oy: OY };
  const INK = '#2a1d10';
  const hx = (x, y) => (Math.imul(x + 7, 73856093) ^ Math.imul(y + 13, 19349663)) >>> 0;

  // key: [name, rule, base color(s), draw(x,y,h)]  — x,y are the cell's pixel origin
  const T = {
    grass: ['Grass', 'Open ground.', ['#a9c46c', '#9fbb62', '#b3cd77'], (x, y, h) => `<path d="M${x + 8 + h % 7} ${y + 30}l2 -6l2 6M${x + 24 - h % 5} ${y + 14}l2 -6l2 6" stroke="#6c8a45" stroke-width="1.6" fill="none"/>`],
    dirt: ['Dirt road', 'Open ground. Wagon ruts: wheeled movement is easy.', ['#cdb98f', '#c4af85'], (x, y, h) => `<circle cx="${x + 10 + h % 15}" cy="${y + 12 + h % 11}" r="1.8" fill="#9c8760"/><circle cx="${x + 28 - h % 9}" cy="${y + 28 - h % 7}" r="1.5" fill="#9c8760"/>`],
    cobble: ['Cobblestone', 'Open ground.', ['#cbc6b8', '#c3beb0'], (x, y) => `<path d="M${x + 2} ${y + 13}H${x + C - 2}M${x + 2} ${y + 27}H${x + C - 2}M${x + 14} ${y + 2}V${y + 13}M${x + 26} ${y + 13}V${y + 27}M${x + 12} ${y + 27}V${y + 38}" stroke="#8d8878" stroke-width="1.3" fill="none" opacity=".7"/>`],
    marble: ['Marble floor', 'Open ground. Polished: Stealth checks make noise (disadvantage).', ['#efebe0'], (x, y) => `<rect x="${x + 3}" y="${y + 3}" width="${C - 6}" height="${C - 6}" fill="none" stroke="#c8aa6e" stroke-width="1.4" opacity=".6"/>`],
    petri: ['Petricite floor', 'Magic-dampening stone. Suggested rule: spellcasting here has disadvantage, and spells of 2nd level or lower fail unless the caster beats DC 13 Arcana.', ['#dfe0e2', '#d6d8db'], (x, y, h) => `<circle cx="${x + 9 + h % 20}" cy="${y + 10 + h % 15}" r="1.3" fill="#9fa4ac"/><circle cx="${x + 28 - h % 11}" cy="${y + 30 - h % 9}" r="1.1" fill="#9fa4ac"/><path d="M${x + 2} ${y + 2}H${x + C - 2}V${y + C - 2}H${x + 2}Z" fill="none" stroke="#b3b7be" stroke-width=".9"/>`],
    stone: ['Stone floor', 'Open ground.', ['#8b8f97', '#848890'], (x, y) => `<path d="M${x} ${y + 20}H${x + C}M${x + 20} ${y}V${y + C}" stroke="#6a6e76" stroke-width="1" opacity=".5"/>`],
    ffloor: ['Forest floor', 'Open ground; leaf litter hides tracks (+2 to Survival tracking checks).', ['#6f8c57', '#68854f'], (x, y, h) => `<ellipse cx="${x + 10 + h % 18}" cy="${y + 12 + h % 13}" rx="4" ry="2" fill="#4f6f3b" opacity=".7"/>`],
    rock: ['Rocky ground', 'Open ground. Loose scree: Dash on it requires DC 10 Dex save or fall prone.', ['#a29d92', '#9a958a'], (x, y, h) => `<path d="M${x + 6 + h % 8} ${y + 28}l8 -9l6 5" stroke="#6f6a60" stroke-width="1.4" fill="none"/>`],
    sand: ['Sand / shingle', 'Difficult terrain for wheeled movement; open ground otherwise.', ['#e3d6a8', '#dccf9f'], (x, y, h) => `<circle cx="${x + 10 + h % 20}" cy="${y + 12 + h % 15}" r="1.3" fill="#b8a874"/>`],
    water: ['Shallow water', 'Difficult terrain. Athletics DC 10 to swim in current; heavy armor is a penalty.', ['#79adc3'], (x, y) => `<path d="M${x + 8} ${y + 20}q4 -5 8 0t8 0t8 0" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>`],
    deep: ['Deep water', 'Swim: Athletics DC 13 each round or sink. Ships and piers cross here.', ['#4f89a6'], (x, y) => `<path d="M${x + 6} ${y + 14}q4 -5 8 0t8 0t8 0M${x + 8} ${y + 28}q4 -5 8 0t8 0" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>`],
    chasm: ['Chasm / sheer drop', 'Fall: 6d6 bludgeoning (60 ft); a flying creature is unaffected. Wind: Str DC 12 near the edge.', ['#17202c', '#1c2734'], (x, y) => `<circle cx="${x + 20}" cy="${y + 20}" r="12" fill="none" stroke="#2c3a4c" stroke-width="1.5"/><circle cx="${x + 20}" cy="${y + 20}" r="5" fill="none" stroke="#2c3a4c" stroke-width="1.2"/>`],
    wall: ['Petricite wall', 'Impassable; blocks line of sight. AC 18, 60 HP per 5-ft section. Climb DC 18.', ['#dcdad2'], (x, y) => `<path d="M${x} ${y + 13}H${x + C}M${x} ${y + 27}H${x + C}M${x + 12} ${y}V${y + 13}M${x + 28} ${y + 13}V${y + 27}M${x + 10} ${y + 27}V${y + C}" stroke="#a7a498" stroke-width="1.6"/><rect x="${x + 1}" y="${y + 1}" width="${C - 2}" height="${C - 2}" fill="none" stroke="#7d796d" stroke-width="2"/>`],
    roof: ['Building (roof)', 'Impassable from outside; blocks line of sight.', ['#b4c6dd', '#a4b9d4', '#c9d6e8', '#e8e0c4', '#9fb2cf'], (x, y, h) => `<path d="M${x} ${y + 10}H${x + C}M${x} ${y + 20}H${x + C}M${x} ${y + 30}H${x + C}" stroke="#6f87a8" stroke-width="1.5"/><rect x="${x + .5}" y="${y + .5}" width="${C - 1}" height="${C - 1}" fill="none" stroke="#4a5f80" stroke-width="1.2"/>`],
    rampart: ['Rampart walkway', 'Elevated 10 ft. Half cover from the parapet. Reach it by stairs only.', ['#d9d6cc'], (x, y) => `<path d="M${x} ${y + 6}H${x + C}M${x} ${y + C - 6}H${x + C}" stroke="#8d8878" stroke-width="2"/>`],
    tower: ['Tower', 'Impassable. Arrow slits give archers three-quarters cover.', ['#cfccc2'], (x, y) => `<circle cx="${x + 20}" cy="${y + 20}" r="17" fill="#e7e4da" stroke="#6f6b60" stroke-width="2.5"/><circle cx="${x + 20}" cy="${y + 20}" r="7" fill="#c8aa6e" stroke="#6f6b60" stroke-width="1.5"/>`],
    gate: ['Gate', 'Iron-bound double gate. Open/close as an action (DC 12 Str or Dex); break: AC 17, 50 HP.', ['#cfccc2'], (x, y) => `<rect x="${x + 3}" y="${y + 3}" width="${C - 6}" height="${C - 6}" fill="#8a6a42" stroke="#4a3822" stroke-width="2"/><path d="M${x + 20} ${y + 3}V${y + C - 3}M${x + 3} ${y + 14}H${x + C - 3}M${x + 3} ${y + 27}H${x + C - 3}" stroke="#c8aa6e" stroke-width="1.6"/>`],
    door: ['Door', 'Opening or closing: object interaction. Locked: DC 15 thieves’ tools or DC 18 Str.', ['#9a8458'], (x, y) => `<rect x="${x + 4}" y="${y + 4}" width="${C - 8}" height="${C - 8}" fill="#7a5c34" stroke="#3a2a14" stroke-width="2"/><circle cx="${x + 28}" cy="${y + 20}" r="2.2" fill="#c8aa6e"/>`],
    hedge: ['Hedge', 'Difficult terrain; half cover. Dense: a creature can push through at 2× cost.', ['#9db860'], (x, y, h) => `<circle cx="${x + 12}" cy="${y + 12}" r="9" fill="#4a7a3a" stroke="#2a4a22" stroke-width="1.4"/><circle cx="${x + 28}" cy="${y + 14}" r="9" fill="#4a7a3a" stroke="#2a4a22" stroke-width="1.4"/><circle cx="${x + 20}" cy="${y + 28}" r="10" fill="#538544" stroke="#2a4a22" stroke-width="1.4"/>`],
    tree: ['Tree', 'Trunk (5 ft square) blocks movement; the 15-ft canopy gives half cover. Climb: Athletics DC 12.', ['#a1bc66'], (x, y) => `<circle cx="${x + 20}" cy="${y + 20}" r="4" fill="#6d4c2a"/>`],
    pine: ['Pine', 'Trunk (5 ft square) blocks movement; the 10-ft canopy gives half cover.', ['#8fb06a'], (x, y) => `<circle cx="${x + 20}" cy="${y + 20}" r="3" fill="#6d4c2a"/>`],
    boulder: ['Boulder', 'Impassable; half cover for Medium, full for Small. Climb DC 13.', ['#a29d92'], (x, y) => `<path d="M${x + 7} ${y + 30}L${x + 10} ${y + 12}L${x + 22} ${y + 6}L${x + 34} ${y + 14}L${x + 33} ${y + 30}Z" fill="#8d8982" stroke="#4a463f" stroke-width="2"/>`],
    fountain: ['Fountain', '10×10 ft basin. Impassable; half cover. The water is shallow — a creature can wade in (difficult terrain).', ['#cbc6b8'], () => ''],
    statue: ['Statue', 'Impassable; three-quarters cover for Medium. DC 14 Athletics to topple (2d6 bludgeoning).', ['#cbc6b8'], (x, y) => `<rect x="${x + 11}" y="${y + 24}" width="18" height="12" fill="#bfbcb0" stroke="#6f6b60" stroke-width="1.8"/><path d="M${x + 20} ${y + 6}L${x + 26} ${y + 24}H${x + 14}Z" fill="#f4f1e6" stroke="#6f6b60" stroke-width="1.8"/><circle cx="${x + 20}" cy="${y + 9}" r="4" fill="#fff" stroke="#6f6b60" stroke-width="1.5"/>`],
    stall: ['Market stall', 'Impassable; half cover. Can be overturned (Str DC 12) to make 10-ft difficult terrain of fruit and splinters.', ['#cbc6b8'], (x, y, h) => `<rect x="${x + 4}" y="${y + 6}" width="${C - 8}" height="${C - 12}" fill="${['#d1403a', '#3b6fb0', '#e0b94a'][h % 3]}" stroke="#2a1d10" stroke-width="2"/><path d="M${x + 4} ${y + 6}L${x + 12} ${y + 14}L${x + 20} ${y + 6}L${x + 28} ${y + 14}L${x + 36} ${y + 6}" fill="none" stroke="#fff" stroke-width="1.6"/>`],
    crate: ['Crate', 'Half cover. Climbable: counts as difficult terrain. Search DC 12 for goods.', null, (x, y) => `<rect x="${x + 5}" y="${y + 5}" width="${C - 10}" height="${C - 10}" fill="#7a643c" stroke="#3a2f1b" stroke-width="2"/><path d="M${x + 5} ${y + 5}L${x + C - 5} ${y + C - 5}M${x + C - 5} ${y + 5}L${x + 5} ${y + C - 5}" stroke="#3a2f1b" stroke-width="1.8"/>`],
    barrel: ['Barrel', 'Half cover. Oil or ale (DM’s choice); a thrown torch ignites oil (2d6 fire, 10-ft burst).', null, (x, y) => `<circle cx="${x + 20}" cy="${y + 20}" r="14" fill="#8a6a42" stroke="#3a2a14" stroke-width="2"/><circle cx="${x + 20}" cy="${y + 20}" r="9" fill="none" stroke="#3a2a14" stroke-width="1.3"/>`],
    cart: ['Wagon', 'Impassable; half cover (10×5 ft). Overturning needs Str DC 15; upturned wheels give three-quarters cover.', ['#cdb98f'], () => ''],
    bench: ['Bench', 'Half cover; difficult to climb over.', null, (x, y) => `<rect x="${x + 4}" y="${y + 14}" width="${C - 8}" height="12" fill="#8a6a42" stroke="#3a2a14" stroke-width="1.8"/>`],
    table: ['Table', 'Half cover. Can be flipped as a bonus action (Str DC 11) for three-quarters cover.', null, (x, y) => `<rect x="${x + 4}" y="${y + 6}" width="${C - 8}" height="${C - 12}" rx="3" fill="#7a643c" stroke="#3a2f1b" stroke-width="2"/>`],
    desk: ['Desk', 'Half cover. Drawers: Investigation DC 12 for papers.', null, (x, y) => `<rect x="${x + 4}" y="${y + 8}" width="${C - 8}" height="${C - 16}" fill="#8a6a42" stroke="#3a2a14" stroke-width="2"/><rect x="${x + 8}" y="${y + 12}" width="10" height="8" fill="#f4f1e6" stroke="#3a2a14" stroke-width="1"/>`],
    shelf: ['Bookshelf', 'Impassable; half cover. Toppling (Str DC 13) deals 2d6 and makes difficult terrain.', ['#8b8f97'], (x, y) => `<rect x="${x + 3}" y="${y + 4}" width="${C - 6}" height="${C - 8}" fill="#6d4c2a" stroke="#2a1d10" stroke-width="2"/>` + [0, 1, 2].map(i => `<path d="M${x + 5} ${y + 11 + i * 8}H${x + C - 5}" stroke="#2a1d10" stroke-width="1"/><rect x="${x + 7 + i * 8}" y="${y + 6 + i * 8}" width="5" height="5" fill="${['#a33', '#36a', '#c8aa6e'][i]}"/>`).join('')],
    pillar: ['Marble pillar', 'Impassable; three-quarters cover.', null, (x, y) => `<circle cx="${x + 20}" cy="${y + 20}" r="12" fill="#f4f1e6" stroke="#6f6b60" stroke-width="2.4"/><circle cx="${x + 20}" cy="${y + 20}" r="6" fill="none" stroke="#c8aa6e" stroke-width="1.4"/>`],
    brazier: ['Brazier', 'Bright light 20 ft. Contact: 1d6 fire. Can be kicked over (DC 10 Str) to start a fire.', null, (x, y) => `<circle cx="${x + 20}" cy="${y + 20}" r="9" fill="#3a2f2f" stroke="#2a1d10" stroke-width="2"/><circle cx="${x + 20}" cy="${y + 20}" r="6" fill="#ffb347"/><circle cx="${x + 20}" cy="${y + 18}" r="3" fill="#ffe08a"/>`],
    pier: ['Wooden pier', 'Open ground. Slick when wet: Dex DC 10 when dashing.', ['#9a7a50'], (x, y) => `<path d="M${x} ${y + 8}H${x + C}M${x} ${y + 20}H${x + C}M${x} ${y + 32}H${x + C}" stroke="#5a4028" stroke-width="1.6"/>`],
    deck: ['Ship deck', 'Open ground; pitches slightly: DC 10 Acrobatics on Dash in rough seas.', ['#8a6a42', '#7f6038'], (x, y) => `<path d="M${x} ${y + 10}H${x + C}M${x} ${y + 22}H${x + C}M${x} ${y + 34}H${x + C}" stroke="#4a3822" stroke-width="1.4"/>`],
    mast: ['Mast & rigging', 'Impassable; climb DC 10. Cutting the rigging (AC 11, 10 HP) drops a net: Dex DC 13 or restrained.', ['#8a6a42'], (x, y) => `<circle cx="${x + 20}" cy="${y + 20}" r="9" fill="#5a3d28" stroke="#2a1d10" stroke-width="2"/><path d="M${x + 4} ${y + 20}H${x + 36}" stroke="#2a1d10" stroke-width="1.5"/>`],
    rail: ['Ship rail', 'Half cover; a creature can vault it (DC 10 Athletics).', ['#8a6a42'], (x, y) => `<rect x="${x + 2}" y="${y + 2}" width="${C - 4}" height="${C - 4}" fill="none" stroke="#3a2a14" stroke-width="4"/>`],
    bars: ['Iron bars', 'Impassable but see-through; ranged attacks pass with half cover. Bend: Str DC 24.', ['#e0e0e2'], (x, y) => `<rect x="${x + 1}" y="${y + 1}" width="${C - 2}" height="${C - 2}" fill="none" stroke="#6a6e76" stroke-width="2"/>` + [8, 16, 24, 32].map(v => `<path d="M${x + v} ${y}V${y + C}" stroke="#5a5e66" stroke-width="3"/>`).join('')],
    pallet: ['Pallet bed', 'Difficult terrain; a prisoner may be lying here.', ['#dfe0e2'], (x, y) => `<rect x="${x + 6}" y="${y + 8}" width="${C - 12}" height="${C - 16}" rx="3" fill="#b5a58a" stroke="#4a3822" stroke-width="1.8"/>`],
    stairs: ['Stairs', 'Climbing between levels costs no extra movement but counts as difficult terrain.', ['#d3cfc2'], (x, y) => [6, 14, 22, 30].map(v => `<path d="M${x + 3} ${y + v}H${x + C - 3}" stroke="#6f6b60" stroke-width="2"/>`).join('')],
    nest: ['Raptor nest', 'Difficult terrain. Eggs: a creature within 5 ft draws the parents’ attention.', ['#a29d92'], (x, y) => `<circle cx="${x + 20}" cy="${y + 20}" r="14" fill="#8a6a42" stroke="#3a2a14" stroke-width="2"/><ellipse cx="${x + 20}" cy="${y + 20}" rx="5" ry="7" fill="#e8f2f8" stroke="#6f87a8" stroke-width="1.5"/>`],
    rubble: ['Rubble', 'Difficult terrain; half cover.', null, (x, y) => `<path d="M${x + 6} ${y + 30}l6 -12l8 6l8 -10l6 16z" fill="#9a927c" stroke="#4a463f" stroke-width="1.6"/>`],
    flowers: ['Flower bed', 'Open ground — but nobles object loudly to trampling.', ['#9fbb62'], (x, y, h) => `<circle cx="${x + 10}" cy="${y + 10}" r="3.5" fill="#e48fb5"/><circle cx="${x + 28}" cy="${y + 14}" r="3.5" fill="#f0c74a"/><circle cx="${x + 16}" cy="${y + 28}" r="3.5" fill="#fff"/><circle cx="${x + 30}" cy="${y + 30}" r="3.5" fill="#e48fb5"/>`],
    bridge: ['Stone bridge', 'A chokepoint; two Medium creatures abreast. Low parapet: half cover.', ['#cbc6b8'], (x, y) => `<path d="M${x} ${y + 4}H${x + C}M${x} ${y + C - 4}H${x + C}" stroke="#6f6b60" stroke-width="4"/>`],
    emblem: ['Floor emblem', 'The Demacian eagle inlaid in gold. Open ground.', ['#efebe0'], (x, y) => `<path d="M${x + 4} ${y + 20}Q${x + 12} ${y + 8} ${x + 20} ${y + 18}Q${x + 28} ${y + 8} ${x + 36} ${y + 20}Q${x + 28} ${y + 16} ${x + 20} ${y + 32}Q${x + 12} ${y + 16} ${x + 4} ${y + 20}Z" fill="#c8aa6e" opacity=".8"/>`],
    ballista: ['Ballista', 'Impassable; half cover. Operate (action): +6 to hit, 3d10 piercing, range 120/480 ft.', ['#d9d6cc'], (x, y) => `<path d="M${x + 6} ${y + 10}H${x + 34}M${x + 20} ${y + 10}V${y + 34}" stroke="#3a2a14" stroke-width="3"/><path d="M${x + 6} ${y + 10}Q${x + 20} ${y + 2} ${x + 34} ${y + 10}" fill="none" stroke="#6d4c2a" stroke-width="2.5"/>`],
    waterfall: ['Waterfall', 'Impassable falls. A creature within 5 ft: Str DC 13 or be drenched and pushed 10 ft.', ['#cfe7f2'], (x, y) => [10, 20, 30].map(v => `<path d="M${x + v} ${y + 2}V${y + 38}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`).join('')]
  };
  RT.TILES = T;
  const baseCol = (t, h) => { const c = T[t][2]; return c ? c[h % c.length] : null; };

  // ---- grid helpers ----
  const mk = fill => Array.from({ length: ROWS }, () => Array(COLS).fill(fill));
  const inb = (x, y) => x >= 0 && y >= 0 && x < COLS && y < ROWS;
  const put = (g, x, y, t) => { if (inb(x, y)) g[y][x] = t; };
  const rect = (g, x0, y0, x1, y1, t) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(g, x, y, t); };
  const outline = (g, x0, y0, x1, y1, t) => { for (let x = x0; x <= x1; x++) { put(g, x, y0, t); put(g, x, y1, t); } for (let y = y0; y <= y1; y++) { put(g, x0, y, t); put(g, x1, y, t); } };
  const scatter = (g, r, n, t, ok) => { let k = 0, tr = 0; while (k < n && tr++ < n * 40) { const x = Math.floor(r() * COLS), y = Math.floor(r() * ROWS); if (ok(g[y][x], x, y)) { g[y][x] = t; k++; } } };

  const SC = {
    cloudwoods(seed) {
      const r = RT.rng(seed + 'cw'), nz = RT.noise(seed + 'cwn'), g = mk('grass');
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const v = nz(x / 5, y / 5, 3); if (v > .5) g[y][x] = 'ffloor'; if (v > .57 && r() < .6) g[y][x] = r() < .25 ? 'pine' : 'tree'; }
      let ry = 9 + Math.floor(r() * 5); const road = [];
      for (let x = 0; x < COLS; x++) { ry = RT.clamp(ry + (r() < .3 ? -1 : r() < .6 ? 0 : 1), 6, 17); road.push(ry); for (let d = -1; d <= 1; d++) put(g, x, ry + d, 'dirt'); }
      const sx = 22 + Math.floor(r() * 5); for (let y = 0; y < ROWS; y++) { put(g, sx, y, 'water'); put(g, sx + 1, y, 'water'); }
      for (let d = -1; d <= 1; d++) { put(g, sx, road[sx] + d, 'bridge'); put(g, sx + 1, road[sx] + d, 'bridge'); }
      const cx = 12 + Math.floor(r() * 4), cy = road[cx]; put(g, cx, cy, 'cart'); put(g, cx + 1, cy, 'cart'); put(g, cx - 1, cy + 1, 'crate'); put(g, cx + 2, cy - 1, 'barrel'); put(g, cx + 2, cy + 1, 'crate');
      for (let x = 0; x < COLS; x++) for (let d = -2; d <= 2; d++) { const c = g[road[x] + d] && g[road[x] + d][x]; if ((c === 'tree' || c === 'pine') && Math.abs(d) <= 1) g[road[x] + d][x] = 'dirt'; }
      scatter(g, r, 9, 'boulder', c => c === 'grass' || c === 'ffloor'); scatter(g, r, 6, 'hedge', c => c === 'grass');
      put(g, 6, road[6] - 3, 'statue'); return g;
    },
    custodian(seed) {
      const r = RT.rng(seed + 'cu'), g = mk('rock');
      rect(g, 6, 12, 29, 23, 'cobble'); rect(g, 0, 0, 2, 23, 'chasm'); rect(g, 33, 0, 35, 23, 'chasm'); rect(g, 0, 9, 5, 11, 'wall'); rect(g, 30, 9, 35, 11, 'wall');
      for (let y = 0; y < 9; y++) for (let x = 14; x <= 21; x++) g[y][x] = 'dirt';
      rect(g, 3, 9, 32, 9, 'wall'); rect(g, 3, 10, 32, 10, 'rampart'); rect(g, 3, 11, 32, 11, 'wall');
      rect(g, 3, 9, 5, 11, 'tower'); rect(g, 30, 9, 32, 11, 'tower');
      rect(g, 16, 9, 19, 9, 'gate'); rect(g, 16, 10, 19, 11, 'cobble');
      put(g, 7, 12, 'stairs'); put(g, 28, 12, 'stairs'); put(g, 7, 11, 'stairs'); put(g, 28, 11, 'stairs');
      rect(g, 8, 15, 14, 19, 'roof'); put(g, 11, 20, 'door'); rect(g, 21, 15, 27, 19, 'roof'); put(g, 24, 20, 'door');
      put(g, 11, 10, 'ballista'); put(g, 24, 10, 'ballista'); put(g, 17, 14, 'brazier'); put(g, 18, 14, 'brazier');
      scatter(g, r, 8, 'crate', c => c === 'cobble'); scatter(g, r, 5, 'barrel', c => c === 'cobble');
      scatter(g, r, 14, 'boulder', (c, x, y) => c === 'rock' && y < 8); scatter(g, r, 7, 'rubble', (c, x, y) => c === 'rock' && y < 9); scatter(g, r, 6, 'pine', (c, x, y) => c === 'rock' && y < 9 && x > 3 && x < 33);
      scatter(g, r, 3, 'pine', (c, x, y) => c === 'rock' && y > 12); return g;
    },
    plaza(seed) {
      const r = RT.rng(seed + 'pl'), g = mk('roof');
      rect(g, 11, 6, 24, 17, 'marble'); rect(g, 15, 0, 20, 23, 'cobble'); rect(g, 0, 10, 35, 13, 'cobble'); rect(g, 10, 5, 25, 18, 'cobble'); rect(g, 11, 6, 24, 17, 'marble');
      put(g, 17, 11, 'fountain'); put(g, 18, 11, 'fountain'); put(g, 17, 12, 'fountain'); put(g, 18, 12, 'fountain');
      rect(g, 17, 8, 18, 8, 'emblem'); rect(g, 17, 15, 18, 15, 'emblem');
      [[12, 7], [23, 7], [12, 16], [23, 16]].forEach(s => put(g, s[0], s[1], 'statue'));
      for (let x = 12; x < 24; x += 3) { put(g, x, 6, 'pillar'); put(g, x, 17, 'pillar'); }
      scatter(g, r, 9, 'stall', (c, x, y) => c === 'cobble' && (x < 14 || x > 21) && y > 3 && y < 20 && (y < 10 || y > 13));
      scatter(g, r, 4, 'bench', c => c === 'marble'); scatter(g, r, 5, 'crate', c => c === 'cobble'); scatter(g, r, 3, 'barrel', c => c === 'cobble');
      [6, 29].forEach(ax => { for (let y = 0; y < ROWS; y++) if (g[y][ax] === 'roof') g[y][ax] = 'cobble'; }); [3, 20].forEach(ay => { for (let x = 0; x < COLS; x++) if (g[ay][x] === 'roof') g[ay][x] = 'cobble'; });
      scatter(g, r, 14, 'wall', c => c === 'roof'); scatter(g, r, 6, 'tree', c => c === 'cobble' && false); scatter(g, r, 8, 'barrel', (c, x, y) => c === 'cobble' && (x === 6 || x === 29 || y === 3 || y === 20));
      for (let x = 1; x < 34; x++) for (const y of [0, 23]) if (g[y][x] === 'roof' && r() < .05) g[y][x] = 'door';
      [[5, 9], [5, 14], [30, 9], [30, 14], [13, 4], [22, 4], [13, 19], [22, 19]].forEach(d => { if (g[d[1]] && g[d[1]][d[0]] === 'roof') g[d[1]][d[0]] = 'door'; });
      return g;
    },
    mageseekers(seed) {
      const r = RT.rng(seed + 'ms'), g = mk('petri');
      outline(g, 0, 0, 35, 23, 'wall'); rect(g, 1, 7, 29, 7, 'wall'); rect(g, 1, 16, 29, 16, 'wall');
      for (let i = 0; i < 5; i++) { const x0 = 1 + i * 6; rect(g, x0 + 5, 1, x0 + 5, 7, 'wall'); rect(g, x0 + 5, 16, x0 + 5, 22, 'wall'); for (let k = 0; k < 5; k++) { put(g, x0 + k, 7, 'bars'); put(g, x0 + k, 16, 'bars'); } put(g, x0 + 2, 7, 'door'); put(g, x0 + 2, 16, 'door'); put(g, x0 + 1, 2, 'pallet'); put(g, x0 + 3, 21, 'pallet'); if (r() < .5) put(g, x0 + 1, 3, 'barrel'); }
      rect(g, 30, 1, 30, 22, 'wall'); put(g, 30, 11, 'door'); put(g, 30, 12, 'door'); rect(g, 31, 1, 34, 22, 'marble');
      for (let y = 2; y < 22; y += 4) { rect(g, 31, y, 31, y + 1, 'shelf'); rect(g, 34, y, 34, y + 1, 'shelf'); } put(g, 32, 5, 'desk'); put(g, 33, 17, 'desk'); put(g, 32, 11, 'table');
      put(g, 0, 11, 'gate'); put(g, 0, 12, 'gate');
      rect(g, 15, 10, 20, 13, 'marble'); rect(g, 17, 11, 18, 12, 'emblem'); put(g, 16, 10, 'desk'); put(g, 19, 10, 'desk'); put(g, 16, 13, 'desk'); put(g, 19, 13, 'desk');
      for (let x = 4; x < 29; x += 6) { put(g, x, 8, 'pillar'); put(g, x, 15, 'pillar'); } put(g, 3, 9, 'brazier'); put(g, 28, 9, 'brazier'); put(g, 3, 14, 'brazier'); put(g, 28, 14, 'brazier');
      for (let k = 0; k < 6; k++) { const x = 2 + Math.floor(r() * 26); put(g, x, r() < .5 ? 1 : 22, 'brazier'); }
      return g;
    },
    dawnhold(seed) {
      const r = RT.rng(seed + 'dh'), nz = RT.noise(seed + 'dhn'), g = mk('cobble');
      for (let x = 0; x < COLS; x++) { const sh = 14 + Math.round(nz(x / 6, 3, 3) * 3); for (let y = sh + 2; y < ROWS; y++) g[y][x] = y > sh + 5 ? 'deep' : 'water'; for (let y = sh; y < sh + 2; y++) g[y][x] = 'sand'; }
      rect(g, 0, 0, 35, 1, 'wall'); rect(g, 16, 0, 19, 1, 'gate'); rect(g, 0, 0, 1, 1, 'tower'); rect(g, 34, 0, 35, 1, 'tower');
      rect(g, 2, 3, 8, 7, 'roof'); put(g, 5, 8, 'door'); rect(g, 27, 3, 33, 7, 'roof'); put(g, 30, 8, 'door'); rect(g, 11, 3, 14, 5, 'roof'); put(g, 12, 6, 'door');
      [8, 16, 26].forEach((px, i) => { const sh = 14 + Math.round(nz(px / 6, 3, 3) * 3); for (let y = sh - 1; y <= sh + 6; y++) { put(g, px, y, 'pier'); put(g, px + 1, y, 'pier'); } const sx = i === 1 ? px + 2 : px - 3; for (let y = sh + 1; y <= sh + 7; y++) for (let x = sx; x <= sx + 2; x++) put(g, x, y, (x === sx || x === sx + 2 || y === sh + 1 || y === sh + 7) ? 'rail' : 'deck'); put(g, sx + 1, sh + 3, 'mast'); put(g, sx + 1, sh + 5, 'crate'); });
      scatter(g, r, 12, 'crate', (c, x, y) => c === 'cobble' && y > 7 && y < 13); scatter(g, r, 8, 'barrel', (c, x, y) => c === 'cobble' && y > 7 && y < 13); scatter(g, r, 4, 'cart', (c, x, y) => c === 'cobble' && y > 8 && y < 12);
      scatter(g, r, 8, 'boulder', c => c === 'sand'); put(g, 17, 9, 'fountain'); put(g, 18, 9, 'fountain'); put(g, 17, 10, 'fountain'); put(g, 18, 10, 'fountain'); return g;
    },
    manor(seed) {
      const r = RT.rng(seed + 'mn'), g = mk('grass');
      outline(g, 0, 0, 35, 23, 'wall'); rect(g, 16, 23, 19, 23, 'gate'); rect(g, 8, 1, 27, 6, 'roof'); rect(g, 17, 6, 18, 6, 'door'); rect(g, 6, 7, 29, 8, 'marble');
      for (let x = 9; x < 27; x += 3) put(g, x, 7, 'pillar');
      rect(g, 16, 9, 19, 22, 'cobble'); rect(g, 6, 14, 29, 15, 'cobble'); put(g, 17, 12, 'fountain'); put(g, 18, 12, 'fountain'); put(g, 17, 11, 'fountain'); put(g, 18, 11, 'fountain');
      [[2, 10, 11, 20], [24, 10, 33, 20]].forEach(rm => { outline(g, rm[0] + 1, rm[1], rm[2], rm[3], 'hedge'); put(g, rm[0] + 1 + Math.floor((rm[2] - rm[0]) / 2), rm[1], 'cobble'); put(g, rm[2], 15, 'cobble'); put(g, rm[0] + 1, 15, 'cobble'); rect(g, rm[0] + 3, rm[1] + 2, rm[2] - 2, rm[1] + 3, 'flowers'); put(g, rm[0] + 5, rm[3] - 3, 'statue'); put(g, rm[0] + 6, rm[3] - 3, 'bench'); });
      scatter(g, r, 10, 'tree', (c, x, y) => c === 'grass' && (x < 3 || x > 32 || y < 3 || y > 20)); scatter(g, r, 6, 'flowers', (c, x, y) => c === 'grass' && y > 8); scatter(g, r, 6, 'bench', (c, x, y) => c === 'cobble' && y > 16);
      scatter(g, r, 4, 'table', (c, x, y) => c === 'marble'); scatter(g, r, 4, 'barrel', (c, x, y) => c === 'marble'); scatter(g, r, 4, 'statue', (c, x, y) => c === 'grass' && y > 8 && y < 22);
      for (let x = 5; x < 31; x++) { put(g, x, 16, 'flowers'); } rect(g, 16, 16, 19, 16, 'cobble'); return g;
    },
    aerie(seed) {
      const r = RT.rng(seed + 'ae'), nz = RT.noise(seed + 'aen'), g = mk('chasm');
      const blob = (cx, cy, rx, ry, k) => { for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2; if (d + (nz(x / 4 + k, y / 4, 2) - .5) * .5 < 1) g[y][x] = 'rock'; } };
      blob(18, 12, 13, 8, 1); blob(4, 5, 4, 3.4, 2); blob(31, 19, 4.4, 3.4, 3); blob(31, 4, 4, 3, 4);
      [[4, 5], [31, 19], [31, 4]].forEach(a => { let x = a[0], y = a[1]; const tx = 18, ty = 12; while (x !== tx || y !== ty) { if (Math.abs(tx - x) >= Math.abs(ty - y)) x += Math.sign(tx - x); else y += Math.sign(ty - y); if (g[y][x] === 'chasm') { g[y][x] = 'bridge'; if (g[y + 1] && g[y + 1][x] === 'chasm') g[y + 1][x] = 'bridge'; } } });
      rect(g, 13, 8, 22, 13, 'roof'); rect(g, 17, 14, 18, 14, 'door'); outline(g, 12, 7, 23, 14, 'pillar'); rect(g, 17, 14, 18, 14, 'door');
      scatter(g, r, 8, 'nest', (c, x, y) => c === 'rock'); scatter(g, r, 9, 'boulder', (c, x, y) => c === 'rock'); scatter(g, r, 6, 'brazier', (c, x, y) => c === 'rock'); scatter(g, r, 3, 'statue', (c, x, y) => c === 'rock'); scatter(g, r, 4, 'pine', (c, x, y) => c === 'rock');
      for (let y = 0; y < 3; y++) put(g, 34, y + 8, 'waterfall'); return g;
    }
  };
  RT.battleGrid = (id, seed) => SC[id](seed + '|' + id);

  RT.renderBattle = function (o) {
    const night = o.theme === 'night', g0 = RT.battleGrid(o.scenario, o.seed), base = ['crate', 'barrel', 'bench', 'table', 'desk', 'brazier', 'pillar'];
    const underFor = (x, y) => { const n = [g0[y][x - 1], g0[y][x + 1], g0[y - 1] && g0[y - 1][x], g0[y + 1] && g0[y + 1][x]].filter(t => t && !base.includes(t) && T[t][2]); return n.length ? n[0] : 'cobble'; };
    let s = `<defs><radialGradient id="tg"><stop offset="0" stop-color="#ffd27a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs><rect x="-3000" y="-3000" width="7600" height="7000" fill="${night ? '#05090f' : '#3a2e22'}"/>`;
    s += `<rect x="${OX - 10}" y="${OY - 10}" width="${COLS * C + 20}" height="${ROWS * C + 20}" fill="${night ? '#0a1a2a' : '#c8aa6e'}" stroke="${night ? '#c8aa6e' : '#8a6a2b'}" stroke-width="4"/>`;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const t = g0[y][x], px = OX + x * C, py = OY + y * C, h = hx(x, y), def = T[t];
      const col = baseCol(t, h) || baseCol(underFor(x, y), h);
      s += `<g class="cell" data-kind="cell" data-id="${x},${y}" data-type="${t}"><rect x="${px}" y="${py}" width="${C}" height="${C}" fill="${col}"/>${def[3](px, py, h)}</g>`;
    }

    // large objects drawn at real size across squares (trees 15 ft, fountain 10 ft, wagon 10×5 ft)
    const at = (x, y) => g0[y] && g0[y][x];
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const t = g0[y][x], px = OX + x * C, py = OY + y * C, h = hx(x, y);
      if (t === 'tree') { const r = C * (1.1 + (h % 5) / 25); s += `<g pointer-events="none"><circle cx="${px + 23}" cy="${py + 25}" r="${r}" fill="#000" opacity=".16"/><circle cx="${px + 20}" cy="${py + 20}" r="${r}" fill="#3f6a35" stroke="#2a4a22" stroke-width="2"/><circle cx="${px + 12}" cy="${py + 12}" r="${r * .45}" fill="#5c8a4a" opacity=".75"/><circle cx="${px + 28}" cy="${py + 26}" r="${r * .3}" fill="#355d2d" opacity=".6"/></g>`; }
      else if (t === 'pine') { const r = C * .95; s += `<g pointer-events="none"><circle cx="${px + 22}" cy="${py + 24}" r="${r}" fill="#000" opacity=".16"/><path d="M${px + 20} ${py + 20 - r}L${px + 20 + r * .95} ${py + 20 + r * .7}H${px + 20 - r * .95}Z" fill="#335f3a" stroke="#1f3a24" stroke-width="2"/><path d="M${px + 20} ${py + 20 - r * .55}L${px + 20 + r * .55} ${py + 20 + r * .35}H${px + 20 - r * .55}Z" fill="#3f7348" opacity=".8"/></g>`; }
      else if (t === 'fountain' && at(x - 1, y) !== 'fountain' && at(x, y - 1) !== 'fountain') { s += `<g pointer-events="none"><circle cx="${px + C}" cy="${py + C}" r="${C * .96}" fill="#e7e4da" stroke="#6f6b60" stroke-width="3"/><circle cx="${px + C}" cy="${py + C}" r="${C * .72}" fill="#79adc3" stroke="#3f6a80" stroke-width="2"/><circle cx="${px + C}" cy="${py + C}" r="${C * .25}" fill="#cbc6b8" stroke="#6f6b60" stroke-width="2"/><circle cx="${px + C}" cy="${py + C}" r="${C * .1}" fill="#fff"/></g>`; }
      else if (t === 'cart' && at(x - 1, y) !== 'cart') { const w = at(x + 1, y) === 'cart' ? 2 * C - 8 : C - 8; s += `<g pointer-events="none"><rect x="${px + 4}" y="${py + 9}" width="${w}" height="${C - 18}" fill="#8a6a42" stroke="#3a2a14" stroke-width="2"/><path d="M${px + 8} ${py + 14}H${px + w}M${px + 8} ${py + 24}H${px + w}" stroke="#5a3d28"/><circle cx="${px + 10}" cy="${py + 33}" r="5" fill="#5a3d28" stroke="#2a1d10"/><circle cx="${px + w - 2}" cy="${py + 33}" r="5" fill="#5a3d28" stroke="#2a1d10"/><circle cx="${px + 10}" cy="${py + 7}" r="5" fill="#5a3d28" stroke="#2a1d10"/><circle cx="${px + w - 2}" cy="${py + 7}" r="5" fill="#5a3d28" stroke="#2a1d10"/></g>`; }
    }
    s += `<g id="grid" pointer-events="none" stroke="${night ? '#c8aa6e' : '#2a1d10'}" stroke-opacity="${o.grid ? .3 : 0}" stroke-width="1">`;
    for (let x = 0; x <= COLS; x++) s += `<path d="M${OX + x * C} ${OY}V${OY + ROWS * C}"/>`;
    for (let y = 0; y <= ROWS; y++) s += `<path d="M${OX} ${OY + y * C}H${OX + COLS * C}"/>`;
    s += '</g>';
    if (night) { s += `<rect x="${OX}" y="${OY}" width="${COLS * C}" height="${ROWS * C}" fill="#06142e" opacity=".38" pointer-events="none"/>`; for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (g0[y][x] === 'brazier') s += `<circle cx="${OX + x * C + 20}" cy="${OY + y * C + 20}" r="70" fill="url(#tg)" pointer-events="none"/>`; }
    return s;
  };
  RT.CREATURES = [['Tiny', .5, 'about 2½ ft — 4 fit in one square (rat, raven)'], ['Small / Medium', 1, '5 ft — one square: an average person, dwarf, halfling, wolf'], ['Large', 2, '10 ft — 2×2 squares: horse, silverwing raptor, ogre'], ['Huge', 3, '15 ft — 3×3 squares: giant, young dragon'], ['Gargantuan', 4, '20 ft+ — 4×4 squares: ancient dragon, kraken']];
  RT.tileInfo = t => ({ name: T[t][0], rule: T[t][1] });
})(window.RT);
