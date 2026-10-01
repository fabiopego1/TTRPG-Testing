/* House Crownguard Mansion, High Silvermere — authored in feet (1 unit = 1 ft). 200 × 130 ft.
   The mansion is canon (it stands at the foot of Knight's Rock); the floor plan is invented for the table. */
(function (RT) {
  const d = [];
  const add = o => (d.push(o), o);
  const rect = (x, y, w, h, fill, e) => add(Object.assign({ k: 'rect', x, y, w, h, fill }, e));
  const wall = (x1, y1, x2, y2, t) => add({ k: 'wall2', x1, y1, x2, y2, t });
  const F = (t, x, y, w, h, rot, e) => add(Object.assign({ k: 'f', t, x, y, w, h, rot: rot || 0 }, e));
  const door = (x, y, w, dir, t) => add({ k: 'door', x, y, w, dir, t: t || 1.6 });
  const win = (x, y, dir, w) => add({ k: 'win', x, y, dir, w: w || 3 });
  const light = (x, y, r, moon) => add({ k: 'light', x, y, r, moon: !!moon });

  // ---- ground: lawn, rear rock face (the foot of Knight's Rock), gravel yard
  rect(-200, -200, 600, 530, 'url(#grass)');
  add({ k: 'poly', smooth: false, pts: [[0, 0], [200, 0], [200, 17], [178, 14], [152, 18], [126, 13], [105, 17], [82, 13], [54, 17], [28, 13], [0, 16]], fill: 'url(#rockface)', stroke: '#4d4a42', sw: .8, sh: 1.2 });
  add({ k: 'poly', pts: [[0, 0], [200, 0], [200, 7], [160, 9], [120, 6], [80, 9], [40, 6], [0, 8]], fill: '#6f6b62', op: .55 });
  add({ k: 'path', d: 'M10 14L18 10M34 12L44 8M64 14L72 9M92 15L98 10M116 12L124 8M140 16L150 11M164 13L172 9M186 14L192 9', stroke: '#33312c', sw: .7, op: .6 });
  add({ k: 'path', d: 'M6 13L14 12M36 15L46 13M68 12L78 11M110 15L120 14M150 14L160 12M180 12L192 13', stroke: '#c9c3b4', sw: .6, op: .6 });
  rect(30, 16, 140, 9, 'url(#gravel)', { rx: 1 });            // rear service yard
  rect(96, 14, 12, 12, 'url(#flag)', { sh: .6 });             // landing at the foot of the carved steps
  F('stair', 102, 9, 10, 9, 0, { dir: 'v', arrow: true });    // steps cut into the rock toward the Aerie
  // ---- west kitchen garden
  rect(3, 25, 27, 102, 'url(#grass)');
  rect(14, 24, 3.2, 90, 'url(#gravel)');
  [[8, 34], [8, 41], [8, 48], [8, 55], [23, 34], [23, 41], [23, 48], [23, 55]].forEach((p, i) => F('bed2', p[0] + 1, p[1], 10, 3.6, 0, { crop: ['#6a9a3e', '#c9553f', '#d7b04a', '#7ea65a'][i % 4] }));
  rect(5, 66, 21, 11, '#cfe6ec', { stroke: '#5b6b70', sw: .6, sh: 1, op: .92 });
  add({ k: 'path', d: 'M5 71.5H26M10.2 66V77M15.5 66V77M20.8 66V77', stroke: '#5b6b70', sw: .35 });
  F('bed2', 15.5, 71.5, 18, 5, 0, { crop: '#d46a8a' });
  F('well', 16, 100, 5, 5);
  // ---- east pleasure garden
  rect(170, 25, 27, 102, 'url(#grass)');
  rect(182, 25, 3.2, 90, 'url(#gravel)');
  add({ k: 'ellipse', x: 184, y: 100, rx: 9, ry: 6, fill: '#8f8a7f', stroke: '#4a463f', sw: .5 });
  add({ k: 'ellipse', x: 184, y: 100, rx: 7.8, ry: 4.9, fill: '#6fa7be', stroke: '#3f6a80', sw: .3 });
  add({ k: 'ellipse', x: 184, y: 100, rx: 7, ry: 4.2, fill: 'url(#waves)' });
  add({ k: 'poly', pts: [[184, 43], [189, 45], [191, 50], [189, 55], [184, 57], [179, 55], [177, 50], [179, 45]], fill: '#a98a58', stroke: '#4a3320', sw: .5, sh: 1.2 });
  add({ k: 'poly', pts: [[184, 45.5], [187.8, 47], [189.2, 50], [187.8, 53], [184, 54.5], [180.2, 53], [178.8, 50], [180.2, 47]], fill: '#8aa0bd', stroke: '#46566e', sw: .35 });
  F('bush', 184, 50, 3, 3, 0, { flower: '#e8e0c8' });
  for (let i = 0; i < 6; i++) { F('bush', 175 + (i % 2) * 18, 66 + Math.floor(i / 2) * 7, 3.2, 3.2, 0, { flower: ['#e48fb5', '#f0c74a', '#fff'][i % 3] }); }
  F('bench', 184, 91, 6, 1.8); F('bench', 184, 110, 6, 1.8, 0);
  // ---- front: courtyard, terrace
  rect(56, 99, 88, 27, 'url(#gravel)', { rx: 3, stroke: '#a89c7c', sw: .6 });
  rect(95, 118, 10, 11, 'url(#gravel)');
  rect(26, 88, 148, 11, 'url(#flag)', { stroke: '#6f6b60', sw: .7, sh: 1.2 });
  F('fountain', 100, 112, 12, 12);
  [[68, 106], [132, 106], [68, 120], [132, 120]].forEach(p => F('bush', p[0], p[1], 4.4, 4.4));
  F('bench', 83, 124, 5, 1.6); F('bench', 117, 124, 5, 1.6);
  wall(26, 98.8, 92, 98.8, 1.2); wall(108, 98.8, 174, 98.8, 1.2);
  F('stair', 100, 94, 16, 9, 0, { dir: 'v', arrow: true });
  F('plant', 30, 92, 3.4, 3.4, 0, { c: '#4f7d45' }); F('plant', 170, 92, 3.4, 3.4, 0, { c: '#4f7d45' });
  // ---- mansion floors
  rect(32, 26, 28, 26, 'url(#flag)'); rect(60, 26, 20, 26, 'url(#woodDark)'); rect(80, 26, 42, 26, 'url(#wood)'); rect(122, 26, 24, 26, 'url(#wood)'); rect(146, 26, 22, 26, 'url(#marble)');
  rect(32, 52, 40, 34, 'url(#wood)'); rect(72, 52, 56, 34, 'url(#marble)'); rect(128, 52, 40, 34, 'url(#wood)');
  // ---- floor coverings (under furniture)
  F('rug', 101, 39, 24, 12, 0, { c: '#6b2c3a' });
  F('rug', 101, 72, 7, 28, 0, { c: '#7e2f36' });
  F('rug', 52, 69, 28, 11, 0, { c: '#4a3a6a' });
  F('rug', 150, 69, 22, 16, 0, { c: '#2f4f7a' });
  F('rug', 134, 40, 12, 8, 0, { c: '#4d6a3a' });
  // ---- walls: outer shell 2 ft, partitions 1.6 ft
  wall(31, 25, 169, 25, 2); wall(31, 87, 169, 87, 2); wall(31, 25, 31, 87, 2); wall(169, 25, 169, 87, 2);
  wall(31, 52, 169, 52, 1.6);
  [60, 80, 122, 146].forEach(x => wall(x, 25, x, 52, 1.6)); [72, 128].forEach(x => wall(x, 52, x, 87, 1.6));
  // ---- doors (x,y = centre of opening)
  door(45, 52, 5, 'h'); door(101, 52, 6, 'h'); door(134, 52, 4, 'h'); door(159, 52, 4, 'h');
  door(60, 38, 4, 'v'); door(80, 38, 4, 'v'); door(122, 34, 4, 'v'); door(72, 70, 6, 'v'); door(128, 70, 6, 'v');
  door(100, 87, 8, 'h', 2); door(50, 87, 5, 'h', 2); door(150, 87, 5, 'h', 2); door(45, 25, 5, 'h', 2); door(70, 25, 4, 'h', 2);
  [[56, 25], [64, 25], [101, 25, 'h', 6], [134, 25], [157, 25], [38, 87], [62, 87], [84, 87], [116, 87], [140, 87], [160, 87]].forEach(w => win(w[0], w[1], 'h', w[3]));
  [[31, 36], [31, 62], [31, 78], [169, 36], [169, 62], [169, 78]].forEach(w => win(w[0], w[1], 'v'));
  // ---- kitchen
  F('hearth', 44, 27.6, 14, 3);
  F('table', 44, 40, 10, 3.6, 0, { c: '#a58660' });
  F('shelf', 33.3, 31, 2, 8); F('shelf', 33.3, 44, 2, 7); F('table', 34, 38, 2.4, 3, 0, { c: '#8b8f97' });
  F('barrel', 57, 49, 2.6); F('barrel', 54.2, 50.2, 2.6); F('barrel', 57.2, 46.2, 2.6); F('crate', 35.5, 49.5, 3, 3); F('barrel', 36, 45, 3.2);
  [[40, 36.6], [48, 36.6], [40, 43.4], [48, 43.4]].forEach(p => F('chair', p[0], p[1], 1.8, 1.8, 0, { c: '#6d4c2a' }));
  // ---- servants' hall
  F('table', 70, 40, 3, 12); F('bench', 66.6, 40, 1.4, 11); F('bench', 73.4, 40, 1.4, 11); F('shelf', 78.8, 46, 2.2, 8); F('shelf', 78.8, 32, 2.2, 6);
  // ---- library
  F('shelf', 89, 27.3, 14, 2.2); F('shelf', 113, 27.3, 14, 2.2); F('shelf', 81.3, 31.5, 2.2, 7); F('shelf', 81.3, 46, 2.2, 8);
  F('shelf', 120.7, 44, 2.2, 12); F('shelf', 120.7, 29, 2.2, 4.5); F('shelf', 91, 50.7, 10, 2.2); F('shelf', 112, 50.7, 12, 2.2);
  F('table', 92, 38, 8, 3); F('table', 110, 38, 8, 3);
  [[89, 35.2], [95, 35.2], [89, 40.8], [95, 40.8], [107, 35.2], [113, 35.2], [107, 40.8], [113, 40.8]].forEach(p => F('chair', p[0], p[1], 1.8, 1.8, 0, { c: '#6d4c2a' }));
  F('lectern', 101, 30.4, 3.6, 2.6);
  light(101, 31, 20);
  // ---- study
  F('table', 134, 32, 7, 3, 0, { c: '#5a3d28' }); F('chair', 134, 35.4, 2, 2, 0, { c: '#7a2f36' }); F('shelf', 144.9, 40, 2.2, 18);
  F('cloth', 130, 46, 6, 4, 0, { c: '#5a3d28' }); F('barrel', 141, 47, 2.4); F('chair', 127, 46, 1.8, 1.8);
  // ---- chapel of the Winged Sisters
  F('altar', 157, 28.6, 7, 2.4); F('statue', 151, 29.6, 2.6, 2.6, 0, { wing: true }); F('statue', 163, 29.6, 2.6, 2.6, 0, { wing: true });
  [36, 40, 44].forEach(y => { F('bench', 151.8, y, 8, 1.8); F('bench', 164, y, 7, 1.8); });
  light(151, 28, 14); light(163, 28, 14);
  // ---- dining hall
  F('hearth', 33.2, 69, 2.4, 8);
  F('table', 52, 69, 22, 5, 0, { c: '#7a5232' });
  [43.5, 48, 52, 56, 60.5].forEach(x => { F('chair', x, 65.2, 2, 2, 0, { c: '#7a4f2d' }); F('chair', x, 72.8, 2, 2, 180, { c: '#7a4f2d' }); });
  F('chair', 40.3, 69, 2, 2.2, 90, { c: '#8a3a32' }); F('chair', 63.7, 69, 2, 2.2, 270, { c: '#8a3a32' });
  F('table', 46, 84.2, 10, 2.2, 0, { c: '#5a3d28' }); F('table', 60, 84.2, 8, 2.2, 0, { c: '#5a3d28' });
  // ---- great hall
  F('stair', 82, 57, 12, 8, 0, { dir: 'h' }); F('stair', 120, 57, 12, 8, 0, { dir: 'h' });
  [[84, 72], [118, 72], [84, 82], [118, 82]].forEach(p => F('pillar', p[0], p[1], 2.6));
  F('statue', 76, 84, 3, 3); F('statue', 126, 84, 3, 3);
  F('banner', 96, 53.4, 3, 1.6, 0, { c: '#2f5d8a' }); F('banner', 106, 53.4, 3, 1.6, 0, { c: '#2f5d8a' });
  light(101, 70, 34);
  // ---- drawing room
  F('hearth', 167, 70, 2.4, 8);
  F('sofa', 150, 62, 8, 2.8, 0, { c: '#3e5f8a' }); F('sofa', 150, 76, 8, 2.8, 180, { c: '#3e5f8a' }); F('table', 150, 69, 4, 3, 0, { round: true, c: '#7a5232' });
  F('sofa', 141, 69, 2.8, 3, 90, { c: '#7a2f36' }); F('sofa', 159, 69, 2.8, 3, 270, { c: '#7a2f36' });
  F('harp', 137, 82, 7, 3.2); F('chair', 137, 79.2, 1.8, 1.8, 0, { c: '#7a2f36' }); F('plant', 164, 56, 3, 3); F('plant', 132, 56, 3, 3);
  // ---- lights for night
  light(44, 28, 18); light(34, 69, 20); light(167, 70, 20); light(94, 127, 14); light(106, 127, 14); light(30, 92, 14); light(170, 92, 14); light(100, 112, 24, true); light(184, 100, 20, true);
  // ---- outer wall of the grounds + gate
  wall(1.5, 14, 1.5, 129, 3); wall(198.5, 14, 198.5, 129, 3); wall(1, 128.5, 96, 128.5, 3); wall(104, 128.5, 199, 128.5, 3);
  F('pillar', 95.2, 128.5, 3.4); F('pillar', 104.8, 128.5, 3.4);
  F('lamp', 95.2, 126.4, 1); F('lamp', 104.8, 126.4, 1);
  // ---- trees
  add({ k: 'trees', kind: 'oak', list: [[9, 88, 9], [22, 116, 10], [9, 30, 7], [191, 30, 8.5], [192, 72, 9.5], [176, 118, 10], [190, 110, 8], [11, 121, 7.5], [40, 118, 8], [160, 118, 8], [44, 100, 6.5], [156, 104, 6.5]] });

  const rooms = (id, n, rect, c, dsc, npc, h, notes) => ({ id, n, rect, c, d: dsc, npc, h, notes });
  const mk = { west: [16, 46], east: [184, 40], rock: [150, 8], terrace: [40, 93], courtyard: [100, 104] };
  RT.MAPS.crownguard = {
    id: 'crownguard', level: 'site', parent: 'silvermere', parentAt: [1090, 575], name: 'House Crownguard Mansion', tag: 'High Silvermere · noble residence at the foot of Knight’s Rock',
    w: 200, h: 130, ground: '#98b673', draw: d, lights: [],
    summary: 'The seat of House Crownguard stands at the foot of Knight’s Rock. Its garden wall backs onto the rock, with carved steps climbing toward the Raptor Aerie. The layout of the house is invented for the table; the house itself and its library are from the lore.',
    dims: ['Grounds: 200 × 130 ft.', 'House: 140 × 62 ft; exterior walls 2 ft thick, inner walls 1.6 ft.', 'Doors: 4–5 ft; double doors 6–8 ft. Ceiling about 12 ft.', 'Courtyard fountain: 12 ft across; rock face rises 100 ft+ behind the north wall.'],
    features: [
      rooms('library', 'Library & Canticle Room', [80, 26, 122, 52], 1, 'The Crownguard family library, which keeps the “Canticle of the Winged Sisters”, an epic poem about Kayle and Morgana. Shelves line the walls; the Canticle rests on a lectern.', ['Archivist Perrin Oake', 'Librarian (invented)', 'Soft-spoken; will lend the Canticle to anyone who can recite its first line.'], 'The last stanza of the Canticle has been cut from the lectern copy. A candle burned beside it all night.', ['Shelves: half cover; a toppled shelf makes difficult terrain.', 'Lectern light: bright light 20 ft. Windows to the north.']),
      rooms('greathall', 'Great Hall', [72, 52, 128, 86], 0, 'A marble hall with twin stairs to the upper floor, ancestor statues and a chandelier. Visitors are received here; the double doors face the courtyard.', ['Steward Orsen Vail', 'Steward (invented)', 'Keeps the keys; loyal; privately worried about a missing cousin.'], 'One portrait in the hall is hung crooked; behind it, a note in a child’s hand.', ['Pillars: three-quarters cover. Statues: half cover.', 'Marble: slippery when running.']),
      rooms('dining', 'Dining Hall', [32, 52, 72, 86], 0, 'A long table seats twelve. A fireplace warms the west end; sideboards hold the family silver.', ['Lady Marit Crownguard', 'House matron (invented)', 'Formal, warm, sharp-eyed.'], 'Two place settings are laid for guests nobody has invited.', ['Table: half cover; flip for three-quarters cover.', 'Fireplace: bright light; 1d6 fire if touched.']),
      rooms('drawing', 'Drawing Room', [128, 52, 168, 86], 0, 'Sofas around a tea table, a harpsichord, a fireplace. The terrace door lets guests slip out to the garden.', ['Cousin Alden Crownguard', 'Young noble (invented)', 'Bored, charming, and hiding something.'], 'A guest left a sealed letter beneath a sofa cushion.', ['Sofas: half cover.', 'Harpsichord: three-quarters cover for Small creatures.']),
      rooms('study', 'Study', [122, 26, 146, 52], 0, 'Lord Remy Crownguard’s study: a heavy desk, a map table of the northern border, shelves of ledgers.', ['Lord Remy Crownguard', 'Head of the house (invented)', 'Stern and kind; will not abandon family or duty.'], 'A drawer in the desk is locked; its key hangs round the steward’s neck.', ['Locked desk drawer: DC 14 thieves’ tools.', 'Map table: half cover.']),
      rooms('chapel', 'Chapel of the Winged Sisters', [146, 26, 168, 52], 0, 'A small chapel to Kayle and Morgana: twin winged statues flank the altar, three rows of pews either side of a narrow aisle.', ['Chaplain Edwyn', 'House chaplain (invented)', 'Prays for both sisters, and would rather you didn’t ask which he prefers.'], 'The statue of Morgana has been turned to face the wall.', ['Pews: half cover. Statues: three-quarters cover.', 'Candles at the altar: dim light 10 ft.']),
      rooms('kitchen', 'Kitchen', [32, 26, 60, 52], 0, 'A flagstone kitchen with a big hearth, a prep table and barrels of provisions. A back door opens to the service yard.', ['Cook Berta', 'Head cook (invented)', 'Hears everything said in the house; says nothing.'], 'Someone has been stealing small meals — and leaving a coin each time.', ['Hearth: 1d6 fire; barrels: half cover.', 'Back door leads to the service yard and the steps up the rock.']),
      rooms('servants', 'Servants’ Hall', [60, 26, 80, 52], 0, 'A long table and benches where the staff eat. A door to the service yard lets deliveries in.', ['Hob the footman', 'Servant (invented)', 'Knows every door and who has the key.'], 'A servant’s apron was found at the foot of the Aerie steps.', ['Benches: half cover.']),
      rooms('terrace', 'Terrace', [26, 88, 174, 99], 0, 'A flagstone terrace across the front of the house, edged by a low balustrade. Steps lead down to the courtyard.', ['Guard-sergeant Teague', 'House guard (invented)', 'Stands where the whole terrace can be seen.'], 'The balustrade has a chipped section where a grapnel recently bit.', ['Balustrade: half cover; 3 ft high.', 'Steps: 16 ft wide.']),
      rooms('courtyard', 'Courtyard & Fountain', [56, 99, 144, 126], 0, 'A gravel court with a 12-ft fountain, topiary and benches. The gate opens on the street.', ['Gardener Wynn', 'Groundskeeper (invented)', 'Speaks only to the topiary.'], 'The fountain’s water ran red for a day and nobody will say why.', ['Fountain: half cover; shallow water.', 'Gravel: loud — disadvantage on Stealth.']),
      rooms('west', 'Kitchen Garden', [3, 25, 30, 127], 0, 'Vegetable beds, a greenhouse and a well, tucked between the house and the garden wall.', ['Gardener Wynn', 'Groundskeeper (invented)', 'Prefers vegetables to people.'], 'A bed was dug up overnight — there is something small and metal beneath it.', ['Greenhouse: glass breaks (DC 8); beds: difficult terrain.']),
      rooms('east', 'Pleasure Garden', [170, 25, 197, 127], 0, 'Flowerbeds, a gazebo and a small pond. A hedge-lined gravel path winds to the pond.', ['Cousin Alden Crownguard', 'Young noble (invented)', 'Retreats here to avoid duty.'], 'The gazebo’s bench hides a hollow.', ['Gazebo: roof gives half cover from above.', 'Pond: shallow; difficult terrain.']),
      rooms('rock', 'Rock Face & Aerie Steps', [0, 0, 200, 25], 1, 'The foot of Knight’s Rock rises above the mansion. Steps cut into the stone climb toward the Raptor Aerie. The face is sheer; raptors roost high above.', ['Aerie-Knight Sorrel Ward', 'Raptor-Knight (invented)', 'Descends rarely; when she does, it matters.'], 'Fresh scrapes mark the steps; someone climbed in a hurry.', ['Rock: Athletics DC 15 to climb; 100+ ft drop.', 'Steps: 10 ft wide, no rail.'])
    ].map(f => (mk[f.id] ? Object.assign(f, { mx: mk[f.id][0], my: mk[f.id][1] }) : f))
  };
})(window.RT);
