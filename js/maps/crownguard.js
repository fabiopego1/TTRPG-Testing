/* House Crownguard Mansion, High Silvermere — authored in feet (1 unit = 1 ft). 200 × 130 ft.
   The house stands at the foot of Knight's Rock (canon, as does its library). The floor plan is invented, kept to
   what a noble house needs: kitchen, servants' hall, library, study, great hall, dining hall, drawing room.
   Scale: person ≈ 2.5 ft token · interior doors 3–3.5 ft · double doors 6–7 ft · interior walls 1.6 ft · exterior 2 ft. */
(function (RT) {
  const d = [];
  const add = o => (d.push(o), o);
  const rect = (x, y, w, h, fill, e) => add(Object.assign({ k: 'rect', x, y, w, h, fill }, e));
  const wall = (x1, y1, x2, y2, t) => add({ k: 'wall2', x1, y1, x2, y2, t });
  const F = (t, x, y, w, h, rot, e) => add(Object.assign({ k: 'f', t, x, y, w, h, rot: rot || 0 }, e));
  const door = (x, y, w, dir, t) => add({ k: 'door', x, y, w, dir, t: t || 1.6 });
  const win = (x, y, dir, w) => add({ k: 'win', x, y, dir, w: w || 3 });
  const light = (x, y, r, moon) => add({ k: 'light', x, y, r, moon: !!moon });
  const chairs = (list, c) => list.forEach(p => F('chair', p[0], p[1], 1.6, 1.6, p[2] || 0, { c: c || '#6d4c2a' }));

  // ---- ground: lawn, the foot of Knight's Rock behind the house, service yard, forecourt
  rect(-200, -200, 600, 530, 'url(#grass)');
  add({ k: 'poly', pts: [[0, 0], [200, 0], [200, 17], [178, 14], [152, 18], [126, 13], [105, 17], [82, 13], [54, 17], [28, 13], [0, 16]], fill: 'url(#rockface)', stroke: '#4d4a42', sw: .8, sh: 1.2 });
  add({ k: 'poly', pts: [[0, 0], [200, 0], [200, 7], [160, 9], [120, 6], [80, 9], [40, 6], [0, 8]], fill: '#6f6b62', op: .55 });
  add({ k: 'path', d: 'M10 14L18 10M34 12L44 8M64 14L72 9M92 15L98 10M116 12L124 8M140 16L150 11M164 13L172 9M186 14L192 9', stroke: '#33312c', sw: .7, op: .6 });
  rect(30, 16, 140, 9, 'url(#gravel)', { rx: 1 });                  // service yard behind the house
  rect(96, 14, 12, 12, 'url(#flag)', { sh: .6 });                   // landing below the carved steps
  F('stair', 102, 9, 7, 9, 0, { dir: 'v', arrow: true });           // steps cut into the rock toward the Aerie (7 ft wide)
  rect(56, 99, 88, 27, 'url(#gravel)', { rx: 3, stroke: '#a89c7c', sw: .6 });  // forecourt
  rect(94, 118, 12, 11, 'url(#gravel)');
  rect(26, 88, 148, 11, 'url(#flag)', { stroke: '#6f6b60', sw: .7, sh: 1.2 }); // terrace
  wall(26, 98.8, 94, 98.8, 1.2); wall(106, 98.8, 174, 98.8, 1.2);
  F('stair', 100, 94, 12, 9, 0, { dir: 'v', arrow: true });

  // ---- floors (materials follow use: flagstone for work rooms, boards for living rooms, marble for the hall)
  rect(31, 26, 29, 26, 'url(#flag)'); rect(60, 26, 20, 26, 'url(#woodDark)'); rect(80, 26, 54, 26, 'url(#wood)'); rect(134, 26, 35, 26, 'url(#wood)');
  rect(31, 52, 41, 34, 'url(#wood)'); rect(72, 52, 56, 34, 'url(#marble)'); rect(128, 52, 41, 34, 'url(#wood)');
  F('rug', 107, 39, 22, 12, 0, { c: '#6b2c3a' }); F('rug', 100, 72, 6, 26, 0, { c: '#7e2f36' });
  F('rug', 51.5, 69, 22, 9, 0, { c: '#4a3a6a' }); F('rug', 148.5, 69, 18, 12, 0, { c: '#2f4f7a' }); F('rug', 148, 38, 11, 7, 0, { c: '#4d6a3a' });

  // ---- walls: exterior 2 ft, partitions 1.6 ft
  wall(31, 25, 169, 25, 2); wall(31, 87, 169, 87, 2); wall(31, 25, 31, 87, 2); wall(169, 25, 169, 87, 2);
  wall(31, 52, 169, 52, 1.6);
  [60, 80, 134].forEach(x => wall(x, 25, x, 52, 1.6)); [72, 128].forEach(x => wall(x, 52, x, 87, 1.6));
  // ---- doors (x,y = centre of the opening): interior 3–3.5 ft, double 6 ft, entrance 7 ft
  door(45, 52, 3.5, 'h'); door(104, 52, 6, 'h'); door(150, 52, 3.5, 'h');
  door(60, 38, 3, 'v'); door(80, 38, 3, 'v'); door(134, 34, 3.5, 'v'); door(72, 70, 6, 'v'); door(128, 70, 6, 'v');
  door(100, 87, 7, 'h', 2); door(50, 87, 4, 'h', 2); door(150, 87, 4, 'h', 2); door(45, 25, 3.5, 'h', 2); door(70, 25, 3, 'h', 2);
  [[56, 25], [65, 25], [107, 25, 'h', 6], [150, 25], [38, 87], [62, 87], [84, 87], [116, 87], [138, 87], [160, 87]].forEach(w => win(w[0], w[1], 'h', w[3]));
  [[31, 36], [31, 62], [31, 78], [169, 36], [169, 62], [169, 78]].forEach(w => win(w[0], w[1], 'v'));

  // ---- kitchen (29 × 26): hearth, prep table, shelves, stores
  F('hearth', 45, 27.4, 12, 2.8); F('table', 45, 40, 10, 3.5, 0, { c: '#a58660' });
  F('shelf', 32.2, 31, 1.5, 8); F('shelf', 32.2, 44, 1.5, 7); F('table', 33.2, 38, 2, 3, 0, { c: '#8b8f97' });
  F('barrel', 57, 49, 2.2); F('barrel', 54.6, 50, 2.2); F('crate', 35, 49.5, 2.6, 2.6); F('barrel', 35.2, 46, 2.6);
  // ---- servants' hall (20 × 26)
  F('table', 70, 40, 3, 10); F('bench', 67, 40, 1.3, 9); F('bench', 73, 40, 1.3, 9); F('shelf', 79.1, 46, 1.5, 7); F('shelf', 79.1, 31, 1.5, 6);
  // ---- library (54 × 26): shelves on every wall except at doors and the window; two reading tables; the Canticle on its lectern
  F('shelf', 91, 26.9, 20, 1.5); F('shelf', 123, 26.9, 20, 1.5); F('shelf', 80.9, 31.5, 1.5, 8); F('shelf', 80.9, 46, 1.5, 9);
  F('shelf', 133.1, 44, 1.5, 14); F('shelf', 133.1, 29.5, 1.5, 4.5); F('shelf', 90, 51.2, 14, 1.5); F('shelf', 121, 51.2, 14, 1.5);
  F('table', 94, 38, 8, 3); F('table', 120, 38, 8, 3);
  chairs([[91, 35, 0], [97, 35, 0], [91, 41, 180], [97, 41, 180], [117, 35, 0], [123, 35, 0], [117, 41, 180], [123, 41, 180]]);
  F('lectern', 107, 30, 3, 2.2); light(107, 31, 20);
  // ---- study (35 × 26)
  F('table', 150, 31.5, 6, 2.8, 0, { c: '#5a3d28' }); chairs([[150, 34.6, 0]], '#7a2f36'); F('shelf', 167.9, 40, 1.5, 18);
  F('cloth', 143, 44, 5, 3.5, 0, { c: '#5a3d28' });
  // ---- dining hall (41 × 34)
  F('hearth', 32.2, 69, 2.4, 7); F('table', 51.5, 69, 18, 3.5, 0, { c: '#7a5232' });
  [44, 48.25, 52.5, 56.75, 61].forEach(x => { F('chair', x - 1, 65.7, 1.6, 1.6, 0, { c: '#7a4f2d' }); F('chair', x - 1, 72.3, 1.6, 1.6, 180, { c: '#7a4f2d' }); });
  F('chair', 40.7, 69, 1.6, 1.8, 90, { c: '#8a3a32' }); F('chair', 62.5, 69, 1.6, 1.8, 270, { c: '#8a3a32' });
  F('table', 45, 84.6, 8, 1.8, 0, { c: '#5a3d28' }); F('table', 58, 84.6, 7, 1.8, 0, { c: '#5a3d28' });
  // ---- great hall (56 × 34): twin stairs either side of the library door, four pillars
  F('stair', 82, 58, 6, 10, 0, { dir: 'v' }); F('stair', 118, 58, 6, 10, 0, { dir: 'v' });
  [[86, 72], [114, 72], [86, 82], [114, 82]].forEach(p => F('pillar', p[0], p[1], 2)); light(100, 70, 34);
  // ---- drawing room (41 × 34)
  F('hearth', 167.4, 70, 2.4, 7); F('sofa', 148.5, 62, 7, 2.8, 0, { c: '#3e5f8a' }); F('sofa', 148.5, 76, 7, 2.8, 180, { c: '#3e5f8a' });
  F('table', 148.5, 69, 3.5, 2.5, 0, { round: true, c: '#7a5232' }); F('sofa', 141, 69, 2.6, 2.6, 90, { c: '#7a2f36' }); F('sofa', 156, 69, 2.6, 2.6, 270, { c: '#7a2f36' });

  // ---- lights for night
  light(45, 28, 16); light(34, 69, 18); light(167, 70, 18); light(94, 127, 12); light(106, 127, 12); light(30, 92, 12); light(170, 92, 12);

  // ---- grounds: boundary wall with a carriage gate (12 ft), shade trees along the walls
  wall(1.5, 14, 1.5, 129, 3); wall(198.5, 14, 198.5, 129, 3); wall(1, 128.5, 94, 128.5, 3); wall(106, 128.5, 199, 128.5, 3);
  F('pillar', 94.2, 128.5, 3.2); F('pillar', 105.8, 128.5, 3.2); F('lamp', 94.2, 126.6, 1); F('lamp', 105.8, 126.6, 1);
  add({ k: 'trees', kind: 'oak', list: [[8, 40, 8], [9, 72, 9], [9, 104, 8.5], [191, 40, 8], [192, 72, 9], [191, 104, 8.5], [30, 118, 7], [170, 118, 7]] });

  const room = (id, n, r, c, dsc, mk) => Object.assign({ id, n, rect: r, c, d: dsc }, mk ? { mx: mk[0], my: mk[1] } : {});
  RT.MAPS.crownguard = {
    id: 'crownguard', level: 'site', parent: 'silvermere', name: 'House Crownguard Mansion', tag: 'High Silvermere · noble house at the foot of Knight’s Rock',
    w: 200, h: 130, ground: '#98b673', draw: d, lights: [],
    summary: 'The seat of House Crownguard stands at the foot of Knight’s Rock, its grounds backing onto the rock face. The house and its library are from the lore; the floor plan is invented.',
    dims: ['Grounds: 200 × 130 ft. House: 138 × 62 ft.', 'Exterior walls 2 ft thick; interior walls 1.6 ft.', 'Interior doors 3–3.5 ft; double doors 6 ft; main entrance 7 ft; carriage gate 12 ft.'],
    features: [
      room('library', 'Library', [80, 26, 134, 52], 1, 'The Crownguard family library, which holds the “Canticle of the Winged Sisters”, an epic poem about Kayle and Morgana. Shelves line the walls; the Canticle rests on a lectern beneath the north window.'),
      room('greathall', 'Great Hall', [72, 52, 128, 86], 0, 'A marble hall that receives visitors from the main entrance. Twin stairs rise either side of the library door; four pillars carry the roof.'),
      room('dining', 'Dining Hall', [31, 52, 72, 86], 0, 'A long table seating ten, a fireplace at the west end and sideboards along the south wall.'),
      room('drawing', 'Drawing Room', [128, 52, 169, 86], 0, 'Sofas around a low table, with a fireplace in the east wall. A door leads out to the terrace.'),
      room('study', 'Study', [134, 26, 169, 52], 0, 'A working study: a desk, a map table and shelves of ledgers.'),
      room('kitchen', 'Kitchen', [31, 26, 60, 52], 0, 'A flagstone kitchen with a wide hearth, a prep table and stores. A back door opens to the service yard.'),
      room('servants', 'Servants’ Hall', [60, 26, 80, 52], 0, 'A long table and benches where the household staff eat. A back door opens to the service yard.'),
      room('terrace', 'Terrace', [26, 88, 174, 99], 0, 'A flagstone terrace across the front of the house behind a low balustrade; steps lead down to the forecourt.', [60, 93]),
      room('forecourt', 'Forecourt', [56, 99, 144, 126], 0, 'A gravel forecourt between the terrace and the carriage gate.', [100, 108]),
      room('lawns', 'Lawns', [3, 25, 30, 127], 0, 'Lawns on either side of the house, shaded by trees along the boundary wall (the east lawn mirrors this one).', [16, 50]),
      room('rock', 'Rock Face & Steps', [0, 0, 200, 25], 1, 'The foot of Knight’s Rock rises above the house. Steps cut into the stone climb toward the Raptor Aerie at its summit.', [150, 8])
    ]
  };
})(window.RT);
