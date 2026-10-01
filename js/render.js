/* Runeterra Atlas — SVG renderers (continent/region, city, battle) */
(function (RT) {
  const SHAPE_SEED = 'runeterra';
  const THEMES = {
    parchment: { name: 'Parchment', ocean: ['#cfdcd6', '#a9c3c2'], base: '#e8d6a8', mixT: 0.5, ink: '#3b2a17', border: '#7a5a2e', halo: '#f4ead0', glow: '#ffffff', gold: '#8a6a2b', paper: true },
    hextech: { name: 'Hextech', ocean: ['#04202f', '#010a13'], base: '#0b2a3a', mixT: 0.6, ink: '#c8e6e0', border: '#c8aa6e', halo: '#04141f', glow: '#0ac8b9', gold: '#c8aa6e', paper: false },
    political: { name: 'Political', ocean: ['#9fc4dd', '#7aa7c7'], base: '#ffffff', mixT: 0, ink: '#1d2a38', border: '#ffffff', halo: '#ffffffcc', glow: '#ffffff', gold: '#1d2a38', paper: false }
  };
  RT.THEMES = THEMES;

  const LABELS = { freljord: [760, 172],  bandle: [165, 484, 18], shadow: [215, 836, 20], bilgewater: [1435, 820, 18], piltover: [1055, 312, 15], zaun: [1040, 535, 17] };
  const landColor = (th, r) => RT.mix(r.color, th.base, th.mixT);

  // ---------- region geometry (cached) ----------
  let polyCache = {};
  RT.regionPolys = function (depth) {
    const key = depth;
    if (polyCache[key]) return polyCache[key];
    const out = {};
    RT.REGIONS.forEach(r => { out[r.id] = RT.roughPoly(r.ctrl, SHAPE_SEED, r.rough, depth); });
    return (polyCache[key] = out);
  };
  const regionById = id => RT.REGIONS.find(r => r.id === id);
  RT.regionById = regionById;
  RT.regionBBox = id => RT.bbox(RT.regionPolys(5)[id]);

  // ---------- icons ----------
  const ICON = {
    mountain: (x, y, s, c) => `<path d="M${x - s} ${y + s * .6}L${x - s * .15} ${y - s * .8}L${x + s * .35} ${y - s * .1}L${x + s * .65} ${y - s * .45}L${x + s} ${y + s * .6}Z" fill="${c.fill}" stroke="${c.ink}" stroke-width="${s * .09}" stroke-linejoin="round"/><path d="M${x - s * .15} ${y - s * .8}L${x + s * .2} ${y + s * .6}L${x - s} ${y + s * .6}Z" fill="${c.ink}" opacity=".22"/>`,
    hill: (x, y, s, c) => `<path d="M${x - s} ${y + s * .3}Q${x} ${y - s * .9} ${x + s} ${y + s * .3}" fill="none" stroke="${c.ink}" stroke-width="${s * .12}" stroke-linecap="round"/>`,
    pine: (x, y, s, c) => `<path d="M${x} ${y - s}L${x + s * .55} ${y + s * .1}H${x + s * .25}L${x + s * .65} ${y + s * .75}H${x - s * .65}L${x - s * .25} ${y + s * .1}H${x - s * .55}Z" fill="${c.tree}" stroke="${c.ink}" stroke-width="${s * .07}" stroke-linejoin="round"/>`,
    tree: (x, y, s, c) => `<circle cx="${x}" cy="${y - s * .15}" r="${s * .6}" fill="${c.tree}" stroke="${c.ink}" stroke-width="${s * .08}"/><path d="M${x} ${y + s * .45}V${y + s * .85}" stroke="${c.ink}" stroke-width="${s * .12}"/>`,
    palm: (x, y, s, c) => `<path d="M${x} ${y + s * .8}Q${x + s * .1} ${y} ${x} ${y - s * .5}" stroke="${c.ink}" stroke-width="${s * .1}" fill="none"/><path d="M${x} ${y - s * .5}Q${x - s * .5} ${y - s * .8} ${x - s * .8} ${y - s * .2}M${x} ${y - s * .5}Q${x + s * .5} ${y - s * .8} ${x + s * .8} ${y - s * .2}M${x} ${y - s * .5}Q${x} ${y - s * 1.1} ${x - s * .3} ${y - s * 1}M${x} ${y - s * .5}Q${x + s * .1} ${y - s * 1.1} ${x + s * .4} ${y - s}" stroke="${c.tree}" stroke-width="${s * .18}" fill="none" stroke-linecap="round"/>`,
    dune: (x, y, s, c) => `<path d="M${x - s} ${y + s * .2}Q${x - s * .2} ${y - s * .7} ${x + s * .3} ${y}T${x + s} ${y + s * .15}" fill="none" stroke="${c.ink}" stroke-width="${s * .1}" stroke-linecap="round" opacity=".7"/>`,
    cactus: (x, y, s, c) => `<path d="M${x} ${y + s * .6}V${y - s * .6}M${x} ${y}H${x - s * .4}V${y - s * .35}M${x} ${y + s * .15}H${x + s * .4}V${y - s * .2}" stroke="${c.tree}" stroke-width="${s * .2}" fill="none" stroke-linecap="round"/>`,
    dead: (x, y, s, c) => `<path d="M${x} ${y + s * .7}V${y - s * .5}M${x} ${y}L${x - s * .5} ${y - s * .5}M${x} ${y - s * .15}L${x + s * .5} ${y - s * .65}M${x} ${y - s * .5}L${x - s * .2} ${y - s * .9}" stroke="${c.ink}" stroke-width="${s * .1}" fill="none" stroke-linecap="round" opacity=".85"/>`,
    ruin: (x, y, s, c) => `<path d="M${x - s * .7} ${y + s * .5}V${y - s * .1}L${x - s * .5} ${y - s * .4}V${y + s * .5}M${x} ${y + s * .5}V${y - s * .6}M${x + s * .6} ${y + s * .5}V${y}L${x + s * .8} ${y - s * .2}V${y + s * .5}" stroke="${c.ink}" stroke-width="${s * .14}" fill="none" stroke-linecap="round"/>`,
    bldg: (x, y, s, c) => `<rect x="${x - s * .5}" y="${y - s * .3}" width="${s}" height="${s * .8}" fill="${c.fill}" stroke="${c.ink}" stroke-width="${s * .08}"/><path d="M${x - s * .6} ${y - s * .3}L${x} ${y - s * .8}L${x + s * .6} ${y - s * .3}Z" fill="${c.tree}" stroke="${c.ink}" stroke-width="${s * .08}"/>`,
    crystal: (x, y, s, c) => `<path d="M${x} ${y - s}L${x + s * .4} ${y}L${x} ${y + s * .6}L${x - s * .4} ${y}Z" fill="${c.glow}" stroke="${c.ink}" stroke-width="${s * .07}" opacity=".85"/>`,
    shroom: (x, y, s, c) => `<path d="M${x - s * .7} ${y}Q${x} ${y - s * 1.1} ${x + s * .7} ${y}Z" fill="#e48fb5" stroke="${c.ink}" stroke-width="${s * .07}"/><rect x="${x - s * .15}" y="${y}" width="${s * .3}" height="${s * .5}" fill="${c.fill}" stroke="${c.ink}" stroke-width="${s * .06}"/>`
  };

  function poiIcon(p, x, y, s, th) {
    const ink = th.ink, g = th.gold, fill = th === THEMES.hextech ? '#0a1a2a' : '#f7ecd0';
    const k = s;
    switch (p.type) {
      case 'city': return `<circle cx="${x}" cy="${y}" r="${k * 1.05}" fill="${fill}" stroke="${g}" stroke-width="${k * .22}"/><path d="M${x - k * .55} ${y + k * .5}V${y - k * .1}H${x - k * .3}V${y - k * .35}H${x - k * .1}V${y - k * .1}H${x + k * .1}V${y - k * .35}H${x + k * .3}V${y - k * .1}H${x + k * .55}V${y + k * .5}Z" fill="${ink}"/>`;
      case 'port': return `<circle cx="${x}" cy="${y}" r="${k * 1.05}" fill="${fill}" stroke="${g}" stroke-width="${k * .22}"/><path d="M${x} ${y - k * .6}V${y + k * .6}M${x - k * .5} ${y}H${x + k * .5}M${x - k * .55} ${y + k * .15}Q${x} ${y + k * .85} ${x + k * .55} ${y + k * .15}" stroke="${ink}" stroke-width="${k * .16}" fill="none" stroke-linecap="round"/>`;
      case 'fortress': return `<rect x="${x - k * .9}" y="${y - k * .9}" width="${k * 1.8}" height="${k * 1.8}" fill="${fill}" stroke="${g}" stroke-width="${k * .22}" transform="rotate(45 ${x} ${y})"/><path d="M${x - k * .4} ${y + k * .4}V${y - k * .3}H${x - k * .2}V${y - k * .1}H${x}V${y - k * .3}H${x + k * .2}V${y - k * .1}H${x + k * .4}V${y + k * .4}Z" fill="${ink}"/>`;
      case 'ruin': return `<circle cx="${x}" cy="${y}" r="${k}" fill="${fill}" stroke="${g}" stroke-width="${k * .18}" stroke-dasharray="${k * .5} ${k * .3}"/>` + ICON.ruin(x, y, k * .8, { ink });
      case 'shrine': return `<circle cx="${x}" cy="${y}" r="${k}" fill="${fill}" stroke="${g}" stroke-width="${k * .2}"/><path d="M${x} ${y - k * .6}L${x + k * .15} ${y - k * .15}L${x + k * .6} ${y}L${x + k * .15} ${y + k * .15}L${x} ${y + k * .6}L${x - k * .15} ${y + k * .15}L${x - k * .6} ${y}L${x - k * .15} ${y - k * .15}Z" fill="${ink}"/>`;
      case 'camp': return `<path d="M${x - k} ${y + k * .7}L${x} ${y - k}L${x + k} ${y + k * .7}Z" fill="${fill}" stroke="${g}" stroke-width="${k * .2}" stroke-linejoin="round"/><path d="M${x} ${y - k * .2}V${y + k * .7}" stroke="${ink}" stroke-width="${k * .14}"/>`;
      case 'cave': return `<path d="M${x - k} ${y + k * .6}Q${x - k} ${y - k} ${x} ${y - k}Q${x + k} ${y - k} ${x + k} ${y + k * .6}Z" fill="${ink}" stroke="${g}" stroke-width="${k * .2}"/>`;
      case 'hamlet': return `<circle cx="${x}" cy="${y}" r="${k * .7}" fill="${fill}" stroke="${ink}" stroke-width="${k * .18}"/>`;
      default: return `<path d="M${x} ${y - k * 1.2}L${x + k * .45} ${y - k * .3}L${x + k * 1.2} ${y}L${x + k * .45} ${y + k * .3}L${x} ${y + k * 1.2}L${x - k * .45} ${y + k * .3}L${x - k * 1.2} ${y}L${x - k * .45} ${y - k * .3}Z" fill="${fill}" stroke="${g}" stroke-width="${k * .2}" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="${k * .22}" fill="${ink}"/>`;
    }
  }
  RT.poiIcon = poiIcon;

  function weightedPick(r, w) {
    const keys = Object.keys(w); let tot = 0; keys.forEach(k => tot += w[k]);
    let v = r() * tot; for (const k of keys) { v -= w[k]; if (v <= 0) return k; } return keys[0];
  }

  // ---------- name & content generators ----------
  RT.genName = function (r, culture, kind) {
    const c = RT.CULTURES[culture] || RT.CULTURES.dem;
    if (kind === 'place') return RT.pick(r, c.p) + RT.pick(r, c.s);
    return RT.pick(r, c.f) + ' ' + RT.pick(r, c.l);
  };
  RT.genHook = function (r, culture) {
    const H = RT.HOOK; const who = RT.genName(r, culture, 'person');
    return `${RT.pick(r, H.patron)} (${who}) wants the party to ${RT.pick(r, H.task)}, ${RT.pick(r, H.twist)}. Reward: ${RT.pick(r, H.reward)}.`;
  };
  RT.genPois = function (regionId, seed) {
    const reg = regionById(regionId), poly = RT.regionPolys(5)[regionId], bb = RT.bbox(poly);
    const r = RT.rng(seed + '|gen|' + regionId), out = [];
    const fixed = RT.POIS.filter(p => p.region === regionId);
    const n = Math.round(Math.max(4, Math.min(9, Math.sqrt(bb.w * bb.h) / 26)));
    const types = ['hamlet', 'hamlet', 'camp', 'ruin', 'shrine', 'cave', 'landmark'];
    let guard = 0; const used = new Set();
    while (out.length < n && guard++ < 400) {
      const pt = [bb.x0 + r() * bb.w, bb.y0 + r() * bb.h];
      if (!RT.inPoly(pt, poly)) continue;
      if (fixed.concat(out).some(o => Math.hypot(o.x - pt[0], o.y - pt[1]) < 28)) continue;
      // keep off the coast edge
      if (poly.some((q, i) => RT.distSeg(pt, q, poly[(i + 1) % poly.length]) < 9)) continue;
      const type = RT.pick(r, types); let nm = RT.genName(r, reg.culture, 'place'); for (let k = 0; k < 8 && used.has(nm); k++) nm = RT.genName(r, reg.culture, 'place'); used.add(nm);
      out.push({ id: `gen:${regionId}:${out.length}`, region: regionId, name: (type === 'ruin' ? 'Ruins of ' : type === 'shrine' ? 'Shrine of ' : type === 'camp' ? 'Camp ' : '') + nm, type, x: pt[0], y: pt[1], gen: true, hook: RT.genHook(r, reg.culture), enc: RT.pick(r, reg.enc) });
    }
    return out;
  };

  // ---------- continent / region ----------
  RT.renderWorld = function (o) {
    // o: {theme, seed, view, focus (regionId|null), labels, borders, icons, roads, hex, pins}
    const th = THEMES[o.theme] || THEMES.parchment, view = o.view, s = view.w / RT.W;
    const detail = o.focus ? 6 : 5, polys = RT.regionPolys(detail);
    const sc = Math.pow(s, 0.8);                       // icon/text scale factor
    const c = { ink: th.ink, fill: th === THEMES.hextech ? '#12384a' : '#f1e5c4', tree: th === THEMES.hextech ? '#176a62' : '#6f8e57', glow: th.glow };
    const defs = `<defs>
      <radialGradient id="ocean" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="${th.ocean[0]}"/><stop offset="1" stop-color="${th.ocean[1]}"/></radialGradient>
      <filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="${RT.hashStr(o.seed) % 999}" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  0 0 0 .22 0" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/></filter>
      <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="3" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>
      <filter id="glow"><feGaussianBlur stdDeviation="${6 * s + 2}"/></filter></defs>`;
    let g = `<rect id="ocean-bg" x="${view.x - 2000}" y="${view.y - 2000}" width="${view.w + 4000}" height="${view.h + 4000}" fill="url(#ocean)"/>`;
    if (th.paper) g += `<rect x="${view.x - 2000}" y="${view.y - 2000}" width="${view.w + 4000}" height="${view.h + 4000}" filter="url(#paper)" opacity=".7"/>`;
    // coastal shading
    const allPaths = RT.REGIONS.map(r => RT.pathOf(polys[r.id])).join('');
    g += `<path d="${allPaths}" fill="none" stroke="${th.glow}" stroke-width="${26 * sc}" opacity="${th === THEMES.hextech ? .28 : .35}" filter="url(#glow)" stroke-linejoin="round" pointer-events="none"/>`;
    for (let i = 3; i >= 1; i--) g += `<path d="${allPaths}" fill="none" stroke="${th === THEMES.hextech ? '#0ac8b9' : '#fff'}" stroke-opacity="${.12 * (4 - i)}" stroke-width="${i * 9 * sc}" stroke-linejoin="round" pointer-events="none"/>`;
    // land
    RT.REGIONS.forEach(r => {
      const d = RT.pathOf(polys[r.id]), dim = o.focus && o.focus !== r.id;
      g += `<path class="region${o.sel === 'region:' + r.id ? ' sel' : ''}" data-kind="region" data-id="${r.id}" d="${d}" fill="${landColor(th, r)}" stroke="${th.border}" stroke-width="${(o.borders ? 2.2 : .6) * sc}" stroke-linejoin="round" ${o.borders ? `stroke-dasharray="${7 * sc} ${3 * sc}"` : ''}/>`;
      if (th.paper) g += `<path d="${d}" filter="url(#paper)" opacity=".5" pointer-events="none"/>`;
      if (dim) g += `<path d="${d}" fill="${th === THEMES.hextech ? '#000' : '#2a1e10'}" opacity=".38" pointer-events="none"/>`;
    });
    // hex overlay
    if (o.hex) {
      const rr = view.w / 28, hh = Math.sqrt(3) * rr; let d = '';
      for (let col = Math.floor((view.x - rr) / (1.5 * rr)); col * 1.5 * rr < view.x + view.w + rr; col++) {
        for (let row = Math.floor(view.y / hh) - 1; row * hh < view.y + view.h + hh; row++) {
          const cx = col * 1.5 * rr, cy = row * hh + (col & 1 ? hh / 2 : 0);
          d += `M${(cx - rr).toFixed(1)} ${cy.toFixed(1)}L${(cx - rr / 2).toFixed(1)} ${(cy - hh / 2).toFixed(1)}L${(cx + rr / 2).toFixed(1)} ${(cy - hh / 2).toFixed(1)}L${(cx + rr).toFixed(1)} ${cy.toFixed(1)}`;
        }
      }
      g += `<path id="hexgrid" d="${d}" fill="none" stroke="${th.ink}" stroke-opacity=".28" stroke-width="${.8 * sc}" pointer-events="none"/>`;
    }
    // terrain icons
    if (o.icons) {
      const rnd = RT.rng(o.seed + '|icons'), size = 13 * Math.pow(s, 0.72), step = size * 2.15;
      const pois = RT.POIS.filter(p => !p.minor || o.focus);
      const focusSet = o.focus ? [o.focus] : RT.REGIONS.map(r => r.id);
      focusSet.forEach(id => {
        const reg = regionById(id), poly = polys[id], bb = RT.bbox(poly);
        const x0 = Math.max(bb.x0, view.x - 20), x1 = Math.min(bb.x1, view.x + view.w + 20), y0 = Math.max(bb.y0, view.y - 20), y1 = Math.min(bb.y1, view.y + view.h + 20);
        const items = [];
        for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) {
          const jx = x + (rnd() - .5) * step * .9, jy = y + (rnd() - .5) * step * .9;
          if (rnd() > (reg.biome === 'urban' ? .5 : .62)) continue;
          if (!RT.inPoly([jx, jy], poly)) continue;
          if (poly.some((q, i) => RT.distSeg([jx, jy], q, poly[(i + 1) % poly.length]) < size * .9)) continue;
          if (pois.some(p => Math.hypot(p.x - jx, p.y - jy) < size * 3.3 + 6)) continue;
          items.push([jx, jy, weightedPick(rnd, reg.icons), .75 + rnd() * .5]);
        }
        items.sort((a, b) => a[1] - b[1]);
        g += `<g pointer-events="none" opacity="${o.focus && o.focus !== id ? .45 : .92}">` + items.map(it => ICON[it[2]](+it[0].toFixed(1), +it[1].toFixed(1), size * it[3], c)).join('') + '</g>';
      });
    }
    // routes
    if (o.roads) {
      const all = RT.POIS.concat(o.genPois || []), byId = {}; all.forEach(p => byId[p.id] = p);
      g += '<g pointer-events="none" fill="none" stroke-linecap="round">';
      RT.ROUTES.forEach(([a, b, kind]) => {
        const A = byId[a], B = byId[b]; if (!A || !B) return;
        if (o.focus && A.minor && !o.focus) return;
        const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, dx = B.x - A.x, dy = B.y - A.y, nx = -dy * .12, ny = dx * .12;
        g += kind === 'sea'
          ? `<path d="M${A.x} ${A.y}Q${mx + nx} ${my + ny} ${B.x} ${B.y}" stroke="${th.ink}" stroke-opacity=".55" stroke-width="${1.7 * sc}" stroke-dasharray="${2 * sc} ${6 * sc}"/>`
          : `<path d="M${A.x} ${A.y}Q${mx + nx} ${my + ny} ${B.x} ${B.y}" stroke="${th.ink}" stroke-opacity=".6" stroke-width="${2.2 * sc}" stroke-dasharray="${9 * sc} ${4 * sc}"/>`;
      });
      g += '</g>';
    }
    // POIs
    const poiList = RT.POIS.filter(p => !p.minor || o.focus || s < 0.62).concat(o.genPois || []);
    const ps = 9 * Math.pow(s, 0.65);
    g += '<g class="pois">';
    poiList.forEach(p => {
      const big = p.type === 'city' || p.type === 'port', sz = ps * (p.minor || p.gen ? .75 : 1) * (big ? 1.15 : 1);
      g += `<g class="poi${o.sel === 'poi:' + p.id ? ' sel' : ''}" data-kind="poi" data-id="${p.id}"><circle cx="${p.x}" cy="${p.y}" r="${sz * 2}" fill="transparent"/>${poiIcon(p, p.x, p.y, sz, th)}</g>`;
      if (o.labels && (big || o.focus || p.type === 'fortress'))
        g += `<text x="${p.x}" y="${p.y + sz * 2.6}" text-anchor="middle" class="plabel" font-size="${(big ? 12 : 10) * sc}" fill="${th.ink}" stroke="${th.halo}" stroke-width="${3 * sc}" paint-order="stroke" pointer-events="none">${RT.esc(p.name.replace(/ — .*/, ''))}</text>`;
    });
    g += '</g>';
    // region labels
    if (o.labels) RT.REGIONS.forEach(r => {
      const poly = polys[r.id], ov = LABELS[r.id], cen = ov || RT.centroid(poly), bb = RT.bbox(poly);
      const fs = (ov && ov[2] || Math.max(14, Math.min(40, Math.sqrt(bb.w * bb.h) / 4.8))) * sc * (o.focus === r.id ? 1.3 : 1);
      g += `<text x="${cen[0]}" y="${cen[1]}" text-anchor="middle" class="rlabel" font-size="${fs}" letter-spacing="${fs * .18}" fill="${th.ink}" stroke="${th.halo}" stroke-width="${fs * .12}" paint-order="stroke" opacity=".9" pointer-events="none">${RT.esc(r.name.toUpperCase())}</text>`;
    });
    return defs + g;
  };

  // map furniture — drawn in screen-relative group (see app.js updateDeco)
  RT.renderDeco = function (th, view, mpu) {
    const ink = th.ink, gold = th.gold, W = RT.W, H = RT.H, hexMi = Math.round(Math.sqrt(3) * (view.w / 28) * mpu / 5) * 5 || 5;
    const bar = 160, bmi = Math.round(bar * mpu / 5) * 5 || 5;
    return `<g pointer-events="none" font-family="Cinzel,Georgia,serif" fill="${ink}">
      <rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${gold}" stroke-width="3"/><rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke="${gold}" stroke-width="1"/>
      <g transform="translate(110 120)"><circle r="52" fill="none" stroke="${gold}" stroke-width="1.5"/><path d="M0 -62L10 -10L62 0L10 10L0 62L-10 10L-62 0L-10 -10Z" fill="${gold}" opacity=".85"/><path d="M0 -40L5 -5L40 0L5 5L0 40L-5 5L-40 0L-5 -5Z" fill="${ink}" opacity=".6" transform="rotate(45)"/><text y="-70" text-anchor="middle" font-size="16" fill="${ink}" font-weight="700">N</text></g>
      <g transform="translate(60 ${H - 60})"><path d="M0 0H${bar}" stroke="${ink}" stroke-width="3"/><path d="M0 -6V6M${bar / 2} -4V4M${bar} -6V6" stroke="${ink}" stroke-width="2"/><text x="0" y="-12" font-size="14">0</text><text x="${bar}" y="-12" font-size="14" text-anchor="end">${bmi} mi</text><text x="0" y="28" font-size="12" opacity=".8">1 hex ≈ ${hexMi} mi</text></g></g>`;
  };

  // ---------- city ----------
  RT.cityStyleFor = function (poi) {
    return RT.CITY_STYLES[poi.region] || RT.CITY_STYLES.demacia;
  };
  RT.renderCity = function (o) {
    const poi = o.poi, st = RT.cityStyleFor(poi), reg = regionById(poi.region), r = RT.rng(o.seed + '|city|' + poi.id), nz = RT.noise(o.seed + poi.id);
    const hex = o.theme === 'hextech', cx = 800, cy = 520, R = poi.type === 'port' ? 360 : 410;
    const ink = hex ? '#c8e6e0' : '#2a1d10', ground = hex ? RT.mix(st.ground, '#04141f', .7) : st.ground, paper = o.theme === 'parchment';
    const coastal = poi.type === 'port' || /dawnwatch|placidium|piltover|zaun|bilgewater|camavor/.test(poi.id);
    let g = `<defs><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3"/><feColorMatrix type="matrix" values="0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .1 0 0 0 .2 0"/></filter></defs>`;
    g += `<rect x="-2000" y="-2000" width="5600" height="5000" fill="${ground}"/>` + (paper ? `<rect x="-2000" y="-2000" width="5600" height="5000" filter="url(#paper)"/>` : '');
    // coastline on the south side
    const shore = [];
    if (coastal) {
      for (let x = -200; x <= 1800; x += 25) shore.push([x, 800 + (nz(x / 140, 1, 3) - .5) * 160 - Math.max(0, 1 - Math.abs(x - cx) / 500) * 30]);
      g += `<path d="M-200 1200L${shore.map(p => p.join(' ')).join('L')}L1800 1200Z" fill="${hex ? '#0a3a4a' : '#8fb5c0'}" stroke="${ink}" stroke-width="3"/>`;
      g += `<path d="M-200 1200L${shore.map(p => p[0] + ' ' + (p[1] + 14)).join('L')}L1800 1200Z" fill="none" stroke="${hex ? '#0ac8b9' : '#fff'}" stroke-opacity=".4" stroke-width="6"/>`;
    }
    const inWater = p => coastal && p[1] > (shore.reduce((a, q) => Math.abs(q[0] - p[0]) < Math.abs(a[0] - p[0]) ? q : a)[1] - 8);
    // wall ring
    const N = 64, wall = [];
    for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, rr = R * (.86 + nz(Math.cos(a) * 1.4 + 3, Math.sin(a) * 1.4 + 3, 3) * .28); wall.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .82]); }
    // roads: gates -> center, wobbly
    const gates = [0, 1, 2, 3, 4].map(i => (i / 5) * Math.PI * 2 + .3 + (r() - .5) * .3), roads = [];
    gates.forEach(a => {
      const pts = []; for (let t = 0; t <= 1.001; t += .05) { const rr = R * 1.05 * (1 - t); const wob = (nz(t * 3 + a * 5, a, 2) - .5) * 40; pts.push([cx + Math.cos(a + wob / 900) * rr + Math.cos(a + 1.57) * wob * t, cy + Math.sin(a + wob / 900) * rr * .82 + Math.sin(a + 1.57) * wob * t]); }
      roads.push(pts);
    });
    const rings = [.38, .66].map(f => { const pts = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2, rr = R * f * (.92 + nz(Math.cos(a) + 9, Math.sin(a) + 9, 2) * .16); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .82]); } return pts; });
    const allRoadPts = []; roads.concat(rings).forEach(pl => { for (let i = 0; i < pl.length - 1; i++) allRoadPts.push([pl[i], pl[i + 1]]); });
    // districts by angular sector x ring
    const dn = st.districts, distOf = (x, y) => {
      const dx = x - cx, dy = (y - cy) / .82, rad = Math.hypot(dx, dy) / R, ang = (Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2);
      if (rad < .2) return 0; // plaza
      return [3, 4, 1, 2][Math.floor(ang / (Math.PI / 2)) % 4];
    };
    const dcol = [st.accent, ...st.roof];
    // city floor
    g += `<path d="${RT.pathOf(wall)}" fill="${hex ? '#0c2a38' : RT.mix(ground, '#ffffff', .25)}" stroke="none"/>`;
    // roads
    g += `<g fill="none" stroke-linecap="round" stroke-linejoin="round">`;
    [...roads, ...rings].forEach((pl, i) => { const d = 'M' + pl.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'); g += `<path d="${d}" stroke="${ink}" stroke-opacity=".35" stroke-width="${i < roads.length ? 24 : 16}"/><path d="${d}" stroke="${hex ? '#12384a' : '#efe3c5'}" stroke-width="${i < roads.length ? 20 : 12}"/>`; });
    g += `</g>`;
    // buildings
    const bld = []; let tries = 0;
    while (bld.length < 900 && tries++ < 16000) {
      const x = cx + (r() * 2 - 1) * R * .98, y = cy + (r() * 2 - 1) * R * .82;
      if (!RT.inPoly([x, y], wall)) continue;
      if (Math.hypot(x - cx, (y - cy) / .82) < R * .12) continue;
      if (inWater([x, y + 18])) continue;
      let dmin = 1e9; for (const sg of allRoadPts) { const d = RT.distSeg([x, y], sg[0], sg[1]); if (d < dmin) dmin = d; if (d < 22) break; }
      if (dmin < 22) continue;
      const di = distOf(x, y), noble = di === 1, w = (noble ? 26 : 14) + r() * (noble ? 20 : 16), h = (noble ? 22 : 12) + r() * 14, a = Math.atan2(y - cy, x - cx) * 180 / Math.PI + 90 + (r() - .5) * 18;
      if (bld.some(b => Math.abs(b.x - x) < (b.w + w) / 2 * .98 && Math.abs(b.y - y) < (b.w + w) / 2 * .98 && Math.hypot(b.x - x, b.y - y) < (b.w + w) / 2)) continue;
      bld.push({ x, y, w, h, a, di });
    }
    g += `<g stroke="${ink}" stroke-width="1.3" stroke-opacity=".75">` + bld.map(b => `<rect x="${(b.x - b.w / 2).toFixed(1)}" y="${(b.y - b.h / 2).toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="${poi.region === 'ionia' || poi.region === 'bandle' ? b.h / 2.5 : 1}" transform="rotate(${b.a.toFixed(0)} ${b.x.toFixed(1)} ${b.y.toFixed(1)})" fill="${st.roof[(b.di + Math.floor(b.x)) % 3]}"/>`).join('') + `</g>`;
    // countryside
    if (!hex) { let n = 0, tt = 0; g += '<g opacity=".8">'; while (n < 150 && tt++ < 2000) { const x = r() * 1500 + 50, y = r() * 900 + 60; if (RT.inPoly([x, y], wall) || inWater([x, y]) || Math.hypot(x - cx, (y - cy) / .82) < R * 1.12) continue; n++; g += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${6 + r() * 8}" fill="${st.accent}" fill-opacity=".35" stroke="${ink}" stroke-opacity=".4"/>`; } g += '</g>'; }
    // plaza
    g += `<circle cx="${cx}" cy="${cy}" r="${R * .12}" fill="${hex ? '#12384a' : '#efe3c5'}" stroke="${ink}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R * .045}" fill="${st.accent}" stroke="${ink}" stroke-width="2"/>`;
    // walls & towers
    g += `<path d="${RT.pathOf(wall)}" fill="none" stroke="${ink}" stroke-width="12" stroke-linejoin="round"/><path d="${RT.pathOf(wall)}" fill="none" stroke="${st.wall}" stroke-width="8" stroke-linejoin="round"/>`;
    wall.forEach((p, i) => { if (i % 4 === 0) g += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="9" fill="${st.wall}" stroke="${ink}" stroke-width="2.5"/>`; });
    // gates & district hit regions
    const gateOut = roads.map(pl => pl[0]);
    gateOut.forEach((p, i) => { if (inWater(p)) return; g += `<g class="poi" data-kind="district" data-id="gate:${i}"><rect x="${p[0] - 13}" y="${p[1] - 13}" width="26" height="26" fill="${st.accent}" stroke="${ink}" stroke-width="3" transform="rotate(45 ${p[0]} ${p[1]})"/></g>`; });
    // districts
    const labs = [{ i: 0, x: cx, y: cy - R * .27, n: 'Central Plaza' }, { i: 1, x: cx - R * .55, y: cy - R * .35, n: dn[0] }, { i: 2, x: cx + R * .55, y: cy - R * .3, n: dn[1] }, { i: 3, x: cx + R * .5, y: cy + R * .42, n: dn[2] }, { i: 4, x: cx - R * .5, y: cy + R * .42, n: dn[3] }];
    labs.forEach(l => {
      g += `<g class="poi" data-kind="district" data-id="d:${l.i}:${RT.esc(l.n)}"><circle cx="${l.x}" cy="${l.y}" r="17" fill="${hex ? '#0a1a2a' : '#f7ecd0'}" stroke="${st.accent}" stroke-width="4"/><text x="${l.x}" y="${l.y + 6}" text-anchor="middle" font-size="16" font-family="Cinzel,Georgia,serif" font-weight="700" fill="${ink}" pointer-events="none">${l.i === 0 ? '★' : l.i}</text></g>`;
      g += `<text x="${l.x}" y="${l.y + 36}" text-anchor="middle" font-size="15" font-family="Cinzel,Georgia,serif" fill="${ink}" stroke="${hex ? '#04141f' : '#f4ead0'}" stroke-width="4" paint-order="stroke" pointer-events="none">${RT.esc(l.n)}</text>`;
    });
    g += `<text x="${RT.W / 2}" y="74" text-anchor="middle" font-size="46" letter-spacing="8" font-family="Cinzel,Georgia,serif" fill="${ink}" stroke="${hex ? '#04141f' : '#f4ead0'}" stroke-width="7" paint-order="stroke" pointer-events="none">${RT.esc(poi.name.replace(/ — .*/, '').toUpperCase())}</text>
      <text x="${RT.W / 2}" y="104" text-anchor="middle" font-size="17" font-family="Cinzel,Georgia,serif" fill="${ink}" opacity=".8" pointer-events="none">${RT.esc(reg.name)} · ${RT.esc(reg.tag.split(' · ')[0])}</text>`;
    return g;
  };

  // ---------- battle map ----------

  // ---------- Zaun laboratory (indoor battle map) ----------
  const labCache = {};
  const WALK = { floor: 1, spill: 1, vent: 1, ladder: 1, door: 1 };
  RT.labLayout = function (seed) {
    if (labCache[seed]) return labCache[seed];
    const B = RT.BATTLE, r = RT.rng(seed + '|lab'), g = [], rooms = [], objs = [];
    for (let y = 0; y < B.rows; y++) { g.push([]); for (let x = 0; x < B.cols; x++) g[y].push({ x, y, type: (x === 0 || y === 0 || x === B.cols - 1 || y === B.rows - 1) ? 'wall' : 'floor', room: -1 }); }
    const at = (x, y) => g[y] && g[y][x];
    (function split(x0, y0, x1, y1, depth) {
      const w = x1 - x0 + 1, h = y1 - y0 + 1, canV = w >= 14, canH = h >= 12;
      if (depth === 0 || (!canV && !canH) || (depth < 3 && rooms.length > 2 && r() < .12)) { rooms.push({ x0, y0, x1, y1 }); return; }
      if (canV && (!canH || w / h > 1.25 || r() < .35)) {
        const sx = x0 + 5 + Math.floor(r() * (w - 10)), dy = y0 + 1 + Math.floor(r() * (h - 3));
        for (let y = y0; y <= y1; y++) at(sx, y).type = 'wall'; at(sx, dy).type = 'door'; at(sx, dy + 1).type = 'door';
        split(x0, y0, sx - 1, y1, depth - 1); split(sx + 1, y0, x1, y1, depth - 1);
      } else {
        const sy = y0 + 4 + Math.floor(r() * (h - 8)), dx = x0 + 1 + Math.floor(r() * (w - 3));
        for (let x = x0; x <= x1; x++) at(x, sy).type = 'wall'; at(dx, sy).type = 'door'; at(dx + 1, sy).type = 'door';
        split(x0, y0, x1, sy - 1, depth - 1); split(x0, sy + 1, x1, y1, depth - 1);
      }
    })(1, 1, B.cols - 2, B.rows - 2, 3);
    rooms.forEach((rm, i) => { rm.i = i; rm.area = (rm.x1 - rm.x0 + 1) * (rm.y1 - rm.y0 + 1); for (let y = rm.y0; y <= rm.y1; y++) for (let x = rm.x0; x <= rm.x1; x++) at(x, y).room = i; });
    const connected = () => {
      let tot = 0, start = null; g.forEach(row => row.forEach(c => { if (WALK[c.type]) { tot++; if (!start) start = c; } }));
      const seen = new Set([start]), q = [start];
      while (q.length) { const c = q.pop(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(d => { const n = at(c.x + d[0], c.y + d[1]); if (n && WALK[n.type] && !seen.has(n)) { seen.add(n); q.push(n); } }); }
      return seen.size === tot;
    };
    const nearDoor = (x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const c = at(x + dx, y + dy); if (c && c.type === 'door') return true; } return false; };
    const place = (rm, kind, w, h, extra) => {
      for (let t = 0; t < 70; t++) {
        const x = rm.x0 + Math.floor(r() * (rm.x1 - rm.x0 + 2 - w)), y = rm.y0 + Math.floor(r() * (rm.y1 - rm.y0 + 2 - h)); let ok = true;
        for (let yy = y; yy < y + h && ok; yy++) for (let xx = x; xx < x + w; xx++) { const c = at(xx, yy); if (c.type !== 'floor' || nearDoor(xx, yy)) { ok = false; break; } }
        if (!ok) continue;
        const walk = WALK[kind], o = Object.assign({ kind, x, y, w, h }, extra || {});
        for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) at(xx, yy).type = kind;
        if (!walk && !connected()) { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) at(xx, yy).type = 'floor'; continue; }
        objs.push(o); return o;
      } return null;
    };
    const sorted = rooms.slice().sort((a, b) => b.area - a.area), roles = ['Vat Chamber', 'Specimen Cages', 'Control Room', 'Storage', 'Workshop'];
    for (let i = roles.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [roles[i], roles[j]] = [roles[j], roles[i]]; }
    const liquids = ['#5aff7a', '#b05cff', '#ffb23c', '#3cd8ff'];
    sorted.forEach((rm, i) => {
      rm.role = i === 0 ? 'Main Laboratory' : roles[(i - 1) % roles.length]; const k = RT.clamp(Math.sqrt(rm.area / 40), .6, 2.4), n = (a, b) => Math.max(1, Math.round((a + r() * (b - a)) * k));
      const rep = (c, fn) => { for (let j = 0; j < c; j++) fn(); };
      const vat = () => place(rm, 'vat', 2, 2, { liquid: RT.pick(r, liquids) }), tbl = () => r() < .5 ? place(rm, 'table', 3, 1) : place(rm, 'table', 2, 1), con = () => place(rm, 'console', 2, 1), crate = () => place(rm, 'crate', 1, 1), vent = () => place(rm, 'vent', 1, 1), cage = () => place(rm, 'cage', 2, 2, { occ: r() < .65 }), spill = () => place(rm, 'spill', 1, 1);
      if (rm.role === 'Main Laboratory') { rep(n(3, 5), tbl); rep(n(1, 2), con); rep(1, vat); rep(2, crate); rep(3, spill); rep(1, vent); }
      else if (rm.role === 'Vat Chamber') { rep(n(2, 4), vat); rep(n(1, 2), vent); rep(n(4, 7), spill); rep(1, con); }
      else if (rm.role === 'Specimen Cages') { rep(n(2, 4), cage); rep(1, crate); rep(1, con); rep(2, spill); }
      else if (rm.role === 'Control Room') { rep(n(3, 5), con); rep(1, tbl); rep(1, vent); }
      else if (rm.role === 'Storage') { rep(n(7, 11), crate); rep(1, vent); }
      else { rep(n(2, 3), tbl); rep(n(2, 4), crate); rep(1, con); rep(1, vent); }
    });
    place(rooms[Math.floor(r() * rooms.length)], 'ladder', 1, 1);
    const owner = RT.genName(r, 'pil', 'person');
    return (labCache[seed] = { cells: [].concat.apply([], g), rooms, objs, owner });
  };
  RT.LAB_ROLE = {
    'Main Laboratory': 'Benches, gurneys and humming apparatus. The owner’s current obsession is half-assembled on the central table.',
    'Vat Chamber': 'Rows of bubbling glass vats. Cracked glass means toxic fog; the liquid glows enough to read by.',
    'Specimen Cages': 'Reinforced cages — some occupied, none labelled kindly. Latches are old, rusty and unreliable.',
    'Control Room': 'Consoles control the vents, locks and purge system. A DC 13 Tinker’s check can seal or open any door.',
    'Storage': 'Crates of reagents, spare limbs and things in jars. Searching takes time and might set something off.',
    'Workshop': 'Half-finished hex-conduits, tools and scrap. A good place for a clever improvised weapon.'
  };
  const labCells = seed => RT.labLayout(seed).cells;

  RT.BATTLE = { cols: 36, rows: 24, cell: 40, ox: 80, oy: 20 };
  RT.battleBiomes = Object.keys(RT.BIOMES);
  RT.battleCells = function (seed, biome) {
    if (biome === 'lab') return labCells(seed.split('|')[0]);
    const B = RT.BATTLE, bm = RT.BIOMES[biome], nzE = RT.noise(seed + '|e'), nzM = RT.noise(seed + '|m'), r = RT.rng(seed + '|b');
    const cells = [];
    // river path
    const river = new Set(); let ry = 6 + Math.floor(r() * 12);
    const hasRiver = (biome === 'plains' || biome === 'forest' || biome === 'swamp' || biome === 'coast' || biome === 'ruins') && r() > .25;
    if (hasRiver) for (let x = 0; x < B.cols; x++) { ry = RT.clamp(ry + (r() < .33 ? -1 : r() < .66 ? 0 : 1), 2, B.rows - 3); river.add(x + ',' + ry); if (r() < .4) river.add(x + ',' + (ry + 1)); }
    const bridgeX = 8 + Math.floor(r() * (B.cols - 16));
    for (let y = 0; y < B.rows; y++) for (let x = 0; x < B.cols; x++) {
      const e = nzE(x / 6, y / 6, 3), m = nzM(x / 4, y / 4, 3), key = x + ',' + y;
      let type = 'ground', feat = null, color = RT.mix(bm.cols[0], bm.cols[e > .5 ? 2 : 1], Math.abs(e - .5) * 1.4);
      if (biome === 'coast' && y > B.rows - 5 - Math.floor(e * 3)) { type = 'water'; color = '#6fa5b8'; }
      else if (river.has(key)) { type = x === bridgeX ? 'bridge' : 'water'; color = type === 'bridge' ? '#8a6a42' : '#7fb0c9'; }
      else if (biome === 'swamp' && m > .62) { type = 'mud'; color = '#4f6a58'; }
      else if (biome === 'mountain' && e > .66) { type = 'cliff'; color = '#6f6b64'; }
      else if (biome === 'ruins' && m > .66 && r() > .4) { type = 'rubble'; color = '#7e7765'; }
      else if (biome === 'forest' && m > .55 && r() > .35) { feat = 'tree'; type = 'difficult'; }
      else if (biome === 'snow' && m > .68) { type = 'ice'; color = '#bcdff0'; }
      else if (biome === 'desert' && m > .7) { type = 'difficult'; feat = 'dune'; }
      else if (r() > .94) { feat = biome === 'mountain' ? 'rock' : biome === 'plains' ? 'bush' : 'rock'; type = feat === 'rock' ? 'block' : 'difficult'; }
      cells.push({ x, y, type, color, feat });
    }
    return cells;
  };
  RT.renderBattle = function (o) {
    if (o.biome === 'lab') return RT.renderLab(o);
    const B = RT.BATTLE, cells = RT.battleCells(o.seed + '|' + o.biome, o.biome), hex = o.theme === 'hextech';
    const ink = '#2a1d10';
    let g = `<rect x="-2000" y="-2000" width="5600" height="5000" fill="${hex ? '#010a13' : '#3a2e22'}"/>`;
    g += `<rect x="${B.ox - 10}" y="${B.oy - 10}" width="${B.cols * B.cell + 20}" height="${B.rows * B.cell + 20}" fill="${hex ? '#0a1a2a' : '#c8aa6e'}" stroke="${hex ? '#c8aa6e' : '#8a6a2b'}" stroke-width="4"/>`;
    g += `<g>`;
    cells.forEach(c => {
      const px = B.ox + c.x * B.cell, py = B.oy + c.y * B.cell, cx = px + B.cell / 2, cy = py + B.cell / 2;
      g += `<g class="cell" data-kind="cell" data-id="${c.x},${c.y}" data-type="${c.type}"><rect x="${px}" y="${py}" width="${B.cell}" height="${B.cell}" fill="${c.color}"/>`;
      if (c.feat === 'tree') g += `<circle cx="${cx}" cy="${cy}" r="${B.cell * .38}" fill="#3f6a35" stroke="${ink}" stroke-width="1.5"/><circle cx="${cx - 5}" cy="${cy - 5}" r="6" fill="#5c8a4a" opacity=".7"/>`;
      if (c.feat === 'rock') g += `<path d="M${cx - 12} ${cy + 9}L${cx - 6} ${cy - 10}L${cx + 6} ${cy - 12}L${cx + 13} ${cy + 8}Z" fill="#8a8680" stroke="${ink}" stroke-width="1.5"/>`;
      if (c.feat === 'bush') g += `<circle cx="${cx}" cy="${cy}" r="9" fill="#6f8e57" stroke="${ink}" stroke-width="1.2"/>`;
      if (c.feat === 'dune') g += `<path d="M${cx - 14} ${cy + 3}Q${cx - 4} ${cy - 10} ${cx + 4} ${cy}T${cx + 14} ${cy + 2}" fill="none" stroke="#a78845" stroke-width="2"/>`;
      if (c.type === 'water') g += `<path d="M${cx - 10} ${cy}q5 -5 10 0t10 0" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>`;
      if (c.type === 'bridge') g += `<path d="M${px} ${py + 8}H${px + B.cell}M${px} ${py + 20}H${px + B.cell}M${px} ${py + 32}H${px + B.cell}" stroke="#5a3d28" stroke-width="2"/>`;
      if (c.type === 'rubble') g += `<path d="M${cx - 10} ${cy + 8}l5 -12 8 6 7 -9 5 14z" fill="#9a927c" stroke="${ink}" stroke-width="1.2"/>`;
      if (c.type === 'cliff') g += `<path d="M${px + 4} ${py + 30}L${px + 14} ${py + 8}L${px + 24} ${py + 22}L${px + 34} ${py + 6}" fill="none" stroke="#3f3c38" stroke-width="2"/>`;
      if (c.type === 'ice') g += `<path d="M${px + 8} ${py + 28}L${px + 30} ${py + 10}" stroke="#fff" stroke-width="2" opacity=".8"/>`;
      if (c.type === 'mud') g += `<circle cx="${cx - 6}" cy="${cy + 4}" r="4" fill="#3c4f43"/><circle cx="${cx + 7}" cy="${cy - 5}" r="3" fill="#3c4f43"/>`;
      g += `</g>`;
    });
    g += `</g><g id="grid" pointer-events="none" stroke="${hex ? '#c8aa6e' : '#2a1d10'}" stroke-opacity="${o.grid ? .35 : 0}" stroke-width="1">`;
    for (let x = 0; x <= B.cols; x++) g += `<path d="M${B.ox + x * B.cell} ${B.oy}V${B.oy + B.rows * B.cell}"/>`;
    for (let y = 0; y <= B.rows; y++) g += `<path d="M${B.ox} ${B.oy + y * B.cell}H${B.ox + B.cols * B.cell}"/>`;
    g += `</g>`;
    return g;
  };

  RT.renderLab = function (o) {
    const B = RT.BATTLE, L = RT.labLayout(o.seed), c = B.cell, px = x => B.ox + x * c, py = y => B.oy + y * c, rr = RT.rng(o.seed + '|labdeco');
    const defs = `<defs><radialGradient id="vglow"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fffe8"/><stop offset="1" stop-color="#1b8f84"/></linearGradient></defs>`;
    let g = defs + `<rect x="-2000" y="-2000" width="5600" height="5000" fill="#05090c"/>`;
    // floor
    g += '<g>';
    L.cells.forEach(k => {
      if (k.type === 'wall') return;
      const x = px(k.x), y = py(k.y), alt = (k.x + k.y) % 2;
      g += `<g class="cell" data-kind="cell" data-id="${k.x},${k.y}" data-type="${k.type}"><rect x="${x}" y="${y}" width="${c}" height="${c}" fill="${alt ? '#2a3633' : '#2f3c39'}"/>`
        + `<path d="M${x + 4} ${y + 4}H${x + c - 4}V${y + c - 4}H${x + 4}Z" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.5"/><path d="M${x + 4} ${y + c / 2}H${x + c - 4}M${x + c / 2} ${y + 4}V${y + c - 4}" stroke="#000" stroke-opacity=".14"/>`
        + `<circle cx="${x + 3}" cy="${y + 3}" r="1.3" fill="#7a8a84" opacity=".6"/><circle cx="${x + c - 3}" cy="${y + c - 3}" r="1.3" fill="#7a8a84" opacity=".6"/>`;
      if (k.type === 'spill') g += `<path d="M${x + 8} ${y + 22}Q${x + 6} ${y + 8} ${x + 20} ${y + 8}Q${x + 36} ${y + 6} ${x + 33} ${y + 22}Q${x + 34} ${y + 35} ${x + 18} ${y + 33}Q${x + 6} ${y + 33} ${x + 8} ${y + 22}Z" fill="#6bff6b" fill-opacity=".55" stroke="#b8ffb8" stroke-opacity=".6"/><circle cx="${x + 15}" cy="${y + 16}" r="3" fill="#d8ffd8" opacity=".6"/>`;
      if (k.type === 'door') g += `<rect x="${x + 3}" y="${y + 3}" width="${c - 6}" height="${c - 6}" fill="#6b5326" stroke="#c8aa6e" stroke-width="2"/><path d="M${x + 3} ${y + c / 2}H${x + c - 3}" stroke="#c8aa6e" stroke-width="1.5"/>`;
      g += '</g>';
    });
    g += '</g>';
    // walls
    L.cells.forEach(k => {
      if (k.type !== 'wall') return; const x = px(k.x), y = py(k.y);
      g += `<g class="cell" data-kind="cell" data-id="${k.x},${k.y}" data-type="wall"><rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#171d21"/><rect x="${x + 2}" y="${y + 2}" width="${c - 4}" height="${c - 4}" fill="#222b30" stroke="#0a0e10"/><path d="M${x + 2} ${y + c / 2}H${x + c - 2}" stroke="#0a0e10" stroke-opacity=".7"/></g>`;
    });
    // pipes along walls
    g += '<g fill="none" stroke-linecap="round" pointer-events="none">';
    L.cells.forEach(k => {
      if (k.type !== 'wall' || rr() > .45) return; const x = px(k.x), y = py(k.y), horiz = at2(L, k.x - 1, k.y) === 'wall' || at2(L, k.x + 1, k.y) === 'wall', col = rr() < .5 ? '#2f9f94' : '#a07a3a', off = (rr() < .5 ? 13 : 27);
      g += horiz ? `<path d="M${x} ${y + off}H${x + c}" stroke="#05090c" stroke-width="9"/><path d="M${x} ${y + off}H${x + c}" stroke="${col}" stroke-width="6"/><circle cx="${x + c / 2}" cy="${y + off}" r="5" fill="${col}" stroke="#05090c" stroke-width="2"/>` : `<path d="M${x + off} ${y}V${y + c}" stroke="#05090c" stroke-width="9"/><path d="M${x + off} ${y}V${y + c}" stroke="${col}" stroke-width="6"/><circle cx="${x + off}" cy="${y + c / 2}" r="5" fill="${col}" stroke="#05090c" stroke-width="2"/>`;
    });
    g += '</g>';
    // glows
    L.objs.filter(ob => ob.kind === 'vat').forEach(ob => { const cx = px(ob.x) + c, cy = py(ob.y) + c; g += `<circle cx="${cx}" cy="${cy}" r="${c * 2.4}" fill="${ob.liquid}" opacity=".22" pointer-events="none"/>`; });
    // objects
    L.objs.forEach(ob => {
      const x = px(ob.x), y = py(ob.y), w = ob.w * c, h = ob.h * c, cx = x + w / 2, cy = y + h / 2, hit = `data-kind="cell" data-id="${ob.x},${ob.y}"`;
      if (ob.kind === 'vat') g += `<g class="cell" ${hit}><circle cx="${cx}" cy="${cy}" r="${c * .95}" fill="#3a3a30" stroke="#c8aa6e" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${c * .78}" fill="${ob.liquid}" fill-opacity=".85" stroke="#05090c" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${c * .78}" fill="url(#vglow)" opacity=".9"/><circle cx="${cx - 10}" cy="${cy + 8}" r="4" fill="#fff" opacity=".6"/><circle cx="${cx + 8}" cy="${cy - 6}" r="3" fill="#fff" opacity=".5"/><circle cx="${cx + 12}" cy="${cy + 14}" r="2" fill="#fff" opacity=".6"/><path d="M${cx - c * .6} ${cy - c * .25}A${c * .66} ${c * .66} 0 0 1 ${cx - c * .1} ${cy - c * .66}" fill="none" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/></g>`;
      else if (ob.kind === 'table') { g += `<g class="cell" ${hit}><rect x="${x + 3}" y="${y + 6}" width="${w - 6}" height="${h - 12}" rx="3" fill="#5d574a" stroke="#05090c" stroke-width="2"/><rect x="${x + 6}" y="${y + 9}" width="${w - 12}" height="${h - 18}" fill="#6e6858" opacity=".7"/>`; for (let i = 0; i < ob.w; i++) g += `<circle cx="${x + i * c + 14}" cy="${cy}" r="5" fill="${['#5aff7a', '#b05cff', '#3cd8ff', '#ffb23c'][(ob.x + i) % 4]}" stroke="#05090c" stroke-width="1.5"/><rect x="${x + i * c + 22}" y="${cy - 6}" width="8" height="12" fill="#cfe8e4" opacity=".7" stroke="#05090c"/>`; g += '</g>'; }
      else if (ob.kind === 'crate') g += `<g class="cell" ${hit}><rect x="${x + 4}" y="${y + 4}" width="${c - 8}" height="${c - 8}" fill="#6d5a36" stroke="#05090c" stroke-width="2"/><path d="M${x + 4} ${y + 4}L${x + c - 4} ${y + c - 4}M${x + c - 4} ${y + 4}L${x + 4} ${y + c - 4}" stroke="#3a2f1b" stroke-width="2"/></g>`;
      else if (ob.kind === 'console') g += `<g class="cell" ${hit}><rect x="${x + 3}" y="${y + 5}" width="${w - 6}" height="${h - 10}" rx="3" fill="#10181c" stroke="#c8aa6e" stroke-width="2"/><rect x="${x + 8}" y="${y + 9}" width="${w - 16}" height="${h - 24}" fill="url(#screen)" opacity=".85"/><path d="M${x + 12} ${y + 14}h14M${x + 12} ${y + 19}h24" stroke="#05222a" stroke-width="2"/><circle cx="${x + w - 12}" cy="${y + h - 10}" r="2.5" fill="#ff5a5a"/><circle cx="${x + w - 22}" cy="${y + h - 10}" r="2.5" fill="#5aff7a"/></g>`;
      else if (ob.kind === 'cage') { g += `<g class="cell" ${hit}><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" fill="#0c1215" stroke="#8a9090" stroke-width="3"/>`; for (let i = 1; i < 6; i++) g += `<path d="M${x + 3 + i * (w - 6) / 6} ${y + 3}V${y + h - 3}" stroke="#8a9090" stroke-width="2.5"/>`; if (ob.occ) g += `<ellipse cx="${cx}" cy="${cy + 6}" rx="${c * .5}" ry="${c * .38}" fill="#2a1d3a" stroke="#b05cff" stroke-opacity=".6"/><circle cx="${cx - 7}" cy="${cy}" r="3" fill="#ff5ad0"/><circle cx="${cx + 7}" cy="${cy}" r="3" fill="#ff5ad0"/>`; g += '</g>'; }
      else if (ob.kind === 'vent') g += `<g class="cell" ${hit}><circle cx="${cx}" cy="${cy}" r="${c * .38}" fill="#10181c" stroke="#8a9090" stroke-width="2"/><path d="M${cx - 10} ${cy - 5}H${cx + 10}M${cx - 10} ${cy}H${cx + 10}M${cx - 10} ${cy + 5}H${cx + 10}" stroke="#8a9090" stroke-width="1.5"/><circle cx="${cx - 6}" cy="${cy - 14}" r="8" fill="#dfeeee" opacity=".28"/><circle cx="${cx + 8}" cy="${cy - 20}" r="6" fill="#dfeeee" opacity=".22"/></g>`;
      else if (ob.kind === 'ladder') g += `<g class="cell" ${hit}><rect x="${x + 8}" y="${y + 3}" width="${c - 16}" height="${c - 6}" fill="#0c1215" stroke="#c8aa6e" stroke-width="2"/><path d="M${x + 12} ${y + 3}V${y + c - 3}M${x + c - 12} ${y + 3}V${y + c - 3}M${x + 12} ${y + 12}H${x + c - 12}M${x + 12} ${y + 20}H${x + c - 12}M${x + 12} ${y + 28}H${x + c - 12}" stroke="#c8aa6e" stroke-width="2"/></g>`;
    });
    // grid + labels
    g += `<g id="grid" pointer-events="none" stroke="#8fffd4" stroke-opacity="${o.grid ? .16 : 0}" stroke-width="1">`;
    for (let x = 0; x <= B.cols; x++) g += `<path d="M${px(x)} ${B.oy}V${B.oy + B.rows * c}"/>`;
    for (let y = 0; y <= B.rows; y++) g += `<path d="M${B.ox} ${py(y)}H${B.ox + B.cols * c}"/>`;
    g += '</g><g id="roomlabels" pointer-events="none" font-family="Cinzel,Georgia,serif" text-anchor="middle">';
    L.rooms.forEach(rm => { g += `<text x="${(px(rm.x0) + px(rm.x1 + 1)) / 2}" y="${py(rm.y0) + 24}" font-size="13" letter-spacing="2" fill="#8fffd4" opacity=".55" stroke="#05090c" stroke-width="3" paint-order="stroke">${RT.esc(rm.role.toUpperCase())}</text>`; });
    return g + '</g>';
  };
  function at2(L, x, y) { const B = RT.BATTLE; if (x < 0 || y < 0 || x >= B.cols || y >= B.rows) return null; return L.cells[y * B.cols + x].type; }
  RT.cellInfo = {
    ground: ['Open ground', 'Normal movement.'], difficult: ['Difficult terrain', 'Costs 2 ft of movement per 1 ft; may grant half cover (trees/brush).'],
    water: ['Water', 'Swimmable; DC 10 Athletics in current. Heavy armor sinks.'], bridge: ['Bridge / ford', 'Chokepoint — fits two Medium creatures abreast.'],
    block: ['Rock / obstacle', 'Blocks movement; full cover for Small creatures, half for Medium.'], mud: ['Bog', 'Difficult terrain; Dex save DC 12 or stuck (Restrained) 1 round.'],
    cliff: ['Cliff / scree', 'Climb DC 13; fall damage 1d6 per 10 ft.'], rubble: ['Rubble', 'Difficult terrain; half cover.'], ice: ['Ice', 'Dex save DC 10 on Dash or be knocked prone.'],
    wall: ['Lab wall', 'Riveted plating; impassable. AC 17, 40 HP per 5-ft section if smashed.'], door: ['Pressure door', 'Opens as an action; the control room can lock it (Str DC 18 or Tinker’s DC 15 to force).'],
    floor: ['Grated floor', 'Normal movement. Footsteps ring loudly — disadvantage on Stealth.'], vat: ['Chem vat', 'Blocks movement. If broken (AC 11, 10 HP): 10-ft puddle, 2d6 acid/poison (Con DC 13 half) and heavily obscured fog for 3 rounds.'],
    table: ['Lab bench', 'Half cover; counts as difficult terrain to climb over. Beakers can be thrown (1d4 acid).'], crate: ['Supply crate', 'Half cover for Medium creatures; Search DC 12 for reagents or scrap.'],
    console: ['Control console', 'Half cover. Tinker’s/Arcana DC 13: lock/unlock doors, vent a room, or trigger the purge.'], cage: ['Specimen cage', 'Blocks movement; bars give three-quarters cover. Lock DC 15 — a freed occupant may not be grateful.'],
    vent: ['Steam vent', 'Walkable. Each round on initiative 20: Con DC 12 or 1d6 fire damage; steam heavily obscures adjacent squares.'], ladder: ['Ladder to the Sump', 'Leads down to the Undercity levels — a quick escape or a reinforcement route.'],
    spill: ['Chem spill', 'Slippery: Dex DC 11 when moving through or fall prone. Reactive — fire ignites it (1d6, 5-ft burst).']
  };
})(window.RT);
