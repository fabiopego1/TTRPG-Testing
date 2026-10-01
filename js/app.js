/* Runeterra Atlas — UI, interaction, persistence, export */
(function (RT) {
  const $ = id => document.getElementById(id), svg = $('map'), panel = $('panel');
  const STORE = 'runeterra-atlas-v1';
  const B = RT.BATTLE;
  const S = {
    scale: 'continent', seed: 'ashen-crown', theme: 'parchment', regionId: 'demacia', cityId: 'demacia', biome: 'plains',
    opts: { labels: 1, borders: 1, icons: 1, roads: 1, hex: 0, grid: 1, deco: 1 },
    sel: null, view: { x: 0, y: 0, w: RT.W, h: RT.H }, pinMode: false, pinType: 'npc', pins: [], notes: {}
  };
  const PIN_TYPES = {
    world: { npc: ['NPC', '#3b8fe0'], quest: ['Quest hook', '#c8aa6e'], enc: ['Encounter', '#e84057'], note: ['Note', '#3fb27f'] },
    battle: { hero: ['Hero', '#3b8fe0'], foe: ['Foe', '#e84057'], note: ['Marker', '#c8aa6e'] }
  };

  // ---------- persistence ----------
  function save() { try { localStorage.setItem(STORE, JSON.stringify({ pins: S.pins, notes: S.notes, seed: S.seed, theme: S.theme, opts: S.opts })); } catch (e) { } }
  function load() {
    try { const d = JSON.parse(localStorage.getItem(STORE) || 'null'); if (d) { S.pins = d.pins || []; S.notes = d.notes || {}; S.seed = d.seed || S.seed; S.theme = d.theme || S.theme; Object.assign(S.opts, d.opts || {}); } } catch (e) { }
  }
  const toast = msg => { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 1800); };

  // ---------- helpers ----------
  const isWorld = () => S.scale === 'continent' || S.scale === 'region';
  const cityList = () => RT.POIS.filter(p => p.type === 'city' || p.type === 'port');
  const poiById = id => RT.POIS.find(p => p.id === id) || genPois().find(p => p.id === id);
  const genPois = () => (S.scale === 'region' ? RT.genPois(S.regionId, S.seed) : []);
  const scope = () => isWorld() ? 'world' : S.scale === 'city' ? `city:${S.cityId}:${S.seed}` : `battle:${S.seed}:${S.biome}`;
  const pinKind = () => S.scale === 'battle' ? 'battle' : 'world';
  const mpu = () => 2 * (S.view.w / RT.W);
  function regionView(id) {
    const bb = RT.regionBBox(id), pad = 40; let w = bb.w + pad * 2, h = bb.h + pad * 2;
    if (w / h < 1.6) w = h * 1.6; else h = w / 1.6;
    const cx = bb.x0 + bb.w / 2, cy = bb.y0 + bb.h / 2; return { x: cx - w / 2, y: cy - h / 2, w, h };
  }
  const fullView = () => ({ x: 0, y: 0, w: RT.W, h: RT.H });
  const dice = n => 1 + Math.floor(Math.random() * n);

  // ---------- drawing ----------
  function draw() {
    const th = RT.THEMES[S.theme] || RT.THEMES.parchment; let inner = '';
    if (isWorld()) {
      inner = RT.renderWorld({ theme: S.theme, seed: S.seed, view: S.view, focus: S.scale === 'region' ? S.regionId : null, labels: S.opts.labels, borders: S.opts.borders, icons: S.opts.icons, roads: S.opts.roads, hex: S.opts.hex, genPois: genPois(), sel: S.sel && S.sel.kind + ':' + S.sel.id });
    } else if (S.scale === 'city') inner = RT.renderCity({ theme: S.theme, seed: S.seed, poi: poiById(S.cityId) });
    else inner = RT.renderBattle({ theme: S.theme, seed: S.seed, biome: S.biome, grid: S.opts.grid });
    svg.innerHTML = inner + '<g id="pins"></g><g id="deco"></g>';
    applyView(); renderPanel(); updateCrumb();
    if (S.sel && S.sel.kind === 'cell') { const el = svg.querySelector(`.cell[data-id="${S.sel.id}"]`); if (el) el.classList.add('sel'); }
    if (S.sel && S.sel.kind === 'district') { const el = [...svg.querySelectorAll('.poi')].find(e => e.dataset.id === S.sel.id); if (el) el.classList.add('sel'); }
  }
  function applyView() {
    const v = S.view; svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
    const th = RT.THEMES[S.theme], deco = $('deco'); if (!deco) return;
    const k = v.w / RT.W;
    let inner = '';
    if (S.opts.deco) {
      if (isWorld()) inner = RT.renderDeco(th, v, mpu());
      else {
        const ink = th.ink, gold = th.gold;
        inner = `<g pointer-events="none" font-family="Cinzel,Georgia,serif" fill="${ink}"><rect x="10" y="10" width="${RT.W - 20}" height="${RT.H - 20}" fill="none" stroke="${gold}" stroke-width="3"/><rect x="18" y="18" width="${RT.W - 36}" height="${RT.H - 36}" fill="none" stroke="${gold}"/>` +
          (S.scale === 'battle' ? '' : `<text x="60" y="${RT.H - 36}" font-size="13">1 inch ≈ 100 ft · North ↑</text>`) + `</g>`;
      }
    }
    deco.setAttribute('transform', `translate(${v.x} ${v.y}) scale(${k})`); deco.innerHTML = inner;
    drawPins();
  }
  function drawPins() {
    const g = $('pins'); if (!g) return; const k = Math.pow(S.view.w / RT.W, .7), types = PIN_TYPES[pinKind()];
    g.innerHTML = S.pins.filter(p => p.scope === scope()).map(p => {
      const t = types[p.type] || types.note, r = (S.scale === 'battle' ? 17 : 11) * (S.scale === 'battle' ? 1 : k), sel = S.sel && S.sel.kind === 'pin' && S.sel.id === p.id;
      const shape = S.scale === 'battle'
        ? `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${t[1]}" stroke="#fff" stroke-width="${sel ? 4 : 2.5}"/><text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" pointer-events="none">${RT.esc((p.label || '?').slice(0, 2).toUpperCase())}</text>`
        : `<path d="M${p.x} ${p.y}c${-r * .2} ${-r * .9} ${-r} ${-r * 1.2} ${-r} ${-r * 2.1}a${r} ${r} 0 1 1 ${r * 2} 0c0 ${r * .9} ${-r * .8} ${r * 1.2} ${-r} ${r * 2.1}Z" fill="${t[1]}" stroke="${sel ? '#fff' : '#010a13'}" stroke-width="${(sel ? 2.4 : 1.6) * k}"/><circle cx="${p.x}" cy="${p.y - r * 2.1}" r="${r * .38}" fill="#fff"/>`;
      const lab = S.scale !== 'battle' && p.label ? `<text x="${p.x + r * 1.3}" y="${p.y - r * 1.8}" font-size="${12 * k}" fill="#fff" stroke="#010a13" stroke-width="${3.4 * k}" paint-order="stroke" font-family="Cinzel,Georgia,serif" pointer-events="none">${RT.esc(p.label)}</text>` : '';
      return `<g class="pin" data-kind="pin" data-id="${p.id}">${shape}${lab}</g>`;
    }).join('');
  }
  function updateCrumb() {
    const r = RT.regionById(S.regionId), c = poiById(S.cityId);
    $('crumb').textContent = { continent: 'RUNETERRA · CONTINENT', region: `RUNETERRA › ${r.name.toUpperCase()}`, city: `${r.name.toUpperCase()} › ${(c ? c.name.replace(/ — .*/, '') : '').toUpperCase()}`, battle: `BATTLE MAP › ${RT.BIOMES[S.biome].name.toUpperCase()}` }[S.scale];
  }

  // ---------- scale switching ----------
  function setScale(sc, keepSel) {
    S.scale = sc; if (!keepSel) S.sel = null;
    S.view = sc === 'region' ? regionView(S.regionId) : fullView();
    document.querySelectorAll('#scaleTabs button').forEach(b => b.classList.toggle('on', b.dataset.scale === sc));
    $('fldRegion').style.display = sc === 'region' ? '' : 'none';
    $('fldCity').style.display = sc === 'city' ? '' : 'none';
    $('fldBiome').style.display = sc === 'battle' ? '' : 'none';
    fillPinTypes(); draw();
  }
  function fillPinTypes() {
    const t = PIN_TYPES[pinKind()], sel = $('pinType'); sel.innerHTML = Object.keys(t).map(k => `<option value="${k}">${t[k][0]}</option>`).join('');
    if (!t[S.pinType]) S.pinType = Object.keys(t)[0]; sel.value = S.pinType;
  }
  function openRegion(id) { S.regionId = id; $('regionSel').value = id; S.sel = { kind: 'region', id }; setScale('region', true); }
  function openCity(id) { S.cityId = id; $('citySel').value = id; const p = poiById(id); if (p) S.regionId = p.region; S.sel = null; setScale('city'); }

  // ---------- panel ----------
  const list = (arr, fn) => arr.map(fn).join('');
  function encTable(items, key) {
    return `<ul class="enc" data-enc="${key}">${list(items, (e, i) => `<li data-i="${i}"><b>${i + 1}</b><span>${RT.esc(e)}</span></li>`)}</ul>
      <div class="roll"><button class="btn" data-act="roll" data-n="${items.length}">Roll d${items.length}</button><span class="result"></span></div>`;
  }
  const notesBox = key => `<h4>Session notes</h4><textarea data-note="${RT.esc(key)}" placeholder="Prep, clues, secrets…">${RT.esc(S.notes[key] || '')}</textarea>`;
  const threat = n => `<span class="threat" title="Threat ${n}/5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? 'f' : ''}"></i>`).join('')}</span>`;
  const npcHtml = n => `<div class="npc"><b>${RT.esc(n[0])}</b><em>${RT.esc(n[1])}</em><p>${RT.esc(n[2])}</p></div>`;

  function renderPanel() {
    const s = S.sel; let h = '';
    if (!s) h = overview();
    else if (s.kind === 'region') h = regionPanel(RT.regionById(s.id));
    else if (s.kind === 'poi') h = poiPanel(poiById(s.id));
    else if (s.kind === 'district') h = districtPanel(s.id);
    else if (s.kind === 'cell') h = cellPanel(s.id);
    else if (s.kind === 'pin') h = pinPanel(S.pins.find(p => p.id === s.id));
    panel.innerHTML = h || overview(); panel.scrollTop = 0;
  }
  function overview() {
    const intro = {
      continent: 'Click a region or landmark to open its encounter tables, NPCs and hooks. Double-click to zoom into a regional or city map. Scroll to zoom, drag to pan.',
      region: 'Procedurally scattered terrain, hamlets, ruins and shrines fill the region. Click any marker for a generated hook and encounter.',
      city: 'Click numbered districts or gates for rumors, NPCs and encounters. Re-roll the seed for a fresh layout.',
      battle: (S.biome === 'lab' ? 'Dr. ' + RT.labLayout(S.seed).owner + '’s Zaun laboratory. ' : '') + 'Each square is 5 ft. Click a square to read its terrain rules. Use “Place” to drop hero/foe tokens; export a gridless PNG at 70 px per square for your VTT.'
    }[S.scale];
    return `<h2>${S.scale === 'continent' ? 'Runeterra' : S.scale === 'region' ? RT.regionById(S.regionId).name : S.scale === 'city' ? 'City Map' : 'Battle Map'}</h2><div class="tag">Seed: ${RT.esc(S.seed)}</div><p class="lore">${intro}</p>
      <h4>Regions</h4><div class="list">${list(RT.REGIONS, r => `<a data-act="selRegion" data-id="${r.id}">${r.name}<small>${threat(r.threat).replace(/<[^>]+>/g, '') ? 'Threat ' + r.threat : ''}</small></a>`)}</div>`;
  }
  function regionPanel(r) {
    const pois = RT.POIS.filter(p => p.region === r.id);
    return `<div class="tag">${RT.esc(r.tag)}</div><h2>${r.name}</h2>
      <div class="chips"><span class="chip">${RT.esc(r.gov)}</span><span class="chip">Threat ${threat(r.threat)}</span></div>
      <div class="actions"><button class="btn gold" data-act="openRegion" data-id="${r.id}">Open regional map</button></div>
      <p class="lore">${RT.esc(r.lore)}</p>
      <h4>Points of interest</h4><div class="list">${list(pois, p => `<a data-act="selPoi" data-id="${p.id}">${RT.esc(p.name.replace(/ — .*/, ''))}<small>${p.type}</small></a>`)}</div>
      <h4>Encounters</h4>${encTable(r.enc, 'enc:' + r.id)}
      <h4>NPCs <button class="btn" data-act="genNpc" data-id="${r.id}">+ Random</button></h4><div id="npcs">${list(r.npcs, npcHtml)}</div>
      <h4>Quest hooks <button class="btn" data-act="genHook" data-id="${r.id}">+ Random</button></h4><div id="hooks">${list(r.hooks, h => `<div class="hook">${RT.esc(h)}</div>`)}</div>
      ${notesBox('region:' + r.id)}`;
  }
  function poiPanel(p) {
    if (!p) return overview();
    const r = RT.regionById(p.region), isCity = p.type === 'city' || p.type === 'port';
    const rr = RT.rng(S.seed + '|poi|' + p.id), hookText = p.hook || RT.genHook(rr, r.culture);
    return `<div class="tag">${RT.esc(r.name)} · ${p.type}</div><h2>${RT.esc(p.name)}</h2>
      <div class="actions">${isCity ? `<button class="btn gold" data-act="openCity" data-id="${p.id}">Open city map</button>` : ''}<button class="btn" data-act="selRegion" data-id="${p.region}">Region info</button></div>
      <p class="lore">${p.gen ? `A ${p.type} the seed has conjured in ${RT.esc(r.name)}. ` : ''}${RT.esc(r.lore.split('. ')[0])}.</p>
      <h4>Hook</h4><div class="hook" id="poiHook">${RT.esc(hookText)}</div><div class="actions"><button class="btn" data-act="rerollHook" data-id="${p.id}">Re-roll hook</button></div>
      <h4>Encounters here</h4>${encTable(r.enc, 'enc:' + r.id)}
      <h4>Local NPC</h4>${npcHtml(r.npcs[RT.hashStr(p.id) % r.npcs.length])}
      ${notesBox('poi:' + p.id)}`;
  }
  const DESC = ['The beating heart of the city — fountains, speeches and pickpockets.', 'The wealthy hold court here; guards are numerous and polite until they are not.', 'Craftsmen, guildhalls and trade — gossip travels faster than coin.', 'Crowded, loud and watched by those who prefer not to be seen.', 'Old streets, older secrets, and a tavern for every grudge.'];
  function districtPanel(id) {
    const parts = id.split(':'), isGate = parts[0] === 'gate', p = poiById(S.cityId), r = RT.regionById(p.region), rr = RT.rng(S.seed + '|dist|' + id);
    const name = isGate ? `Gate ${+parts[1] + 1}` : parts.slice(2).join(':'), idx = isGate ? 0 : +parts[1];
    const npc = [RT.genName(rr, r.culture, 'person'), RT.pick(rr, ['Innkeeper', 'Guard sergeant', 'Fence', 'Priest', 'Guild clerk', 'Retired adventurer', 'Street prophet']), RT.pick(rr, ['Knows who left the city last night.', 'Is owed a favor by someone powerful.', 'Is quietly selling information.', 'Wants the party to carry a message — unread.', 'Is not who they say they are.'])];
    return `<div class="tag">${RT.esc(p.name.replace(/ — .*/, ''))} · ${isGate ? 'Gate' : 'District'}</div><h2>${RT.esc(name)}</h2>
      <p class="lore">${isGate ? 'A fortified gate. Guards check papers, taxes and rumors — in that order of importance.' : DESC[idx]}</p>
      <h4>Rumor</h4><div class="hook">${RT.esc(RT.genHook(rr, r.culture))}</div>
      <h4>Resident</h4>${npcHtml(npc)}
      <h4>Street encounters</h4>${encTable(r.enc, 'enc:' + r.id)}
      ${notesBox('district:' + S.cityId + ':' + id)}`;
  }
  function cellPanel(id) {
    const cell = RT.battleCells(S.seed + '|' + S.biome, S.biome).find(c => c.x + ',' + c.y === id), inf = RT.cellInfo[cell.type] || RT.cellInfo.ground;
    let room = '';
    if (S.biome === 'lab') { const L = RT.labLayout(S.seed), rm = L.rooms[cell.room]; room = `<h4>${RT.esc(rm ? rm.role : 'Outer wall')}</h4><p class="lore">${RT.esc(rm ? RT.LAB_ROLE[rm.role] : 'The laboratory’s outer shell.')}</p>`; }
    return `<div class="tag">${S.biome === 'lab' ? 'Dr. ' + RT.esc(RT.labLayout(S.seed).owner) + '’s laboratory · ' : ''}Square ${id.replace(',', ' · ')}</div><h2>${inf[0]}</h2><p class="lore">${inf[1]}</p>${cell.feat ? `<p class="empty">Feature: ${cell.feat}</p>` : ''}${room}
      <h4>${RT.BIOMES[S.biome].name} encounters</h4>${encTable(RT.BIOMES[S.biome].enc, 'enc:b:' + S.biome)}${notesBox('cell:' + S.seed + ':' + S.biome + ':' + id)}`;
  }
  function pinPanel(p) {
    if (!p) return overview(); const t = PIN_TYPES[pinKind()];
    return `<div class="tag">Pin</div><h2>${RT.esc(p.label || 'Untitled pin')}</h2>
      <label class="fld">Label<input type="text" data-pin="label" value="${RT.esc(p.label || '')}"></label>
      <label class="fld">Type<select data-pin="type">${Object.keys(t).map(k => `<option value="${k}" ${k === p.type ? 'selected' : ''}>${t[k][0]}</option>`).join('')}</select></label>
      <label class="fld">Notes<textarea data-pin="note" placeholder="Stat block, motive, secrets…">${RT.esc(p.note || '')}</textarea></label>
      <div class="actions"><button class="btn" data-act="delPin" data-id="${p.id}">Delete pin</button></div>`;
  }

  // ---------- panel events ----------
  panel.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return; const act = a.dataset.act, id = a.dataset.id;
    if (act === 'roll') {
      const ul = a.closest('h4,div').parentElement.querySelector('.enc') || panel.querySelector('.enc'), n = +a.dataset.n, v = dice(n);
      const box = a.parentElement.previousElementSibling; box.querySelectorAll('li').forEach(li => li.classList.remove('hit'));
      const li = box.querySelector(`li[data-i="${v - 1}"]`); if (li) li.classList.add('hit'); a.nextElementSibling.textContent = `d${n} → ${v}`;
    } else if (act === 'selRegion') { S.sel = { kind: 'region', id }; draw(); }
    else if (act === 'selPoi') { S.sel = { kind: 'poi', id }; draw(); }
    else if (act === 'openRegion') openRegion(id);
    else if (act === 'openCity') openCity(id);
    else if (act === 'genNpc') { const r = RT.regionById(id), rr = RT.rng(Math.random() + ''); $('npcs').insertAdjacentHTML('beforeend', npcHtml([RT.genName(rr, r.culture, 'person'), RT.pick(rr, ['Wanderer', 'Courier', 'Mercenary', 'Scholar', 'Smuggler', 'Pilgrim']), RT.pick(rr, ['Seeks someone who does not want to be found.', 'Carries a letter they cannot read.', 'Is being followed.', 'Secretly serves a rival faction.', 'Owes the party a favor — they just don’t know it yet.'])])); }
    else if (act === 'genHook') { const r = RT.regionById(id); $('hooks').insertAdjacentHTML('beforeend', `<div class="hook">${RT.esc(RT.genHook(RT.rng(Math.random() + ''), r.culture))}</div>`); }
    else if (act === 'rerollHook') { const p = poiById(id), r = RT.regionById(p.region), t = RT.genHook(RT.rng(Math.random() + ''), r.culture); $('poiHook').textContent = t; if (p.gen) p.hook = t; }
    else if (act === 'delPin') { S.pins = S.pins.filter(p => p.id !== id); S.sel = null; save(); draw(); }
  });
  panel.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset.note) { S.notes[t.dataset.note] = t.value; save(); }
    else if (t.dataset.pin) {
      const p = S.pins.find(p => p.id === S.sel.id); p[t.dataset.pin] = t.value; save(); drawPins();
      if (t.dataset.pin === 'label') panel.querySelector('h2').textContent = t.value || 'Untitled pin';
    }
  });

  // ---------- map interaction ----------
  const svgPt = (cx, cy) => { const m = svg.getScreenCTM().inverse(), p = new DOMPoint(cx, cy).matrixTransform(m); return [p.x, p.y]; };
  let drag = null, zt = null, lastClick = null;
  svg.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, v: { ...S.view }, moved: false, id: e.pointerId }; });
  svg.addEventListener('pointermove', e => {
    if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; svg.classList.add('drag'); svg.setPointerCapture(drag.id); }
    if (drag.moved) { const u = S.view.w / svg.getBoundingClientRect().width, sc = Math.max(S.view.w / svg.getBoundingClientRect().width, S.view.h / svg.getBoundingClientRect().height); S.view.x = drag.v.x - dx * sc; S.view.y = drag.v.y - dy * sc; applyView(); }
  });
  svg.addEventListener('pointerup', e => {
    const d = drag; drag = null; svg.classList.remove('drag'); if (!d) return;
    if (d.moved) { if (isWorld()) { clearTimeout(zt); zt = setTimeout(draw, 60); } return; }
    clickAt(e);
  });
  function clickAt(e) {
    const el = e.target.closest('[data-kind]'), k = el && el.dataset.kind;
    if (k === 'pin') { S.sel = { kind: 'pin', id: el.dataset.id }; draw(); return; }
    if (S.pinMode) {
      let [x, y] = svgPt(e.clientX, e.clientY);
      if (S.scale === 'battle') { const cx = Math.floor((x - B.ox) / B.cell), cy = Math.floor((y - B.oy) / B.cell); if (cx < 0 || cy < 0 || cx >= B.cols || cy >= B.rows) return; x = B.ox + cx * B.cell + B.cell / 2; y = B.oy + cy * B.cell + B.cell / 2; }
      const n = S.pins.filter(p => p.scope === scope() && p.type === S.pinType).length + 1;
      const p = { id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 99), scope: scope(), x, y, type: S.pinType, label: S.scale === 'battle' ? (S.pinType === 'hero' ? 'H' : S.pinType === 'foe' ? 'F' : 'M') + n : '', note: '' };
      S.pins.push(p); S.sel = { kind: 'pin', id: p.id }; save(); draw(); return;
    }
    if (!el) { S.sel = null; draw(); return; }
    const now = Date.now(), dbl = lastClick && lastClick.id === el.dataset.id && now - lastClick.t < 400; lastClick = { id: el.dataset.id, t: now };
    S.sel = { kind: k, id: el.dataset.id }; draw(); if (dbl) openDeeper(k, el.dataset.id);
  }
  // The map is re-rendered on every selection, so native dblclick never fires; detect it ourselves.
  function openDeeper(kind, id) {
    if (kind === 'region' && S.scale === 'continent') openRegion(id);
    else if (kind === 'poi' && isWorld()) { const p = poiById(id); if (p && (p.type === 'city' || p.type === 'port')) openCity(p.id); }
  }
  function zoomBy(f, cx, cy) {
    const v = S.view, [px, py] = cx == null ? [v.x + v.w / 2, v.y + v.h / 2] : svgPt(cx, cy);
    let w = RT.clamp(v.w * f, 120, RT.W * 1.0); if (S.scale !== 'region') w = Math.min(w, RT.W); const k = w / v.w;
    S.view = { x: px - (px - v.x) * k, y: py - (py - v.y) * k, w, h: v.h * k };
    if (S.view.w >= RT.W - 1) S.view = isWorld() || true ? { ...S.view, x: RT.clamp(S.view.x, 0, RT.W - S.view.w), y: RT.clamp(S.view.y, 0, RT.H - S.view.h) } : S.view;
    applyView(); if (isWorld()) { clearTimeout(zt); zt = setTimeout(draw, 160); }
  }
  svg.addEventListener('wheel', e => { e.preventDefault(); zoomBy(e.deltaY > 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
  $('zIn').onclick = () => zoomBy(1 / 1.3); $('zOut').onclick = () => zoomBy(1.3);
  $('zReset').onclick = () => { S.view = S.scale === 'region' ? regionView(S.regionId) : fullView(); draw(); };

  // ---------- controls ----------
  function init() {
    load();
    $('seed').value = S.seed; $('themeSel').innerHTML = Object.keys(RT.THEMES).map(k => `<option value="${k}">${RT.THEMES[k].name}</option>`).join(''); $('themeSel').value = S.theme;
    $('regionSel').innerHTML = RT.REGIONS.map(r => `<option value="${r.id}">${r.name}</option>`).join(''); $('regionSel').value = S.regionId;
    $('citySel').innerHTML = cityList().map(p => `<option value="${p.id}">${RT.esc(p.name.replace(/ — .*/, ''))}</option>`).join(''); $('citySel').value = S.cityId;
    $('biomeSel').innerHTML = RT.battleBiomes.map(k => `<option value="${k}">${RT.BIOMES[k].name}</option>`).join(''); $('biomeSel').value = S.biome;
    const map = { tLabels: 'labels', tBorders: 'borders', tIcons: 'icons', tRoads: 'roads', tHex: 'hex', tGrid: 'grid', tDeco: 'deco' };
    Object.keys(map).forEach(id => { $(id).checked = !!S.opts[map[id]]; $(id).onchange = () => { S.opts[map[id]] = $(id).checked ? 1 : 0; save(); draw(); }; });
    $('seed').onchange = () => { S.seed = $('seed').value.trim() || 'runeterra'; save(); draw(); };
    $('rollSeed').onclick = () => { S.seed = Math.random().toString(36).slice(2, 8); $('seed').value = S.seed; save(); S.sel = S.sel && ['region', 'pin'].includes(S.sel.kind) ? S.sel : null; draw(); toast('Seed ' + S.seed); };
    $('themeSel').onchange = () => { S.theme = $('themeSel').value; save(); draw(); };
    $('regionSel').onchange = () => { S.regionId = $('regionSel').value; S.sel = { kind: 'region', id: S.regionId }; S.view = regionView(S.regionId); draw(); };
    $('citySel').onchange = () => { S.cityId = $('citySel').value; S.sel = null; draw(); };
    $('biomeSel').onchange = () => { S.biome = $('biomeSel').value; S.sel = null; draw(); };
    $('pinType').onchange = () => { S.pinType = $('pinType').value; };
    $('pinMode').onclick = () => { S.pinMode = !S.pinMode; $('pinMode').classList.toggle('on', S.pinMode); svg.classList.toggle('pinning', S.pinMode); toast(S.pinMode ? 'Click the map to place a pin' : 'Pin placement off'); };
    document.querySelectorAll('#scaleTabs button').forEach(b => b.onclick = () => setScale(b.dataset.scale));
    document.addEventListener('keydown', e => {
      if (/TEXTAREA|SELECT/.test(e.target.tagName) || (e.target.tagName === 'INPUT' && e.target.type === 'text')) return;
      const m = { 1: 'continent', 2: 'region', 3: 'city', 4: 'battle' }[e.key]; if (m) setScale(m);
      if (e.key === 'Escape') { S.sel = null; draw(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && S.sel && S.sel.kind === 'pin') { S.pins = S.pins.filter(p => p.id !== S.sel.id); S.sel = null; save(); draw(); }
    });
    $('exSvg').onclick = () => download(new Blob([serialize(false)], { type: 'image/svg+xml' }), name('svg'));
    $('exPng').onclick = () => exportPng(false); $('exVtt').onclick = () => exportPng(true);
    $('saveJson').onclick = () => download(new Blob([JSON.stringify({ app: 'runeterra-atlas', pins: S.pins, notes: S.notes, seed: S.seed, theme: S.theme }, null, 2)], { type: 'application/json' }), 'runeterra-campaign.json');
    $('loadJson').onclick = () => $('fileIn').click();
    $('fileIn').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const d = JSON.parse(t); S.pins = d.pins || []; S.notes = d.notes || {}; if (d.seed) { S.seed = d.seed; $('seed').value = d.seed; } save(); draw(); toast('Campaign loaded'); } catch (er) { toast('Invalid file'); } }); e.target.value = ''; };
    $('resetAll').onclick = () => { if (confirm('Delete all pins and notes?')) { S.pins = []; S.notes = {}; S.sel = null; save(); draw(); } };
    setScale('continent');
  }

  // ---------- export ----------
  const name = ext => `runeterra-${S.scale}-${S.seed}.${ext}`;
  function download(blob, fn) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  function exportBox(clean) {
    if (clean && S.scale === 'battle') return { x: B.ox, y: B.oy, w: B.cols * B.cell, h: B.rows * B.cell, px: B.cols * 70, py: B.rows * 70 };
    return { ...S.view, px: 3200, py: Math.round(3200 * S.view.h / S.view.w) };
  }
  function serialize(clean) {
    const c = svg.cloneNode(true), bx = exportBox(clean);
    c.setAttribute('viewBox', `${bx.x} ${bx.y} ${bx.w} ${bx.h}`); c.setAttribute('width', bx.px); c.setAttribute('height', bx.py); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    c.removeAttribute('class'); c.removeAttribute('style');
    if (clean) { ['pins', 'deco', 'grid', 'roomlabels'].forEach(id => { const n = c.querySelector('#' + id); if (n) n.remove(); }); }
    c.querySelectorAll('.sel').forEach(n => n.classList.remove('sel'));
    const st = document.createElementNS('http://www.w3.org/2000/svg', 'style'); st.textContent = '.region.sel{}'; c.insertBefore(st, c.firstChild);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(c);
  }
  function exportPng(clean) {
    const bx = exportBox(clean), url = URL.createObjectURL(new Blob([serialize(clean)], { type: 'image/svg+xml;charset=utf-8' })), img = new Image();
    img.onload = () => { const cv = document.createElement('canvas'); cv.width = bx.px; cv.height = bx.py; cv.getContext('2d').drawImage(img, 0, 0, bx.px, bx.py); cv.toBlob(b => { download(b, name('png')); URL.revokeObjectURL(url); toast(clean && S.scale === 'battle' ? 'Exported at 70 px / square' : 'PNG exported'); }, 'image/png'); };
    img.onerror = () => toast('PNG export failed'); img.src = url;
  }

  RT.app = { S, draw, setScale };
  document.addEventListener('DOMContentLoaded', init);
})(window.RT);
