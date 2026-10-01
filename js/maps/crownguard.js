/* House Crownguard Mansion, High Silvermere — authored in feet (1 unit = 1 ft). 200 × 130 ft.
   The house stands at the foot of Knight's Rock (canon, as does its library). The floor plan is invented and kept to what a
   noble house needs. Every object is sized against a person (shoulders ≈ 1.5 ft):
   chair 1.5 · armchair 2.5 · sofa 6.5×2.8 · dining table 3.2 wide, 2.2 ft per diner · desk 5×2.5 · bookcase 1.2 deep ·
   barrel 2.2 · interior door 3 · double door 5 · entrance 6 · interior wall 1.2 · exterior wall 2 · stair 5–6 wide, 1 ft tread. */
(function (RT) {
  const d = [];
  const add = o => (d.push(o), o);
  const rect = (x, y, w, h, fill, e) => add(Object.assign({ k: 'rect', x, y, w, h, fill }, e));
  const wall = (x1, y1, x2, y2, t) => add({ k: 'wall2', x1, y1, x2, y2, t });
  const F = (t, x, y, w, h, rot, e) => add(Object.assign({ k: 'f', t, x, y, w, h, rot: rot || 0 }, e));
  const door = (x, y, w, dir, t) => add({ k: 'door', x, y, w, dir, t: t || 1.2 });
  const win = (x, y, dir, w) => add({ k: 'win', x, y, dir, w: w || 3 });
  const light = (x, y, r, moon) => add({ k: 'light', x, y, r, moon: !!moon });
  const chair = (x, y, rot, c) => F('chair', x, y, 1.5, 1.5, rot || 0, { c: c || '#6d4c2a' });

  // ---- ground: lawn, the foot of Knight's Rock behind the house, service yard, terrace, forecourt
  rect(-200, -200, 600, 530, 'url(#grass)');
  add({ k: 'poly', pts: [[0, 0], [200, 0], [200, 19], [178, 16], [152, 20], [126, 15], [105, 19], [82, 15], [54, 19], [28, 15], [0, 18]], fill: 'url(#rockface)', stroke: '#4d4a42', sw: .8, sh: 1.2 });
  add({ k: 'poly', pts: [[0, 0], [200, 0], [200, 8], [160, 10], [120, 7], [80, 10], [40, 7], [0, 9]], fill: '#6f6b62', op: .55 });
  add({ k: 'path', d: 'M10 16L18 11M34 14L44 9M64 16L72 10M92 17L98 11M116 14L124 9M140 18L150 12M164 15L172 10M186 16L192 10', stroke: '#33312c', sw: .7, op: .6 });
  rect(44, 21, 112, 22, 'url(#gravel)', { rx: 1 });                 // service yard behind the house (22 ft deep: room for a cart to turn)
  rect(94, 16, 12, 8, 'url(#flag)', { sh: .6 });                    // landing at the foot of the carved steps
  F('stair', 100, 13, 6, 8, 0, { dir: 'v', arrow: true });          // steps cut into the rock toward the Aerie (6 ft wide)
  rect(50, 97, 100, 9, 'url(#flag)', { stroke: '#6f6b60', sw: .6, sh: 1 });   // terrace, 9 ft deep
  wall(50, 105.6, 94, 105.6, 1); wall(102, 105.6, 150, 105.6, 1);   // balustrade with an 8-ft gap for the steps
  F('stair', 98, 108.5, 8, 5, 0, { dir: 'v' });
  rect(66, 106, 68, 21, 'url(#gravel)', { rx: 2, stroke: '#a89c7c', sw: .5 });   // forecourt
  rect(94, 120, 12, 9, 'url(#gravel)');                             // drive to the carriage gate

  // ---- floors: flagstone in work rooms, boards in living rooms, marble in the hall
  rect(59, 45, 19, 22, 'url(#flag)'); rect(78, 45, 15, 22, 'url(#woodDark)'); rect(93, 45, 27, 22, 'url(#wood)'); rect(120, 45, 21, 22, 'url(#wood)');
  rect(59, 67, 24, 29, 'url(#wood)'); rect(83, 67, 30, 29, 'url(#marble)'); rect(113, 67, 28, 29, 'url(#wood)');
  F('rug', 106.5, 55, 17, 10, 0, { c: '#6b2c3a' }); F('rug', 98, 82, 4, 24, 0, { c: '#7e2f36' });
  F('rug', 71, 81.5, 14, 8, 0, { c: '#4a3a6a' }); F('rug', 127, 81.5, 14, 11, 0, { c: '#2f4f7a' }); F('rug', 128, 54, 8, 6, 0, { c: '#4d6a3a' });

  // ---- walls: exterior 2 ft, partitions 1.2 ft (house 84 × 52 ft)
  wall(58, 44, 142, 44, 2); wall(58, 96, 142, 96, 2); wall(58, 44, 58, 96, 2); wall(142, 44, 142, 96, 2);
  wall(58, 67, 142, 67, 1.2);
  [78, 93, 120].forEach(x => wall(x, 44, x, 67, 1.2)); [83, 113].forEach(x => wall(x, 67, x, 96, 1.2));
  // ---- doors (x,y = centre of the opening): interior 3 ft, double 5 ft, entrance 6 ft
  door(78, 56, 3, 'v'); door(93, 56, 3, 'v'); door(120, 52, 3, 'v');
  door(68, 67, 3, 'h'); door(103, 67, 5, 'h'); door(135, 67, 3, 'h');
  door(83, 80, 5, 'v'); door(113, 80, 5, 'v');
  door(98, 96, 6, 'h', 2); door(135, 96, 4, 'h', 2); door(75, 44, 3.5, 'h', 2); door(86, 44, 3, 'h', 2);
  [[62, 44], [106.5, 44, 'h', 4], [131, 44], [65.5, 96], [77, 96], [90, 96], [106, 96], [119, 96], [128, 96]].forEach(w => win(w[0], w[1], 'h', w[3]));
  [[58, 55], [58, 75], [58, 88], [142, 55], [142, 75], [142, 88]].forEach(w => win(w[0], w[1], 'v'));

  // ---- kitchen (19 × 22): hearth, work table, pantry shelves, stores
  F('hearth', 68, 46.4, 7, 2.6); F('table', 68, 56, 8, 3, 0, { c: '#a58660' });
  F('shelf', 59.8, 50, 1.2, 6); F('shelf', 59.8, 60, 1.2, 6);
  F('barrel', 75.9, 64.2, 2.2); F('barrel', 73.4, 64.8, 2.2); F('crate', 61.2, 64.6, 2, 2);
  // ---- servants' hall (15 × 22)
  F('table', 85.5, 55, 3, 8); F('bench', 82.6, 55, 1.2, 7); F('bench', 88.4, 55, 1.2, 7); F('shelf', 92.2, 60.5, 1.2, 5);
  // ---- library (27 × 22): shelves on the walls between the doors; two reading tables; the Canticle on its lectern under the window
  F('shelf', 99.3, 45.7, 9.6, 1.2); F('shelf', 114, 45.7, 10, 1.2);
  F('shelf', 93.8, 50, 1.2, 7); F('shelf', 93.8, 62, 1.2, 7); F('shelf', 119.2, 59, 1.2, 12);
  F('shelf', 97.5, 66.2, 6, 1.2); F('shelf', 112.5, 66.2, 10, 1.2);
  F('table', 100, 55, 6, 3); F('table', 113, 55, 6, 3);
  [[98, 52.6, 0], [102, 52.6, 0], [98, 57.4, 180], [102, 57.4, 180], [111, 52.6, 0], [115, 52.6, 0], [111, 57.4, 180], [115, 57.4, 180]].forEach(p => chair(p[0], p[1], p[2]));
  F('lectern', 106.5, 47.4, 2.4, 1.8); light(106.5, 48, 14);
  // ---- study (21 × 22)
  F('table', 131, 49.5, 5, 2.5, 0, { c: '#5a3d28' }); chair(131, 52.4, 0, '#7a2f36'); F('shelf', 140.2, 56, 1.2, 12);
  F('cloth', 127, 60, 4, 3, 0, { c: '#5a3d28' }); chair(124, 58, 270);
  // ---- dining hall (24 × 29): a table for ten, 2.2 ft per diner
  F('hearth', 60.2, 81.5, 2.4, 5); F('table', 71, 81.5, 9, 3.2, 0, { c: '#7a5232' });
  [67.7, 69.9, 72.1, 74.3].forEach(x => { chair(x, 79.1, 0, '#7a4f2d'); chair(x, 83.9, 180, '#7a4f2d'); });
  chair(65.6, 81.5, 90, '#8a3a32'); chair(76.4, 81.5, 270, '#8a3a32');
  F('table', 66, 94.2, 5, 1.8, 0, { c: '#5a3d28' }); F('table', 77, 94.2, 5, 1.8, 0, { c: '#5a3d28' });
  // ---- great hall (30 × 29): the reception hall — one stair, a runner from the entrance
  F('stair', 87, 74, 5, 11, 0, { dir: 'v' }); F('bench', 91.5, 93.9, 5, 1.3); F('bench', 105, 93.9, 5, 1.3);
  light(98, 80, 26);
  // ---- drawing room (28 × 29)
  F('hearth', 140, 81.5, 2.4, 5); F('sofa', 122, 74, 6.5, 2.8, 0, { c: '#3e5f8a' }); F('sofa', 122, 89, 6.5, 2.8, 180, { c: '#3e5f8a' });
  F('table', 127, 81.5, 3.5, 2, 0, { round: true, c: '#7a5232' }); F('sofa', 121.5, 81.5, 2.5, 2.5, 90, { c: '#7a2f36' }); F('sofa', 132.5, 81.5, 2.5, 2.5, 270, { c: '#7a2f36' });

  // ---- lights for night
  light(68, 48, 14); light(61, 81.5, 16); light(140, 81.5, 16); light(94, 127, 12); light(106, 127, 12); light(54, 101, 10); light(146, 101, 10);

  // ---- grounds: boundary wall with a carriage gate (12 ft), shade trees along the walls
  wall(1.5, 14, 1.5, 129, 3); wall(198.5, 14, 198.5, 129, 3); wall(1, 128.5, 94, 128.5, 3); wall(106, 128.5, 199, 128.5, 3);
  F('pillar', 94.2, 128.5, 3.2); F('pillar', 105.8, 128.5, 3.2); F('lamp', 94.2, 126.6, 1); F('lamp', 105.8, 126.6, 1);
  add({ k: 'trees', kind: 'oak', list: [[10, 44, 7], [11, 80, 8], [10, 112, 7.5], [190, 44, 7], [189, 80, 8], [190, 112, 7.5], [34, 118, 6.5], [166, 118, 6.5]] });

  const room = (id, n, r, c, dsc, mk) => Object.assign({ id, n, rect: r, c, d: dsc }, mk ? { mx: mk[0], my: mk[1] } : {});
  RT.MAPS.crownguard = {
    id: 'crownguard', level: 'site', parent: 'silvermere', name: 'House Crownguard Mansion', tag: 'High Silvermere · noble house at the foot of Knight’s Rock',
    w: 200, h: 130, ground: '#98b673', draw: d, lights: [],
    summary: 'The seat of House Crownguard stands at the foot of Knight’s Rock, its grounds backing onto the rock face. The house and its library are from the lore; the floor plan is invented.',
    dims: ['Grounds: 200 × 130 ft. House: 84 × 52 ft.', 'Walls: exterior 2 ft, interior 1.2 ft.', 'Doors: interior 3 ft, double 5 ft, entrance 6 ft; carriage gate 12 ft.'],
    features: [
      room('library', 'Library', [93, 45, 120, 67], 1, 'The Crownguard family library, which holds the “Canticle of the Winged Sisters”, an epic poem about Kayle and Morgana. Shelves fill the walls between the doors; the Canticle rests on a lectern beneath the north window.'),
      room('greathall', 'Great Hall', [83, 67, 113, 96], 0, 'A marble reception hall just inside the main entrance, with a stair to the upper floor and a runner leading in from the door.'),
      room('dining', 'Dining Hall', [59, 67, 83, 96], 0, 'A table for ten with a fireplace at the west end and sideboards along the south wall.'),
      room('drawing', 'Drawing Room', [113, 67, 141, 96], 0, 'Sofas and armchairs around a low table, with a fireplace in the east wall. A glazed door leads out to the terrace.'),
      room('study', 'Study', [120, 45, 141, 67], 0, 'A working study: a desk, a map table and shelves of ledgers.'),
      room('kitchen', 'Kitchen', [59, 45, 78, 67], 0, 'A flagstone kitchen with a wide hearth, a work table and stores. A back door opens to the service yard.'),
      room('servants', 'Servants’ Hall', [78, 45, 93, 67], 0, 'A long table and benches where the household staff eat. A back door opens to the service yard.'),
      room('yard', 'Service Yard', [44, 21, 156, 43], 0, 'A gravel yard behind the house, 22 ft deep, where deliveries arrive. The steps up the rock begin at its north edge.', [150, 32]),
      room('terrace', 'Terrace', [50, 97, 150, 106], 0, 'A flagstone terrace across the front of the house behind a low balustrade; steps lead down to the forecourt.', [60, 101.5]),
      room('forecourt', 'Forecourt', [66, 106, 134, 126], 0, 'A gravel forecourt between the terrace and the carriage gate.', [76, 116]),
      room('lawns', 'Lawns', [3, 21, 50, 127], 0, 'Lawns on either side of the house, shaded by trees along the boundary wall (the east lawn mirrors this one).', [26, 60]),
      room('rock', 'Rock Face & Steps', [0, 0, 200, 21], 1, 'The foot of Knight’s Rock rises above the house. Steps cut into the stone climb toward the Raptor Aerie at its summit.', [150, 9])
    ]
  };
})(window.RT);
