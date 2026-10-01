/* Runeterra Atlas — UI for Demacia city & battle maps. Maps are authored (no seeds, no random tables). */
(function (RT) {
  const $ = id => document.getElementById(id), svg = $('map'), panel = $('panel');
  const STORE = 'runeterra-atlas-demacia-v2', B = RT.BATTLE, D = RT.DEMACIA, CITIES = RT.DEMACIA_CITIES, BATTLES = RT.DEMACIA_BATTLES, SIZES = RT.CREATURES;
  const S = { mode: 'city', cityId: 'demacia', scenario: 'cloudwoods', theme: 'day', era: 'peace', opts: { labels: 1, numbers: 1, grid: 1, deco: 1 }, sel: null, view: { x: 0, y: 0, w: RT.W, h: RT.H }, pinMode: false, pinType: 'npc', pinSize: 1, px: 70, pins: [], notes: {} };
  const PIN_TYPES = { city: { npc: ['NPC', '#3b8fe0'], quest: ['Quest hook', '#c8aa6e'], enc: ['Encounter', '#e84057'], note: ['Note', '#3fb27f'] }, battle: { hero: ['Hero', '#3b8fe0'], foe: ['Foe', '#e84057'], note: ['Marker', '#c8aa6e'] } };
  const city = () => CITIES.find(c => c.id === S.cityId), battle = () => BATTLES.find(b => b.id === S.scenario);
  const scope = () => S.mode === 'city' ? 'city:' + S.cityId : 'battle:' + S.scenario;
  const eraName = () => D.eras[S.era].name, W = RT.W, H = RT.H;
  const ftw = () => Math.round(W * city().ft / 100) * 100;

  function save() { try { localStorage.setItem(STORE, JSON.stringify({ pins: S.pins, notes: S.notes, theme: S.theme, era: S.era, opts: S.opts, px: S.px })); } catch (e) { } }
  function load() { try { const d = JSON.parse(localStorage.getItem(STORE) || 'null'); if (d) { S.pins = d.pins || []; S.notes = d.notes || {}; S.theme = d.theme || S.theme; S.era = d.era || S.era; S.px = d.px || S.px; Object.assign(S.opts, d.opts || {}); } } catch (e) { } }
  const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 1800); };

  // ---------- drawing ----------
  function draw() {
    svg.innerHTML = (S.mode === 'city'
      ? RT.renderCity({ theme: S.theme, seed: city().seed, city: city(), era: eraName(), labels: S.opts.labels, numbers: S.opts.numbers, grid: S.opts.grid, sel: S.sel && S.sel.kind + ':' + S.sel.id })
      : RT.renderBattle({ theme: S.theme, seed: battle().seed, scenario: S.scenario, grid: S.opts.grid })) + '<g id="pins"></g><g id="deco"></g>';
    if (S.sel && S.sel.kind === 'cell') { const el = svg.querySelector(`.cell[data-id="${S.sel.id}"]`); if (el) el.classList.add('sel'); }
    if (S.sel && S.sel.kind === 'district') { const el = [...svg.querySelectorAll('.poi')].find(e => e.dataset.kind === 'district' && e.dataset.id === S.sel.id); if (el) el.classList.add('sel'); }
    applyView(); renderPanel(); updateCrumb();
  }
  function niceFt(maxFt) { for (const f of [10, 20, 50, 100, 200, 500, 1000, 2000]) if (f * 1.0 <= maxFt) var best = f; return best || 10; }
  function applyView() {
    const v = S.view; svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
    const deco = $('deco'); if (!deco) return; const th = S.theme === 'night' ? { ink: '#dbe7f3', gold: '#c8aa6e' } : { ink: '#2a1d10', gold: '#8a6a2b' };
    deco.setAttribute('transform', `translate(${v.x} ${v.y}) scale(${v.w / W})`);
    let s = '';
    if (S.opts.deco) {
      s += `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${th.gold}" stroke-width="3"/><rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke="${th.gold}"/>`;
      if (S.mode === 'city') {
        s += `<g transform="translate(${W - 100} ${H - 100})"><circle r="40" fill="none" stroke="${th.gold}" stroke-width="1.5"/><path d="M0 -50L8 -8L50 0L8 8L0 50L-8 8L-50 0L-8 -8Z" fill="${th.gold}" opacity=".85"/><text y="-58" text-anchor="middle" font-size="15" font-weight="700">N</text></g>`;
        const ftPerUnit = city().ft * v.w / W, ft = niceFt(220 * ftPerUnit), len = ft / ftPerUnit; // bar in deco units
        s += `<g transform="translate(60 ${H - 50})"><path d="M0 0H${len}" stroke="${th.ink}" stroke-width="3"/><path d="M0 -6V6M${len / 2} -4V4M${len} -6V6" stroke="${th.ink}" stroke-width="2"/><text y="-12" font-size="14">0</text><text x="${len}" y="-12" font-size="14" text-anchor="end">${ft} ft</text><text y="26" font-size="12" opacity=".85">Not for person-sized tokens — see Scale guide</text></g>`;
      }
    }
    deco.innerHTML = `<g pointer-events="none" font-family="Cinzel,Georgia,serif" fill="${th.ink}">${s}</g>`;
    drawPins(); updateExportInfo();
  }
  function tokenGeom(p) { const f = p.size || 1; return { f, r: Math.max(f, .5) * B.cell * .46 }; }
  function drawPins() {
    const g = $('pins'); if (!g) return; const k = Math.pow(S.view.w / W, .7), types = PIN_TYPES[S.mode], bat = S.mode === 'battle';
    g.innerHTML = S.pins.filter(p => p.scope === scope()).map(p => {
      const t = types[p.type] || types.note, sel = S.sel && S.sel.kind === 'pin' && S.sel.id === p.id;
      if (bat) { const { f, r } = tokenGeom(p); return `<g class="pin" data-kind="pin" data-id="${p.id}"><circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${t[1]}" fill-opacity=".9" stroke="#fff" stroke-width="${sel ? 4 : 2.5}"/>${f >= 1 ? `<rect x="${p.x - f * B.cell / 2}" y="${p.y - f * B.cell / 2}" width="${f * B.cell}" height="${f * B.cell}" fill="none" stroke="${t[1]}" stroke-width="1.2" stroke-dasharray="4 3" opacity=".7"/>` : ''}<text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="${f >= 2 ? 18 : f < 1 ? 9 : 14}" font-weight="700" fill="#fff" pointer-events="none">${RT.esc((p.label || '?').slice(0, 2).toUpperCase())}</text></g>`; }
      const r = 12 * k;
      return `<g class="pin" data-kind="pin" data-id="${p.id}"><path d="M${p.x} ${p.y}c${-r * .2} ${-r * .9} ${-r} ${-r * 1.2} ${-r} ${-r * 2.1}a${r} ${r} 0 1 1 ${r * 2} 0c0 ${r * .9} ${-r * .8} ${r * 1.2} ${-r} ${r * 2.1}Z" fill="${t[1]}" stroke="${sel ? '#fff' : '#010a13'}" stroke-width="${(sel ? 2.4 : 1.6) * k}"/><circle cx="${p.x}" cy="${p.y - r * 2.1}" r="${r * .38}" fill="#fff"/>${p.label ? `<text x="${p.x + r * 1.3}" y="${p.y - r * 1.8}" font-size="${13 * k}" fill="#fff" stroke="#010a13" stroke-width="${3.4 * k}" paint-order="stroke" font-family="Cinzel,Georgia,serif" pointer-events="none">${RT.esc(p.label)}</text>` : ''}</g>`;
    }).join('');
  }
  const updateCrumb = () => { $('crumb').textContent = S.mode === 'city' ? `DEMACIA › ${city().short.toUpperCase()} · ~${ftw().toLocaleString()} FT ACROSS` : `DEMACIA › ${battle().name.toUpperCase()} · 1 SQUARE = 5 FT`; };
  function exportBox(clean) {
    const v = S.view;
    if (S.mode === 'battle') { const k = S.px / B.cell; if (clean) return { x: B.ox, y: B.oy, w: B.cols * B.cell, h: B.rows * B.cell, px: B.cols * S.px, py: B.rows * S.px }; return { ...v, px: Math.round(v.w * k), py: Math.round(v.h * k) }; }
    return { ...v, px: 3200, py: Math.round(3200 * v.h / v.w) };
  }
  function updateExportInfo() {
    const e = exportBox(false), c = exportBox(true); $('fldPx').style.display = S.mode === 'battle' ? '' : 'none';
    $('exInfo').textContent = S.mode === 'battle' ? `VTT PNG: ${c.px} × ${c.py} px · 1 square = ${S.px} px = 5 ft` : `PNG: ${e.px} × ${e.py} px · set VTT grid to 100 ft = ${Math.round(100 / city().ft * e.px / e.w)} px`;
  }

  function setMode(m) {
    S.mode = m; S.sel = null; S.view = { x: 0, y: 0, w: W, h: H };
    document.querySelectorAll('#scaleTabs button').forEach(b => b.classList.toggle('on', b.dataset.scale === m));
    $('fldCity').style.display = m === 'city' ? '' : 'none'; $('fldScenario').style.display = m === 'battle' ? '' : 'none';
    $('lNumbers').style.display = m === 'city' ? '' : 'none'; $('fldSize').style.display = m === 'battle' ? '' : 'none';
    $('gridLbl').textContent = m === 'city' ? 'Scale grid (100 ft)' : 'Square grid (5 ft)';
    fillPinTypes(); draw();
  }
  function fillPinTypes() { const t = PIN_TYPES[S.mode], sel = $('pinType'); sel.innerHTML = Object.keys(t).map(k => `<option value="${k}">${t[k][0]}</option>`).join(''); if (!t[S.pinType]) S.pinType = Object.keys(t)[0]; sel.value = S.pinType; $('pinHint').textContent = S.mode === 'battle' ? 'A Medium creature (an average person) is one 5-ft square. Pick a size, toggle “Place”, click the map.' : 'Pins mark places and groups. Person-sized tokens belong on battle maps.'; }

  // ---------- panel ----------
  const list = (a, fn) => a.map(fn).join('');
  const notesBox = key => `<h4>Session notes</h4><textarea data-note="${RT.esc(key)}" placeholder="Prep, clues, secrets…">${RT.esc(S.notes[key] || '')}</textarea>`;
  const npcHtml = n => `<div class="npc"><b>${RT.esc(n[0])}</b><em>${RT.esc(n[1])}</em><p>${RT.esc(n[2])}</p></div>`;
  const chip = (c, t) => `<span class="chip" style="${c ? 'border-color:#0ac8b9;color:#0ac8b9' : ''}">${t}</span>`;
  const eraBox = () => `<div class="hook" style="border-color:#0ac8b9"><b>${RT.esc(eraName())}</b> — ${RT.esc(D.eras[S.era].blurb)}</div>`;
  function renderPanel() {
    const s = S.sel; let h = '';
    if (s && s.kind === 'lore') h = lorePanel(); else if (s && s.kind === 'scale') h = scalePanel();
    else if (S.mode === 'city') h = !s ? cityOverview() : s.kind === 'landmark' ? landmarkPanel(s.id) : s.kind === 'district' ? districtPanel(s.id) : s.kind === 'pin' ? pinPanel() : cityOverview();
    else h = !s ? battleOverview() : s.kind === 'cell' ? cellPanel(s.id) : s.kind === 'pin' ? pinPanel() : battleOverview();
    panel.innerHTML = h; panel.scrollTop = 0;
  }
  function cityOverview() {
    const c = city();
    return `<div class="tag">${RT.esc(c.tag)}</div><h2>${RT.esc(c.name)}</h2>${eraBox()}<p class="lore">${RT.esc(c.summary)}</p>
      <div class="chips">${chip(0, '~' + ftw().toLocaleString() + ' ft across')}${chip(0, '1 px ≈ ' + c.ft + ' ft')}</div>
      <h4>Key locations</h4><div class="list">${list(c.landmarks, (l, i) => `<a data-act="selLm" data-id="${l.id}">${i + 1}. ${RT.esc(l.n)}<small>${l.c ? 'canon' : 'invented'}</small></a>`)}</div>
      <h4>Districts</h4><div class="list">${list(c.districts, d => `<a data-act="selDist" data-id="${d.id}">${RT.esc(d.n)}<small>${d.style}</small></a>`)}</div>
      <h4>Rumors</h4>${list(D.rumors[S.era], t => `<div class="hook">${RT.esc(t)}</div>`)}${notesBox('city:' + c.id)}`;
  }
  function landmarkPanel(id) {
    const c = city(), l = c.landmarks.find(x => x.id === id); if (!l) return cityOverview();
    const t = S.era === 'turmoil' && l.t ? l.t : {}, d = t.d || l.d, hook = t.h || l.h, i = c.landmarks.indexOf(l);
    return `<div class="tag">${RT.esc(c.short)} · key location ${i + 1}</div><h2>${RT.esc(l.n)}</h2><div class="chips">${chip(l.c, l.c ? 'Canon location' : 'Invented for the table')}${l.t ? chip(0, S.era === 'turmoil' ? 'Turmoil version' : 'Changes in the Turmoil') : ''}</div>
      <p class="lore">${RT.esc(d)}</p><h4>Who’s here</h4>${npcHtml(l.npc)}<h4>Hook</h4><div class="hook">${RT.esc(hook)}</div><div class="actions"><button class="btn" data-act="back">← Back to overview</button></div>${notesBox('lm:' + c.id + ':' + l.id)}`;
  }
  const STYLE = { royal: 'Royal precinct — guarded; refined', noble: 'Noble houses — large, walled, quiet', common: 'Common homes and workshops', slum: 'Crowded, poor — alleys and shortcuts', military: 'Barracks, drill yards and watchposts', religious: 'Temples and shrines', market: 'Stalls and guild halls — busy, loud', harbor: 'Docks, warehouses and fish-smoke' };
  function districtPanel(id) {
    const c = city(), d = c.districts.find(x => x.id === id); if (!d) return cityOverview();
    const near = c.landmarks.filter(l => { let best = null, bd = 9; c.districts.forEach(x => { const q = (x.x - l.x) ** 2 + (x.y - l.y) ** 2; if (q < bd) { bd = q; best = x; } }); return best === d; });
    return `<div class="tag">${RT.esc(c.short)} · district</div><h2>${RT.esc(d.n)}</h2><div class="chips">${chip(0, RT.esc(STYLE[d.style]))}</div><p class="lore">${RT.esc(d.d)}</p>
      ${near.length ? `<h4>Landmarks here</h4><div class="list">${list(near, l => `<a data-act="selLm" data-id="${l.id}">${RT.esc(l.n)}<small>${l.c ? 'canon' : 'invented'}</small></a>`)}</div>` : ''}<div class="actions"><button class="btn" data-act="back">← Back to overview</button></div>${notesBox('dist:' + c.id + ':' + d.id)}`;
  }
  function lorePanel() {
    return `<div class="tag">${RT.esc(D.tag)}</div><h2>Demacia</h2>${eraBox()}<p class="lore">${RT.esc(D.summary)}</p>
      <h4>Noble houses</h4>${list(D.houses, h => `<div class="npc"><b>${RT.esc(h[0])}</b><p>${RT.esc(h[1])}</p></div>`)}<h4>Orders</h4>${list(D.orders, h => `<div class="npc"><b>${RT.esc(h[0])}</b><p>${RT.esc(h[1])}</p></div>`)}
      <h4>Sources</h4><div class="list">${list(D.sources, s => `<a href="${s[1]}" target="_blank" rel="noopener">${RT.esc(s[0])}<small>wiki ↗</small></a>`)}</div>
      <p class="empty">Locations marked “invented” are table-ready additions; “canon” ones come from the wiki. Lore is paraphrased; Demacia and the League of Legends universe belong to Riot Games.</p><div class="actions"><button class="btn" data-act="back">← Back</button></div>`;
  }
  function scalePanel() {
    const px = S.px, u = 28; // preview square in panel
    let rows = '', y = 0;
    SIZES.forEach(s => { const sz = s[1], span = Math.max(sz, 1) * u, cx = (sz < 1 ? u / 2 : span / 2), cy = y + span / 2; rows += `<rect x="0" y="${y}" width="${span}" height="${span}" fill="#e9e3cf" stroke="#8a7a5a"/>` + (sz >= 2 ? [1, 2, 3].filter(i => i < sz).map(i => `<path d="M${i * u} ${y}V${y + span}M0 ${y + i * u}H${span}" stroke="#8a7a5a" stroke-opacity=".5"/>`).join('') : '') + `<circle cx="${cx}" cy="${cy}" r="${Math.max(sz, .5) * u * .46}" fill="#3b8fe0" stroke="#fff" stroke-width="2"/><text x="${span + 12}" y="${cy + 5}" font-size="14" fill="#f0e6d2">${s[0]} — ${sz >= 1 ? sz + '×' + sz + ' sq' : '½ sq'} (${Math.round(Math.max(sz, .5) * px)} px)</text>`; y += span + 10; });
    return `<div class="tag">Scale guide</div><h2>Scale &amp; tokens</h2>
      <div class="hook" style="border-color:#0ac8b9"><b>An average person is one square.</b> A Medium creature fills one 5 ft × 5 ft square, so its token is <b>5 ft across</b> — <b>${B.cell} px</b> on screen here, <b>${S.px} px</b> in the PNG you export now (change “Pixels per 5-ft square” on the left).</div>
      <h4>Creature sizes</h4><svg viewBox="0 0 340 ${y}" width="100%" style="max-width:340px">${rows}</svg>
      <h4>VTT grid settings</h4><div class="list"><a>Roll20 · 70 px per square<small>default</small></a><a>Foundry VTT · 100 px per square<small>default</small></a><a>Set the grid distance to 5 ft per square<small>always</small></a></div>
      <h4>Typical sizes on battle maps</h4><p class="lore">Door: 5 ft (1 square). Corridor: 10 ft (2). Road: 15–30 ft (3–6). Fountain: 10 ft. Tree canopy: 15 ft. Wagon: 10×5 ft. Ship: about 15×35 ft.</p>
      <h4>City maps</h4><p class="lore">City maps are drawn at roughly <b>1.5–2.5 ft per pixel</b> (see each city’s scale bar); buildings and roads are drawn a little oversize for readability. At that scale a person is about one pixel wide, so <b>don’t use person tokens on city maps</b> — use pins for places and groups. For a street, plaza or building at person scale, ask for a battle map of that spot.</p><div class="actions"><button class="btn" data-act="back">← Back</button></div>`;
  }
  function battleOverview() {
    const b = battle();
    return `<div class="tag">${RT.esc(b.tag)}</div><h2>${RT.esc(b.name)}</h2>${eraBox()}<p class="lore">${RT.esc(b.desc)}</p>
      <div class="chips">${chip(0, '36 × 24 squares')}${chip(0, '180 × 120 ft')}${chip(0, '1 square = 5 ft')}</div>
      <h4>Terrain at a glance</h4>${list(b.features, f => `<div class="hook">${RT.esc(f)}</div>`)}${notesBox('battle:' + b.id)}`;
  }
  function cellPanel(id) {
    const [x, y] = id.split(',').map(Number), t = RT.battleGrid(S.scenario, battle().seed)[y][x], inf = RT.tileInfo(t);
    return `<div class="tag">Square ${x + 1} · ${y + 1} · ${(x * 5)} ft east, ${(y * 5)} ft south</div><h2>${RT.esc(inf.name)}</h2><p class="lore">${RT.esc(inf.rule)}</p><div class="actions"><button class="btn" data-act="back">← Scenario</button></div>${notesBox('cell:' + S.scenario + ':' + id)}`;
  }
  function pinPanel() {
    const p = S.pins.find(q => q.id === S.sel.id); if (!p) return S.mode === 'city' ? cityOverview() : battleOverview(); const t = PIN_TYPES[S.mode];
    return `<div class="tag">${S.mode === 'battle' ? 'Token' : 'Pin'}</div><h2>${RT.esc(p.label || 'Untitled')}</h2><label class="fld">Label<input type="text" data-pin="label" value="${RT.esc(p.label || '')}"></label>
      <label class="fld">Type<select data-pin="type">${Object.keys(t).map(k => `<option value="${k}" ${k === p.type ? 'selected' : ''}>${t[k][0]}</option>`).join('')}</select></label>
      ${S.mode === 'battle' ? `<label class="fld">Size<select data-pin="size">${SIZES.map(s => `<option value="${s[1]}" ${(p.size || 1) === s[1] ? 'selected' : ''}>${s[0]}</option>`).join('')}</select></label>` : ''}
      <label class="fld">Notes<textarea data-pin="note" placeholder="Stat block, motive, secrets…">${RT.esc(p.note || '')}</textarea></label><div class="actions"><button class="btn" data-act="delPin" data-id="${p.id}">Delete</button></div>`;
  }
  panel.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return; const act = a.dataset.act, id = a.dataset.id;
    if (act === 'selLm') { S.sel = { kind: 'landmark', id }; draw(); } else if (act === 'selDist') { S.sel = { kind: 'district', id }; draw(); }
    else if (act === 'back') { S.sel = null; draw(); } else if (act === 'delPin') { S.pins = S.pins.filter(p => p.id !== id); S.sel = null; save(); draw(); }
  });
  panel.addEventListener('input', e => {
    const t = e.target; if (t.dataset.note) { S.notes[t.dataset.note] = t.value; save(); }
    else if (t.dataset.pin) { const p = S.pins.find(p => p.id === S.sel.id); p[t.dataset.pin] = t.dataset.pin === 'size' ? +t.value : t.value; if (t.dataset.pin === 'size') snapPin(p); save(); drawPins(); if (t.dataset.pin === 'label') panel.querySelector('h2').textContent = t.value || 'Untitled'; }
  });

  // ---------- map interaction ----------
  const svgPt = (cx, cy) => { const p = new DOMPoint(cx, cy).matrixTransform(svg.getScreenCTM().inverse()); return [p.x, p.y]; };
  function snap(x, y, f) {
    const rx = x - B.ox, ry = y - B.oy;
    if (f === 2 || f === 4) { const cx = RT.clamp(Math.round(rx / B.cell), f / 2, B.cols - f / 2), cy = RT.clamp(Math.round(ry / B.cell), f / 2, B.rows - f / 2); return [B.ox + cx * B.cell, B.oy + cy * B.cell]; }
    if (f < 1) { const q = B.cell / 2; return [B.ox + Math.floor(rx / q) * q + q / 2, B.oy + Math.floor(ry / q) * q + q / 2]; }
    const m = (f - 1) / 2; const cx = RT.clamp(Math.floor(rx / B.cell), m, B.cols - 1 - m), cy = RT.clamp(Math.floor(ry / B.cell), m, B.rows - 1 - m); return [B.ox + cx * B.cell + B.cell / 2, B.oy + cy * B.cell + B.cell / 2];
  }
  const snapPin = p => { [p.x, p.y] = snap(p.x, p.y, p.size || 1); };
  let drag = null;
  svg.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, v: { ...S.view }, moved: false, id: e.pointerId }; });
  svg.addEventListener('pointermove', e => {
    if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; svg.classList.add('drag'); svg.setPointerCapture(drag.id); }
    if (drag.moved) { const bb = svg.getBoundingClientRect(), sc = Math.max(S.view.w / bb.width, S.view.h / bb.height); S.view.x = drag.v.x - dx * sc; S.view.y = drag.v.y - dy * sc; applyView(); }
  });
  svg.addEventListener('pointerup', e => { const d = drag; drag = null; svg.classList.remove('drag'); if (d && !d.moved) clickAt(e); });
  function clickAt(e) {
    const el = e.target.closest('[data-kind]'), k = el && el.dataset.kind;
    if (k === 'pin') { S.sel = { kind: 'pin', id: el.dataset.id }; draw(); return; }
    if (S.pinMode) {
      let [x, y] = svgPt(e.clientX, e.clientY), size = 1;
      if (S.mode === 'battle') { size = S.pinSize; if (x < B.ox || y < B.oy || x > B.ox + B.cols * B.cell || y > B.oy + B.rows * B.cell) return;[x, y] = snap(x, y, size); }
      const n = S.pins.filter(p => p.scope === scope() && p.type === S.pinType).length + 1;
      const p = { id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 99), scope: scope(), x, y, type: S.pinType, size, label: S.mode === 'battle' ? (S.pinType === 'hero' ? 'H' : S.pinType === 'foe' ? 'F' : 'M') + n : '', note: '' };
      S.pins.push(p); S.sel = { kind: 'pin', id: p.id }; save(); draw(); return;
    }
    if (!el) { S.sel = null; draw(); return; }
    S.sel = { kind: k, id: el.dataset.id }; draw();
  }
  function zoomBy(f, cx, cy) {
    const v = S.view, [px, py] = cx == null ? [v.x + v.w / 2, v.y + v.h / 2] : svgPt(cx, cy), w = RT.clamp(v.w * f, 160, W), k = w / v.w;
    S.view = { x: px - (px - v.x) * k, y: py - (py - v.y) * k, w, h: v.h * k }; if (w >= W - 1) S.view = { x: 0, y: 0, w: W, h: H }; applyView();
  }
  svg.addEventListener('wheel', e => { e.preventDefault(); zoomBy(e.deltaY > 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
  $('zIn').onclick = () => zoomBy(1 / 1.3); $('zOut').onclick = () => zoomBy(1.3); $('zReset').onclick = () => { S.view = { x: 0, y: 0, w: W, h: H }; applyView(); };

  // ---------- controls ----------
  function init() {
    load();
    $('themeSel').value = S.theme; $('pxSel').value = String(S.px);
    $('citySel').innerHTML = CITIES.map(c => `<option value="${c.id}">${RT.esc(c.name)}</option>`).join(''); $('citySel').value = S.cityId;
    $('scenarioSel').innerHTML = BATTLES.map(b => `<option value="${b.id}">${RT.esc(b.name)}</option>`).join(''); $('scenarioSel').value = S.scenario;
    $('eraSel').innerHTML = Object.keys(D.eras).map(k => `<option value="${k}">${RT.esc(D.eras[k].name)}</option>`).join(''); $('eraSel').value = S.era;
    $('pinSize').innerHTML = SIZES.map(s => `<option value="${s[1]}" ${s[1] === 1 ? 'selected' : ''}>${s[0]} (${s[1] >= 1 ? s[1] * 5 : 2.5} ft)</option>`).join('');
    const map = { tLabels: 'labels', tNumbers: 'numbers', tGrid: 'grid', tDeco: 'deco' };
    Object.keys(map).forEach(id => { $(id).checked = !!S.opts[map[id]]; $(id).onchange = () => { S.opts[map[id]] = $(id).checked ? 1 : 0; save(); draw(); }; });
    $('themeSel').onchange = () => { S.theme = $('themeSel').value; save(); draw(); };
    $('eraSel').onchange = () => { S.era = $('eraSel').value; save(); draw(); };
    $('citySel').onchange = () => { S.cityId = $('citySel').value; S.sel = null; S.view = { x: 0, y: 0, w: W, h: H }; draw(); };
    $('scenarioSel').onchange = () => { S.scenario = $('scenarioSel').value; S.sel = null; draw(); };
    $('pxSel').onchange = () => { S.px = +$('pxSel').value; save(); updateExportInfo(); if (S.sel && S.sel.kind === 'scale') renderPanel(); };
    $('loreBtn').onclick = () => { S.sel = { kind: 'lore' }; renderPanel(); }; $('scaleBtn').onclick = () => { S.sel = { kind: 'scale' }; renderPanel(); };
    $('pinType').onchange = () => { S.pinType = $('pinType').value; }; $('pinSize').onchange = () => { S.pinSize = +$('pinSize').value; };
    $('pinMode').onclick = () => { S.pinMode = !S.pinMode; $('pinMode').classList.toggle('on', S.pinMode); svg.classList.toggle('pinning', S.pinMode); toast(S.pinMode ? 'Click the map to place' : 'Placement off'); };
    document.querySelectorAll('#scaleTabs button').forEach(b => b.onclick = () => setMode(b.dataset.scale));
    document.addEventListener('keydown', e => {
      if (/TEXTAREA|SELECT/.test(e.target.tagName) || (e.target.tagName === 'INPUT' && e.target.type === 'text')) return;
      if (e.key === '1') setMode('city'); if (e.key === '2') setMode('battle');
      if (e.key === 'Escape') { S.sel = null; draw(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && S.sel && S.sel.kind === 'pin') { S.pins = S.pins.filter(p => p.id !== S.sel.id); S.sel = null; save(); draw(); }
    });
    $('exSvg').onclick = () => download(new Blob([serialize(false)], { type: 'image/svg+xml' }), name('svg'));
    $('exPng').onclick = () => exportPng(false); $('exVtt').onclick = () => exportPng(true);
    $('saveJson').onclick = () => download(new Blob([JSON.stringify({ app: 'runeterra-atlas', pins: S.pins, notes: S.notes, theme: S.theme, era: S.era }, null, 2)], { type: 'application/json' }), 'demacia-campaign.json');
    $('loadJson').onclick = () => $('fileIn').click();
    $('fileIn').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const d = JSON.parse(t); S.pins = d.pins || []; S.notes = d.notes || {}; save(); draw(); toast('Campaign loaded'); } catch (er) { toast('Invalid file'); } }); e.target.value = ''; };
    $('resetAll').onclick = () => { if (confirm('Delete all pins and notes?')) { S.pins = []; S.notes = {}; S.sel = null; save(); draw(); } };
    setMode('city');
  }

  // ---------- export ----------
  const name = ext => `demacia-${S.mode === 'city' ? S.cityId : S.scenario}.${ext}`;
  function download(blob, fn) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  function serialize(clean) {
    const c = svg.cloneNode(true), bx = exportBox(clean);
    c.setAttribute('viewBox', `${bx.x} ${bx.y} ${bx.w} ${bx.h}`); c.setAttribute('width', bx.px); c.setAttribute('height', bx.py); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.removeAttribute('class'); c.removeAttribute('style');
    if (clean) ['pins', 'deco', 'grid'].forEach(id => { const n = c.querySelector('#' + id); if (n) n.remove(); });
    c.querySelectorAll('.sel').forEach(n => n.classList.remove('sel'));
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(c);
  }
  function exportPng(clean) {
    const bx = exportBox(clean), url = URL.createObjectURL(new Blob([serialize(clean)], { type: 'image/svg+xml;charset=utf-8' })), img = new Image();
    img.onload = () => { const cv = document.createElement('canvas'); cv.width = bx.px; cv.height = bx.py; cv.getContext('2d').drawImage(img, 0, 0, bx.px, bx.py); cv.toBlob(b => { download(b, name('png')); URL.revokeObjectURL(url); toast(S.mode === 'battle' ? `Exported: 1 square = ${S.px} px (5 ft)` : 'PNG exported'); }, 'image/png'); };
    img.onerror = () => toast('PNG export failed'); img.src = url;
  }
  RT.app = { S, draw, setMode };
  document.addEventListener('DOMContentLoaded', init);
})(window.RT);
