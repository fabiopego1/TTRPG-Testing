/* Template-driven city renderer (Demacia pack) — overrides the generic RT.renderCity in render.js */
(function (RT) {
  const NIGHT = '#0b1730';
  const PAL = {
    day: { floor: '#eee7d0', road: '#f7f1de', roadEdge: '#8a7a5a', water: '#86b8cc', waterEdge: '#5c93ab', ink: '#2a1d10', wall: '#f4f1e6', acc: '#c8aa6e', halo: '#f6edd2', fl: '#fbf8ee', green: '#8fae6a' },
    night: { floor: '#1d2c42', road: '#34506f', roadEdge: '#0b1522', water: '#13354c', waterEdge: '#0d2234', ink: '#dbe7f3', wall: '#9fb4c8', acc: '#d9bc7a', halo: '#071427', fl: '#c9d4e2', green: '#274b3a' }
  };
  const ROOF = {
    royal: ['#f4f1e6'], noble: ['#f4f1e6', '#dfe7f1', '#c9d8ea', '#e8d9a0'], common: ['#e6dcc4', '#cfc4aa', '#bdd0e4', '#d9ceb4'],
    slum: ['#a8998a', '#968877', '#b5a592'], military: ['#8fa3bd', '#7d92ae', '#a9b8cc'], religious: ['#fbf8ee', '#eee6c8', '#dfe8f3'],
    market: ['#d1403a', '#3b6fb0', '#e0b94a', '#f4f1e6'], harbor: ['#8b6b45', '#7a5c3a', '#a0805a']
  };
  const EXCL = { palace: 105, hall: 48, plaza: 78, gardens: 62, temple: 48, library: 42, manor: 52, monument: 34, aviary: 52, sepulchral: 50, barracks: 58, mageseekers: 62, docks: 62, gate: 26, keep: 64, tower: 22, shrine: 30, market: 52, stable: 46, waterfall: 30, mill: 34, inn: 34, hall2: 40 };
  const nightify = (c, on) => on ? RT.mix(c, NIGHT, .5) : c;

  // ---- landmark icons, drawn in local coords around (0,0) ----
  const ICO = {
    palace: p => `<rect x="-72" y="-44" width="144" height="88" rx="6" fill="${p.fl}" stroke="${p.ink}" stroke-width="3"/><rect x="-28" y="-60" width="56" height="62" fill="#fff" stroke="${p.ink}" stroke-width="2.5"/><circle cy="-62" r="24" fill="${p.acc}" stroke="${p.ink}" stroke-width="2.5"/><path d="M-9 -62L0 -84L9 -62Z" fill="#fff" stroke="${p.ink}" stroke-width="1.5"/>` + [[-72, -44], [72, -44], [-72, 44], [72, 44]].map(t => `<circle cx="${t[0]}" cy="${t[1]}" r="14" fill="#fff" stroke="${p.ink}" stroke-width="2.5"/><circle cx="${t[0]}" cy="${t[1]}" r="6" fill="${p.acc}"/>`).join('') + `<path d="M-20 44H20" stroke="${p.acc}" stroke-width="6"/>`,
    hall: p => `<rect x="-34" y="-18" width="68" height="36" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/>` + [-26, -13, 0, 13, 26].map(x => `<circle cx="${x}" cy="14" r="3.5" fill="#fff" stroke="${p.ink}" stroke-width="1.4"/>`).join('') + `<path d="M-34 -18L0 -34L34 -18Z" fill="${p.acc}" stroke="${p.ink}" stroke-width="2"/>`,
    plaza: p => `<circle r="72" fill="none" stroke="${p.ink}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="3 5"/><circle r="40" fill="${p.road}" stroke="${p.ink}" stroke-opacity=".5" stroke-width="2"/><circle r="15" fill="${p.water}" stroke="${p.ink}" stroke-width="2.5"/><circle r="5" fill="${p.acc}" stroke="${p.ink}"/>`,
    gardens: p => `<rect x="-52" y="-34" width="104" height="68" rx="14" fill="${p.green}" stroke="${p.ink}" stroke-width="2.5"/><path d="M-52 0H52M0 -34V34" stroke="${p.road}" stroke-width="6"/>` + [[-26, -17], [26, -17], [-26, 17], [26, 17]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="9" fill="#4f7d45" stroke="${p.ink}" stroke-width="1.5"/>`).join(''),
    temple: p => `<circle r="28" fill="${p.fl}" stroke="${p.ink}" stroke-width="3"/><circle r="17" fill="${p.acc}" stroke="${p.ink}" stroke-width="2"/><path d="M-4 0L-48 -16L-30 6ZM4 0L48 -16L30 6Z" fill="#fff" stroke="${p.ink}" stroke-width="2" stroke-linejoin="round"/>`,
    library: p => `<rect x="-30" y="-17" width="60" height="34" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/>` + [-22, -11, 0, 11, 22].map(x => `<rect x="${x - 2}" y="-17" width="4" height="34" fill="#fff" stroke="${p.ink}" stroke-width="1"/>`).join('') + `<path d="M-34 -17H34L0 -32Z" fill="${p.acc}" stroke="${p.ink}" stroke-width="2"/>`,
    manor: p => `<path d="M-42 -26H42V26H24V-6H-24V26H-42Z" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/><rect x="-24" y="-6" width="48" height="32" fill="${p.green}" stroke="${p.ink}" stroke-width="1.8"/><circle cy="10" r="7" fill="${p.water}" stroke="${p.ink}"/><path d="M-42 -26H42" stroke="${p.acc}" stroke-width="5"/>`,
    monument: p => `<circle r="22" fill="${p.road}" stroke="${p.ink}" stroke-width="2"/><path d="M0 -20L6 -6L18 -8L10 2L14 16L0 8L-14 16L-10 2L-18 -8L-6 -6Z" fill="#fff" stroke="${p.ink}" stroke-width="2" stroke-linejoin="round"/>`,
    aviary: p => [[-24, 8], [0, -14], [24, 8]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="15" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/><circle cx="${c[0]}" cy="${c[1]}" r="6" fill="${p.acc}"/>`).join('') + `<path d="M-40 -28Q-20 -42 0 -32Q20 -42 40 -28Q20 -30 0 -22Q-20 -30 -40 -28Z" fill="#dfe7f1" stroke="${p.ink}" stroke-width="1.8"/>`,
    sepulchral: p => `<rect x="-38" y="-14" width="76" height="28" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/><rect x="-14" y="-38" width="28" height="76" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/><circle r="9" fill="${p.acc}" stroke="${p.ink}" stroke-width="2"/>`,
    barracks: p => `<rect x="-44" y="-22" width="88" height="44" fill="#a9b8cc" stroke="${p.ink}" stroke-width="2.5"/><rect x="-30" y="-8" width="60" height="30" fill="${p.road}" stroke="${p.ink}" stroke-width="1.5"/>` + [-18, 0, 18].map(x => `<circle cx="${x}" cy="8" r="3.5" fill="${p.ink}" opacity=".6"/>`).join(''),
    mageseekers: p => `<rect x="-62" y="-38" width="124" height="76" rx="4" fill="#e4e2db" stroke="${p.ink}" stroke-width="3"/><rect x="-44" y="-22" width="88" height="44" fill="${p.road}" stroke="${p.ink}" stroke-width="1.5"/><path d="M-46 -4Q-24 -34 0 -8Q24 -34 46 -4Q24 -18 0 14Q-24 -18 -46 -4Z" fill="#fff" stroke="${p.acc}" stroke-width="3" stroke-linejoin="round"/>`,
    docks: p => `<rect x="-12" y="-52" width="24" height="70" fill="#a07a4a" stroke="${p.ink}" stroke-width="2"/><rect x="-52" y="4" width="104" height="14" fill="#a07a4a" stroke="${p.ink}" stroke-width="2"/>` + [-40, -20, 20, 40].map(x => `<circle cx="${x}" cy="11" r="3" fill="${p.ink}"/>`).join('') + `<path d="M26 -24Q40 -30 50 -20L44 -8Q34 -4 26 -10Z" fill="#fff" stroke="${p.ink}" stroke-width="2"/>`,
    keep: p => `<rect x="-34" y="-34" width="68" height="68" fill="${p.fl}" stroke="${p.ink}" stroke-width="3"/><rect x="-16" y="-16" width="32" height="32" fill="${p.road}" stroke="${p.ink}" stroke-width="1.5"/>` + [[-34, -34], [34, -34], [-34, 34], [34, 34]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="11" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/>`).join(''),
    tower: p => `<circle r="12" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/><circle r="5" fill="${p.acc}" stroke="${p.ink}" stroke-width="1.5"/>`,
    shrine: p => `<circle r="12" fill="${p.fl}" stroke="${p.acc}" stroke-width="3"/><path d="M-2 0L-22 -9L-14 3ZM2 0L22 -9L14 3Z" fill="#fff" stroke="${p.ink}" stroke-width="1.6" stroke-linejoin="round"/>`,
    market: p => [[-18, -14, '#d1403a'], [4, -14, '#3b6fb0'], [-18, 6, '#e0b94a'], [4, 6, '#d1403a']].map(s => `<rect x="${s[0]}" y="${s[1]}" width="16" height="14" fill="${s[2]}" stroke="${p.ink}" stroke-width="1.6"/>`).join(''),
    stable: p => `<rect x="-38" y="-10" width="76" height="20" fill="#b9a98a" stroke="${p.ink}" stroke-width="2"/>` + [-26, -8, 10, 28].map(x => `<circle cx="${x}" cy="0" r="5" fill="#dfe7f1" stroke="${p.ink}" stroke-width="1.3"/>`).join(''),
    waterfall: p => `<path d="M-22 -22V8M-12 -26V14M0 -28V18M12 -26V14M22 -22V8" stroke="#fff" stroke-width="4" stroke-linecap="round"/><ellipse cy="22" rx="30" ry="10" fill="#cfe7f2" stroke="${p.ink}" stroke-width="1.5"/>`,
    mill: p => `<circle r="12" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/><path d="M0 -30V30M-30 0H30M-21 -21L21 21M21 -21L-21 21" stroke="${p.ink}" stroke-width="2.5"/>`,
    inn: p => `<rect x="-20" y="-14" width="40" height="28" fill="#c9b690" stroke="${p.ink}" stroke-width="2.5"/><path d="M-24 -14L0 -28L24 -14Z" fill="#8b6b45" stroke="${p.ink}" stroke-width="2"/><rect x="22" y="-10" width="8" height="12" fill="${p.acc}" stroke="${p.ink}" stroke-width="1.4"/>`,
    gate: p => `<rect x="-26" y="-12" width="52" height="24" fill="#a07a4a" stroke="${p.ink}" stroke-width="2"/><circle cx="-26" r="14" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/><circle cx="26" r="14" fill="${p.fl}" stroke="${p.ink}" stroke-width="2.5"/>`
  };
  ICO.hall2 = ICO.hall;

  RT.renderCity = function (o) {
    const T = o.city, night = o.theme === 'night', p = night ? PAL.night : PAL.day, era = o.era;
    const X = rx => T.view.cx + rx * T.view.sx, Y = ry => T.view.cy + ry * T.view.sy, P = a => [X(a[0]), Y(a[1])];
    const r = RT.rng(o.seed + '|' + T.id), nz = RT.noise(o.seed + T.id);
    const ground = nightify(T.ground, night);
    const roof = st => ROOF[st].map(c => nightify(c, night));
    // geometry
    const wallPoly = RT.roughPoly(T.wall.map(P), T.id + 'w', .09, 3);
    const waterPolys = (T.water || []).map((w, i) => RT.roughPoly(w.map(P), T.id + 'sea' + i, .35, 4));
    const islandPolys = (T.islands || []).map((w, i) => RT.roughPoly(w.map(P), T.id + 'isl' + i, .25, 3));
    const rivers = (T.rivers || []).map(rv => {
      const pts = []; const base = rv.pts.map(P);
      for (let i = 0; i < base.length - 1; i++) { const a = base[i], b = base[i + 1]; for (let t = 0; t < 1; t += .2) { const wob = (nz(a[0] / 90 + t, a[1] / 90, 2) - .5) * 14; pts.push([RT.lerp(a[0], b[0], t) + wob, RT.lerp(a[1], b[1], t)]); } }
      pts.push(base[base.length - 1]); return { pts, w: rv.w };
    });
    const inWater = pt => waterPolys.some(w => RT.inPoly(pt, w)) && !islandPolys.some(w => RT.inPoly(pt, w)) || rivers.some(rv => { for (let i = 0; i < rv.pts.length - 1; i++) if (RT.distSeg(pt, rv.pts[i], rv.pts[i + 1]) < rv.w / 2 + 6) return true; return false; });
    const inCity = pt => RT.inPoly(pt, wallPoly) || islandPolys.some(w => RT.inPoly(pt, w));
    // nodes: landmarks + extra nodes
    const node = {}; T.landmarks.forEach(l => node[l.id] = [X(l.x), Y(l.y)]); (T.nodes || []).forEach(n => node[n.id] = [X(n.x), Y(n.y)]);
    // roads
    const roads = []; // {pts, kind}
    T.roads.forEach(rd => {
      const A = node[rd[0]], B = node[rd[1]]; if (!A || !B) return; const len = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(2, Math.round(len / 40)), pts = [A];
      for (let i = 1; i < n; i++) { const t = i / n, wob = rd[2] === 'bridge' ? 0 : (nz(A[0] / 70 + i * 3, A[1] / 70 + i, 2) - .5) * Math.min(26, len * .14); pts.push([RT.lerp(A[0], B[0], t) - (B[1] - A[1]) / len * wob, RT.lerp(A[1], B[1], t) + (B[0] - A[0]) / len * wob]); }
      pts.push(B); roads.push({ pts, kind: rd[2] });
    });
    const segs = []; roads.forEach(rd => { for (let i = 0; i < rd.pts.length - 1; i++) segs.push({ a: rd.pts[i], b: rd.pts[i + 1], hw: rd.kind === 'lane' ? 7 : 11, ang: Math.atan2(rd.pts[i + 1][1] - rd.pts[i][1], rd.pts[i + 1][0] - rd.pts[i][0]) * 180 / Math.PI }); });

    let g = `<defs><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .1 0 0 0 .2 0" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/></filter></defs>`;
    g += `<rect x="-3000" y="-3000" width="7600" height="7000" fill="${ground}"/>`;
    if (!night) g += `<rect x="-3000" y="-3000" width="7600" height="7000" filter="url(#paper)" opacity=".7"/>`;
    // outside scenery
    const out = []; let tries = 0;
    while (out.length < 170 && tries++ < 4000) {
      const pt = [60 + r() * 1480, 40 + r() * 920];
      if (inCity(pt) || inWater(pt) || wallPoly.some((q, i) => RT.distSeg(pt, q, wallPoly[(i + 1) % wallPoly.length]) < 26)) continue; out.push(pt);
    }
    if (T.outside === 'fields') out.forEach((pt, i) => { if (i % 3) return; g += `<g transform="translate(${pt[0].toFixed(0)} ${pt[1].toFixed(0)}) rotate(${(r() * 30 - 15).toFixed(0)})" opacity=".85"><rect x="-26" y="-16" width="52" height="32" fill="${nightify(['#c5d38a', '#d8d37a', '#b9cf8a'][i % 3 % 3], night)}" stroke="${p.ink}" stroke-opacity=".35"/><path d="M-26 -8H26M-26 0H26M-26 8H26" stroke="${p.ink}" stroke-opacity=".18"/></g>`; });
    out.forEach((pt, i) => {
      const s = 7 + r() * 6, x = pt[0].toFixed(1), y = pt[1].toFixed(1);
      if (T.outside === 'fields' && i % 3 === 0) return;
      if (T.outside === 'rocks') g += `<path d="M${x - s} ${+y + s * .5}L${x - s * .2} ${y - s}L${+x + s} ${+y + s * .5}Z" fill="${nightify('#a39e92', night)}" stroke="${p.ink}" stroke-opacity=".5"/>`;
      else if (T.outside === 'snow') g += `<path d="M${x} ${y - s}L${+x + s * .6} ${+y + s * .6}H${x - s * .6}Z" fill="${nightify('#f5fbff', night)}" stroke="${p.ink}" stroke-opacity=".5"/>`;
      else g += `<circle cx="${x}" cy="${y}" r="${s * .8}" fill="${nightify('#6f9a55', night)}" stroke="${p.ink}" stroke-opacity=".5"/>`;
    });
    // city floor
    g += `<path d="${RT.pathOf(wallPoly)}" fill="${p.floor}"/>`;
    // water
    const wFill = `fill="${p.water}" stroke="${p.waterEdge}" stroke-width="3"`;
    waterPolys.forEach(w => { g += `<path d="${RT.pathOf(w)}" ${wFill}/><path d="${RT.pathOf(w)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="9" transform="translate(0 0)"/>`; });
    for (let i = 0; i < 70 && waterPolys.length; i++) { const pt = [r() * 1600, r() * 1000]; if (inWater(pt) && !islandPolys.some(w => RT.inPoly(pt, w))) g += `<path d="M${pt[0] - 9} ${pt[1]}q4 -4 9 0t9 0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/>`; }
    islandPolys.forEach(w => { g += `<path d="${RT.pathOf(w)}" fill="${p.floor}" stroke="${p.ink}" stroke-width="2.5"/>`; });
    rivers.forEach(rv => { const d = 'M' + rv.pts.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L'); g += `<path d="${d}" fill="none" stroke="${p.waterEdge}" stroke-width="${rv.w + 6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${p.water}" stroke-width="${rv.w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3" stroke-dasharray="8 14" stroke-linecap="round"/>`; });
    // hills (rock mounds)
    (T.hills || []).forEach(h => {
      const cx = X(h.x), cy = Y(h.y);
      for (let k = 0; k < 6; k++) { const rr = h.r * (1 - k * .16), poly = []; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; poly.push([cx + Math.cos(a) * rr * (.92 + nz(Math.cos(a) + k, Math.sin(a) + 7, 2) * .2), cy + Math.sin(a) * rr * .85 * (.92 + nz(Math.cos(a) + 3, Math.sin(a) + k, 2) * .2)]); } g += `<path d="${RT.pathOf(RT.roughPoly(poly, T.id + 'h' + k, .1, 2))}" fill="${nightify(RT.mix('#b9b4a4', '#e6e2d6', k / 5), night)}" stroke="${p.ink}" stroke-opacity=".5" stroke-width="1.4"/>`; }
    });
    // roads (edges then fills)
    const rpath = rd => 'M' + rd.pts.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L');
    g += '<g fill="none" stroke-linecap="round" stroke-linejoin="round">';
    roads.forEach(rd => { g += `<path d="${rpath(rd)}" stroke="${rd.kind === 'bridge' ? p.ink : p.roadEdge}" stroke-width="${rd.kind === 'lane' ? 14 : rd.kind === 'bridge' ? 30 : 24}" stroke-opacity="${rd.kind === 'bridge' ? .9 : .55}"/>`; });
    roads.forEach(rd => { g += `<path d="${rpath(rd)}" stroke="${rd.kind === 'bridge' ? '#b8935a' : p.road}" stroke-width="${rd.kind === 'lane' ? 10 : rd.kind === 'bridge' ? 26 : 20}"/>`; if (rd.kind === 'bridge') g += `<path d="${rpath(rd)}" stroke="${p.ink}" stroke-opacity=".35" stroke-width="26" stroke-dasharray="2 7" stroke-linecap="butt"/>`; });
    g += '</g>';
    // buildings
    const dist = T.districts.map(d => ({ x: X(d.x), y: Y(d.y), st: d.style }));
    const lmEx = T.landmarks.map(l => ({ x: X(l.x), y: Y(l.y), r: l.type === 'gate' ? 26 : (EXCL[l.type] || 30) })).concat((T.hills || []).map(h => ({ x: X(h.x), y: Y(h.y), r: h.r * .8 })));
    const bb = RT.bbox(wallPoly), bld = [], hash = {}; const ACC = { royal: 0, noble: .4, common: .85, slum: .96, military: .6, religious: .5, market: .9, harbor: .75 };
    const SZ = { noble: [30, 16, 24, 10], common: [16, 10, 12, 6], slum: [10, 6, 8, 4], military: [40, 20, 14, 4], religious: [20, 10, 18, 8], market: [9, 4, 9, 4], harbor: [26, 10, 14, 4] };
    let nTry = 0;
    while (bld.length < 1250 && nTry++ < 26000) {
      const x = bb.x0 + r() * bb.w, y = bb.y0 + r() * bb.h, pt = [x, y]; if (!inCity(pt) || inWater(pt)) continue;
      let best = 0, bd = 1e12; dist.forEach((d, i) => { const dd = (d.x - x) ** 2 + (d.y - y) ** 2; if (dd < bd) { bd = dd; best = i; } });
      const st = dist[best].st; if (r() > ACC[st]) continue;
      const sz = SZ[st], w = sz[0] + r() * sz[1], h = sz[2] + r() * sz[3], rad = (w + h) / 4 + 1;
      let dm = 1e9, ns = null; for (const s of segs) { const dd = RT.distSeg(pt, s.a, s.b) - s.hw; if (dd < dm) { dm = dd; ns = s; } } if (ns && dm < h / 2 + 3) continue;
      if (lmEx.some(l => Math.hypot(l.x - x, l.y - y) < l.r + rad)) continue;
      if (wallPoly.some((q, i) => RT.distSeg(pt, q, wallPoly[(i + 1) % wallPoly.length]) < rad + 14)) continue;
      const hx = Math.floor(x / 40), hy = Math.floor(y / 40); let clash = false;
      for (let a = -1; a <= 1 && !clash; a++) for (let b = -1; b <= 1 && !clash; b++) (hash[(hx + a) + ',' + (hy + b)] || []).forEach(o2 => { if (Math.hypot(o2.x - x, o2.y - y) < (o2.rad + rad) * .92) clash = true; });
      if (clash) continue;
      let ang = ns ? ns.ang + (r() - .5) * (st === 'slum' ? 50 : 14) : r() * 90; if (st === 'military') ang = Math.round(ang / 90) * 90;
      const B = { x, y, w, h, a: ang, st, rad, ci: Math.floor(r() * 99) }; bld.push(B); (hash[hx + ',' + hy] = hash[hx + ',' + hy] || []).push(B);
    }
    g += `<g stroke="${p.ink}" stroke-width="1.2" stroke-opacity=".7">`;
    bld.forEach(b => {
      const cols = roof(b.st), c = cols[b.ci % cols.length];
      g += `<g transform="translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.a.toFixed(0)})"><rect x="${(-b.w / 2).toFixed(1)}" y="${(-b.h / 2).toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="${b.st === 'religious' && b.ci % 3 === 0 ? b.h / 2 : 1}" fill="${c}"/>${b.w > 14 && b.st !== 'market' ? `<path d="M${(-b.w / 2).toFixed(1)} 0H${(b.w / 2).toFixed(1)}" stroke-opacity=".3"/>` : ''}</g>`;
    });
    g += '</g>';
    // walls
    g += `<path d="${RT.pathOf(wallPoly)}" fill="none" stroke="${p.ink}" stroke-width="16" stroke-linejoin="round"/><path d="${RT.pathOf(wallPoly)}" fill="none" stroke="${p.wall}" stroke-width="11" stroke-linejoin="round"/><path d="${RT.pathOf(wallPoly)}" fill="none" stroke="${p.ink}" stroke-opacity=".35" stroke-width="3" stroke-dasharray="5 5" stroke-linejoin="round"/>`;
    T.wall.map(P).forEach(q => { g += `<circle cx="${q[0]}" cy="${q[1]}" r="13" fill="${p.wall}" stroke="${p.ink}" stroke-width="3"/><circle cx="${q[0]}" cy="${q[1]}" r="5" fill="${p.acc}" stroke="${p.ink}"/>`; });
    // district hit areas + labels
    g += '<g font-family="Cinzel,Georgia,serif" text-anchor="middle">';
    T.districts.forEach(d => { const x = X(d.x), y = Y(d.y); g += `<g class="poi" data-kind="district" data-id="${d.id}"><circle cx="${x}" cy="${y}" r="46" fill="transparent"/>${o.labels ? `<text x="${x}" y="${y + 4}" font-size="13" font-style="italic" letter-spacing="2" fill="${p.ink}" stroke="${p.halo}" stroke-width="4" paint-order="stroke" opacity=".72">${RT.esc(d.n.toUpperCase())}</text>` : ''}</g>`; });
    g += '</g>';
    // landmarks
    T.landmarks.forEach((l, i) => {
      const x = X(l.x), y = Y(l.y), sc = l.s || 1; let ang = 0;
      if (l.type === 'gate') { let bd = 1e9, bi = 0; wallPoly.forEach((q, k) => { const d = RT.distSeg([x, y], q, wallPoly[(k + 1) % wallPoly.length]); if (d < bd) { bd = d; bi = k; } }); const a = wallPoly[bi], b = wallPoly[(bi + 1) % wallPoly.length]; ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; }
      const sel = o.sel === 'landmark:' + l.id;
      g += `<g class="poi${sel ? ' sel' : ''}" data-kind="landmark" data-id="${l.id}"><circle cx="${x}" cy="${y}" r="${(EXCL[l.type] || 30) * .75}" fill="transparent"/><g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(0)}) scale(${sc})">${(ICO[l.type] || ICO.tower)(p)}</g>`;
      if (o.numbers) g += `<g pointer-events="none"><circle cx="${x + (EXCL[l.type] || 30) * .55}" cy="${y - (EXCL[l.type] || 30) * .55}" r="10" fill="${night ? '#071427' : '#f6edd2'}" stroke="${p.acc}" stroke-width="2.5"/><text x="${x + (EXCL[l.type] || 30) * .55}" y="${y - (EXCL[l.type] || 30) * .55 + 4}" text-anchor="middle" font-size="11" font-weight="700" font-family="Cinzel,Georgia,serif" fill="${p.ink}">${i + 1}</text></g>`;
      g += '</g>';
      if (o.labels && l.type !== 'gate') g += `<text x="${x}" y="${y + (EXCL[l.type] || 30) * .75 + 14}" text-anchor="middle" font-size="12" font-family="Cinzel,Georgia,serif" fill="${p.ink}" stroke="${p.halo}" stroke-width="3.4" paint-order="stroke" pointer-events="none">${RT.esc(l.n)}</text>`;
    });
    if (o.grid) { const st = 100 / (T.ft || 1.5); let gl = ''; for (let x = 0; x <= RT.W; x += st) gl += `M${x.toFixed(1)} 0V${RT.H}`; for (let y = 0; y <= RT.H; y += st) gl += `M0 ${y.toFixed(1)}H${RT.W}`; g += `<path id="grid" d="${gl}" fill="none" stroke="${p.ink}" stroke-opacity=".16" stroke-width="1" pointer-events="none"/>`; }
    // night overlay + lanterns
    if (night) {
      g += `<rect x="-3000" y="-3000" width="7600" height="7000" fill="#06142e" opacity=".32" pointer-events="none"/>`;
      bld.forEach((b, i) => { if (i % 6 === 0) g += `<circle cx="${b.x.toFixed(0)}" cy="${b.y.toFixed(0)}" r="9" fill="#ffd27a" opacity=".22" pointer-events="none"/><circle cx="${b.x.toFixed(0)}" cy="${b.y.toFixed(0)}" r="2.4" fill="#ffe3a0" pointer-events="none"/>`; });
      T.landmarks.forEach(l => { g += `<circle cx="${X(l.x)}" cy="${Y(l.y)}" r="26" fill="#ffd27a" opacity=".14" pointer-events="none"/>`; });
    }
    // title
    g += `<text x="${RT.W / 2}" y="76" text-anchor="middle" font-size="44" letter-spacing="7" font-family="Cinzel,Georgia,serif" fill="${p.ink}" stroke="${p.halo}" stroke-width="7" paint-order="stroke" pointer-events="none">${RT.esc(T.name.toUpperCase())}</text><text x="${RT.W / 2}" y="104" text-anchor="middle" font-size="16" font-family="Cinzel,Georgia,serif" fill="${p.ink}" opacity=".85" stroke="${p.halo}" stroke-width="3" paint-order="stroke" pointer-events="none">${RT.esc(T.tag)}${era ? ' · ' + RT.esc(era) : ''}</text>`;
    return g;
  };
})(window.RT);
