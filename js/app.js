/* Runeterra Atlas — UI for Demacia city & battle maps */
(function (RT) {
  const $ = id => document.getElementById(id), svg = $('map'), panel = $('panel');
  const STORE = 'runeterra-atlas-demacia-v1', B = RT.BATTLE, D = RT.DEMACIA, CITIES = RT.DEMACIA_CITIES, BATTLES = RT.DEMACIA_BATTLES;
  const S = { mode: 'city', cityId: 'demacia', scenario: 'cloudwoods', seed: 'lightshield', theme: 'day', era: 'peace', opts: { labels: 1, numbers: 1, grid: 1, deco: 1 }, sel: null, view: { x: 0, y: 0, w: RT.W, h: RT.H }, pinMode: false, pinType: 'npc', pins: [], notes: {} };
  const PIN_TYPES = { city: { npc: ['NPC', '#3b8fe0'], quest: ['Quest hook', '#c8aa6e'], enc: ['Encounter', '#e84057'], note: ['Note', '#3fb27f'] }, battle: { hero: ['Hero', '#3b8fe0'], foe: ['Foe', '#e84057'], note: ['Marker', '#c8aa6e'] } };
  const city = () => CITIES.find(c => c.id === S.cityId), battle = () => BATTLES.find(b => b.id === S.scenario);
  const scope = () => S.mode === 'city' ? 'city:' + S.cityId : `battle:${S.scenario}:${S.seed}`;
  const pinKind = () => S.mode;
  const eraName = () => D.eras[S.era].name;
  const dice = n => 1 + Math.floor(Math.random() * n);

  function save() { try { localStorage.setItem(STORE, JSON.stringify({ pins: S.pins, notes: S.notes, seed: S.seed, theme: S.theme, era: S.era, opts: S.opts })); } catch (e) { } }
  function load() { try { const d = JSON.parse(localStorage.getItem(STORE) || 'null'); if (d) { S.pins = d.pins || []; S.notes = d.notes || {}; S.seed = d.seed || S.seed; S.theme = d.theme || S.theme; S.era = d.era || S.era; Object.assign(S.opts, d.opts || {}); } } catch (e) { } }
  const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 1800); };

  // ---------- drawing ----------
  function draw() {
    svg.innerHTML = (S.mode === 'city'
      ? RT.renderCity({ theme: S.theme, seed: S.seed, city: city(), era: eraName(), labels: S.opts.labels, numbers: S.opts.numbers, sel: S.sel && S.sel.kind + ':' + S.sel.id })
      : RT.renderBattle({ theme: S.theme, seed: S.seed, scenario: S.scenario, grid: S.opts.grid })) + '<g id="pins"></g><g id="deco"></g>';
    if (S.sel && S.sel.kind === 'cell') { const el = svg.querySelector(`.cell[data-id="${S.sel.id}"]`); if (el) el.classList.add('sel'); }
    if (S.sel && S.sel.kind === 'district') { const el = [...svg.querySelectorAll('.poi')].find(e => e.dataset.kind === 'district' && e.dataset.id === S.sel.id); if (el) el.classList.add('sel'); }
    applyView(); renderPanel(); updateCrumb();
  }
  function applyView() {
    const v = S.view; svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
    const deco = $('deco'); if (!deco) return; const th = S.theme === 'night' ? { ink: '#dbe7f3', gold: '#c8aa6e' } : { ink: '#2a1d10', gold: '#8a6a2b' }, W = RT.W, H = RT.H;
    deco.setAttribute('transform', `translate(${v.x} ${v.y}) scale(${v.w / W})`);
    deco.innerHTML = !S.opts.deco ? '' : `<g pointer-events="none" font-family="Cinzel,Georgia,serif" fill="${th.ink}"><rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${th.gold}" stroke-width="3"/><rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke="${th.gold}"/>` +
      (S.mode === 'city' ? `<g transform="translate(${W - 100} ${H - 100})"><circle r="40" fill="none" stroke="${th.gold}" stroke-width="1.5"/><path d="M0 -50L8 -8L50 0L8 8L0 50L-8 8L-50 0L-8 -8Z" fill="${th.gold}" opacity=".85"/><text y="-58" text-anchor="middle" font-size="15" font-weight="700">N</text></g>` : '') + '</g>';
    drawPins();
  }
  function drawPins() {
    const g = $('pins'); if (!g) return; const k = Math.pow(S.view.w / RT.W, .7), types = PIN_TYPES[pinKind()], bat = S.mode === 'battle';
    g.innerHTML = S.pins.filter(p => p.scope === scope()).map(p => {
      const t = types[p.type] || types.note, r = bat ? 17 : 12 * k, sel = S.sel && S.sel.kind === 'pin' && S.sel.id === p.id;
      const shape = bat ? `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${t[1]}" stroke="#fff" stroke-width="${sel ? 4 : 2.5}"/><text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" pointer-events="none">${RT.esc((p.label || '?').slice(0, 2).toUpperCase())}</text>`
        : `<path d="M${p.x} ${p.y}c${-r * .2} ${-r * .9} ${-r} ${-r * 1.2} ${-r} ${-r * 2.1}a${r} ${r} 0 1 1 ${r * 2} 0c0 ${r * .9} ${-r * .8} ${r * 1.2} ${-r} ${r * 2.1}Z" fill="${t[1]}" stroke="${sel ? '#fff' : '#010a13'}" stroke-width="${(sel ? 2.4 : 1.6) * k}"/><circle cx="${p.x}" cy="${p.y - r * 2.1}" r="${r * .38}" fill="#fff"/>`;
      const lab = !bat && p.label ? `<text x="${p.x + r * 1.3}" y="${p.y - r * 1.8}" font-size="${13 * k}" fill="#fff" stroke="#010a13" stroke-width="${3.4 * k}" paint-order="stroke" font-family="Cinzel,Georgia,serif" pointer-events="none">${RT.esc(p.label)}</text>` : '';
      return `<g class="pin" data-kind="pin" data-id="${p.id}">${shape}${lab}</g>`;
    }).join('');
  }
  const updateCrumb = () => { $('crumb').textContent = S.mode === 'city' ? `DEMACIA › ${city().short.toUpperCase()}` : `DEMACIA › ${battle().name.toUpperCase()}`; };

  function setMode(m) {
    S.mode = m; S.sel = null; S.view = { x: 0, y: 0, w: RT.W, h: RT.H };
    document.querySelectorAll('#scaleTabs button').forEach(b => b.classList.toggle('on', b.dataset.scale === m));
    $('fldCity').style.display = m === 'city' ? '' : 'none'; $('fldScenario').style.display = m === 'battle' ? '' : 'none';
    $('lNumbers').style.display = m === 'city' ? '' : 'none'; $('lGrid').style.display = m === 'battle' ? '' : 'none';
    fillPinTypes(); draw();
  }
  function fillPinTypes() { const t = PIN_TYPES[pinKind()], sel = $('pinType'); sel.innerHTML = Object.keys(t).map(k => `<option value="${k}">${t[k][0]}</option>`).join(''); if (!t[S.pinType]) S.pinType = Object.keys(t)[0]; sel.value = S.pinType; }

  // ---------- panel ----------
  const list = (a, fn) => a.map(fn).join('');
  const encTable = (items, key) => `<ul class="enc" data-enc="${key}">${list(items, (e, i) => `<li data-i="${i}"><b>${i + 1}</b><span>${RT.esc(e)}</span></li>`)}</ul><div class="roll"><button class="btn" data-act="roll" data-n="${items.length}">Roll d${items.length}</button><span class="result"></span></div>`;
  const notesBox = key => `<h4>Session notes</h4><textarea data-note="${RT.esc(key)}" placeholder="Prep, clues, secrets…">${RT.esc(S.notes[key] || '')}</textarea>`;
  const npcHtml = n => `<div class="npc"><b>${RT.esc(n[0])}</b><em>${RT.esc(n[1])}</em><p>${RT.esc(n[2])}</p></div>`;
  const chip = (c, t) => `<span class="chip" style="${c ? 'border-color:#0ac8b9;color:#0ac8b9' : ''}">${t}</span>`;
  const eraBox = () => `<div class="hook" style="border-color:#0ac8b9"><b>${RT.esc(eraName())}</b> — ${RT.esc(D.eras[S.era].blurb)}</div>`;

  function renderPanel() {
    const s = S.sel; let h = '';
    if (s && s.kind === 'lore') h = lorePanel();
    else if (S.mode === 'city') h = !s ? cityOverview() : s.kind === 'landmark' ? landmarkPanel(s.id) : s.kind === 'district' ? districtPanel(s.id) : s.kind === 'pin' ? pinPanel() : cityOverview();
    else h = !s ? battleOverview() : s.kind === 'cell' ? cellPanel(s.id) : s.kind === 'pin' ? pinPanel() : battleOverview();
    panel.innerHTML = h; panel.scrollTop = 0;
  }
  function cityOverview() {
    const c = city();
    return `<div class="tag">${RT.esc(c.tag)}</div><h2>${RT.esc(c.name)}</h2>${eraBox()}<p class="lore">${RT.esc(c.summary)}</p>
      <h4>Key locations</h4><div class="list">${list(c.landmarks, (l, i) => `<a data-act="selLm" data-id="${l.id}">${i + 1}. ${RT.esc(l.n)}<small>${l.c ? 'canon' : 'invented'}</small></a>`)}</div>
      <h4>Districts</h4><div class="list">${list(c.districts, d => `<a data-act="selDist" data-id="${d.id}">${RT.esc(d.n)}<small>${d.style}</small></a>`)}</div>
      <h4>Street encounters</h4>${encTable(D.street[S.era], 'street:' + S.era)}
      <h4>Rumors <button class="btn" data-act="rumor">+ Random</button></h4><div id="rumors">${list(D.rumors[S.era].slice(0, 2), t => `<div class="hook">${RT.esc(t)}</div>`)}</div>
      ${notesBox('city:' + c.id)}`;
  }
  function landmarkPanel(id) {
    const c = city(), l = c.landmarks.find(x => x.id === id); if (!l) return cityOverview();
    const t = S.era === 'turmoil' && l.t ? l.t : {}, d = t.d || l.d, hook = t.h || l.h, i = c.landmarks.indexOf(l);
    return `<div class="tag">${RT.esc(c.short)} · key location ${i + 1}</div><h2>${RT.esc(l.n)}</h2><div class="chips">${chip(l.c, l.c ? 'Canon location' : 'Invented for the table')}${l.t ? chip(0, S.era === 'turmoil' ? 'Turmoil version' : 'Changes in the Turmoil') : ''}</div>
      <p class="lore">${RT.esc(d)}</p><h4>Who’s here</h4>${npcHtml([l.npc[0], l.npc[1], l.npc[2]])}<h4>Hook</h4><div class="hook">${RT.esc(hook)}</div>
      <h4>Encounters nearby</h4>${encTable(D.street[S.era], 'street:' + S.era)}<div class="actions"><button class="btn" data-act="backCity">← Back to overview</button></div>${notesBox('lm:' + c.id + ':' + l.id)}`;
  }
  const STYLE = { royal: 'Royal precinct — guarded; refined', noble: 'Noble houses — large, walled, quiet', common: 'Common homes and workshops', slum: 'Crowded, poor — alleys and shortcuts', military: 'Barracks, drill yards and watchposts', religious: 'Temples and shrines', market: 'Stalls and guild halls — busy, loud', harbor: 'Docks, warehouses and fish-smoke' };
  const ROLE = { royal: ['Steward', 'Page', 'Herald', 'Tutor'], noble: ['Servant', 'Steward', 'Duelist', 'Tutor'], common: ['Baker', 'Smith', 'Weaver', 'Mason'], slum: ['Laundress', 'Day laborer', 'Beggar', 'Fence'], military: ['Sergeant', 'Recruit', 'Raptor rider', 'Quartermaster'], religious: ['Priest', 'Pilgrim', 'Gravedigger', 'Scribe'], market: ['Merchant', 'Guild clerk', 'Pickpocket', 'Street cook'], harbor: ['Dockhand', 'Harbor clerk', 'Sailor', 'Net-mender'] };
  function districtPanel(id) {
    const c = city(), d = c.districts.find(x => x.id === id); if (!d) return cityOverview();
    const rr = RT.rng(S.seed + id + Math.random()), npc = [RT.genName(rr, 'dem', 'person'), RT.pick(rr, ROLE[d.style]), RT.pick(rr, ['Knows who left the district last night.', 'Is owed a favor by someone powerful.', 'Is quietly selling information.', 'Wants the party to carry a message — unread.', 'Is not who they claim to be.', 'Is afraid of the Mageseekers — or of what they’ve hidden.'])];
    const near = c.landmarks.filter(l => { let best = null, bd = 9; c.districts.forEach(x => { const q = (x.x - l.x) ** 2 + (x.y - l.y) ** 2; if (q < bd) { bd = q; best = x; } }); return best === d; });
    return `<div class="tag">${RT.esc(c.short)} · district</div><h2>${RT.esc(d.n)}</h2><div class="chips">${chip(0, RT.esc(STYLE[d.style]))}</div><p class="lore">${RT.esc(d.d)}</p>
      ${near.length ? `<h4>Landmarks here</h4><div class="list">${list(near, l => `<a data-act="selLm" data-id="${l.id}">${RT.esc(l.n)}<small>${l.c ? 'canon' : 'invented'}</small></a>`)}</div>` : ''}
      <h4>Passer-by</h4>${npcHtml(npc)}<h4>Street encounters</h4>${encTable(D.street[S.era], 'street:' + S.era)}<div class="actions"><button class="btn" data-act="backCity">← Back to overview</button></div>${notesBox('dist:' + c.id + ':' + d.id)}`;
  }
  function lorePanel() {
    return `<div class="tag">${RT.esc(D.tag)}</div><h2>Demacia</h2>${eraBox()}<p class="lore">${RT.esc(D.summary)}</p>
      <h4>Noble houses</h4>${list(D.houses, h => `<div class="npc"><b>${RT.esc(h[0])}</b><p>${RT.esc(h[1])}</p></div>`)}
      <h4>Orders</h4>${list(D.orders, h => `<div class="npc"><b>${RT.esc(h[0])}</b><p>${RT.esc(h[1])}</p></div>`)}
      <h4>Sources</h4><div class="list">${list(D.sources, s => `<a href="${s[1]}" target="_blank" rel="noopener">${RT.esc(s[0])}<small>wiki ↗</small></a>`)}</div>
      <p class="empty">Locations marked “invented” are table-ready additions; “canon” ones come from the wiki. Lore is paraphrased; Demacia and the League of Legends universe belong to Riot Games.</p><div class="actions"><button class="btn" data-act="backCity">← Back</button></div>`;
  }
  function battleOverview() {
    const b = battle();
    return `<div class="tag">${RT.esc(b.tag)}</div><h2>${RT.esc(b.name)}</h2>${eraBox()}<p class="lore">${RT.esc(b.desc)} Each square is 5 ft. Click a square for its rules.</p>
      <h4>Objectives</h4>${list(b.obj, o => `<div class="hook">${RT.esc(o)}</div>`)}<h4>Enemies &amp; encounters</h4>${encTable(b.enc, 'enc:' + b.id)}<h4>Complications</h4>${encTable(b.twist, 'twist:' + b.id)}${notesBox('battle:' + b.id)}`;
  }
  function cellPanel(id) {
    const [x, y] = id.split(',').map(Number), t = RT.battleGrid(S.scenario, S.seed)[y][x], inf = RT.tileInfo(t);
    return `<div class="tag">Square ${x + 1} · ${y + 1}</div><h2>${RT.esc(inf.name)}</h2><p class="lore">${RT.esc(inf.rule)}</p><div class="actions"><button class="btn" data-act="backBattle">← Scenario</button></div>${notesBox('cell:' + S.scenario + ':' + S.seed + ':' + id)}`;
  }
  function pinPanel() {
    const p = S.pins.find(q => q.id === S.sel.id); if (!p) return S.mode === 'city' ? cityOverview() : battleOverview(); const t = PIN_TYPES[pinKind()];
    return `<div class="tag">Pin</div><h2>${RT.esc(p.label || 'Untitled pin')}</h2><label class="fld">Label<input type="text" data-pin="label" value="${RT.esc(p.label || '')}"></label>
      <label class="fld">Type<select data-pin="type">${Object.keys(t).map(k => `<option value="${k}" ${k === p.type ? 'selected' : ''}>${t[k][0]}</option>`).join('')}</select></label>
      <label class="fld">Notes<textarea data-pin="note" placeholder="Stat block, motive, secrets…">${RT.esc(p.note || '')}</textarea></label><div class="actions"><button class="btn" data-act="delPin" data-id="${p.id}">Delete pin</button></div>`;
  }
  panel.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return; const act = a.dataset.act, id = a.dataset.id;
    if (act === 'roll') { const box = a.parentElement.previousElementSibling, n = +a.dataset.n, v = dice(n); box.querySelectorAll('li').forEach(li => li.classList.remove('hit')); const li = box.querySelector(`li[data-i="${v - 1}"]`); if (li) li.classList.add('hit'); a.nextElementSibling.textContent = `d${n} → ${v}`; }
    else if (act === 'selLm') { S.sel = { kind: 'landmark', id }; draw(); }
    else if (act === 'selDist') { S.sel = { kind: 'district', id }; draw(); }
    else if (act === 'backCity') { S.sel = null; draw(); } else if (act === 'backBattle') { S.sel = null; draw(); }
    else if (act === 'rumor') { $('rumors').insertAdjacentHTML('beforeend', `<div class="hook">${RT.esc(RT.pick(Math.random, D.rumors[S.era]))}</div>`); }
    else if (act === 'delPin') { S.pins = S.pins.filter(p => p.id !== id); S.sel = null; save(); draw(); }
  });
  panel.addEventListener('input', e => {
    const t = e.target; if (t.dataset.note) { S.notes[t.dataset.note] = t.value; save(); }
    else if (t.dataset.pin) { const p = S.pins.find(p => p.id === S.sel.id); p[t.dataset.pin] = t.value; save(); drawPins(); if (t.dataset.pin === 'label') panel.querySelector('h2').textContent = t.value || 'Untitled pin'; }
  });

  // ---------- map interaction ----------
  const svgPt = (cx, cy) => { const p = new DOMPoint(cx, cy).matrixTransform(svg.getScreenCTM().inverse()); return [p.x, p.y]; };
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
      let [x, y] = svgPt(e.clientX, e.clientY);
      if (S.mode === 'battle') { const cx = Math.floor((x - B.ox) / B.cell), cy = Math.floor((y - B.oy) / B.cell); if (cx < 0 || cy < 0 || cx >= B.cols || cy >= B.rows) return; x = B.ox + cx * B.cell + B.cell / 2; y = B.oy + cy * B.cell + B.cell / 2; }
      const n = S.pins.filter(p => p.scope === scope() && p.type === S.pinType).length + 1;
      const p = { id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 99), scope: scope(), x, y, type: S.pinType, label: S.mode === 'battle' ? (S.pinType === 'hero' ? 'H' : S.pinType === 'foe' ? 'F' : 'M') + n : '', note: '' };
      S.pins.push(p); S.sel = { kind: 'pin', id: p.id }; save(); draw(); return;
    }
    if (!el) { S.sel = null; draw(); return; }
    S.sel = { kind: k, id: el.dataset.id }; draw();
  }
  function zoomBy(f, cx, cy) {
    const v = S.view, [px, py] = cx == null ? [v.x + v.w / 2, v.y + v.h / 2] : svgPt(cx, cy), w = RT.clamp(v.w * f, 160, RT.W), k = w / v.w;
    S.view = { x: px - (px - v.x) * k, y: py - (py - v.y) * k, w, h: v.h * k };
    if (w >= RT.W - 1) S.view = { x: 0, y: 0, w: RT.W, h: RT.H }; applyView();
  }
  svg.addEventListener('wheel', e => { e.preventDefault(); zoomBy(e.deltaY > 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
  $('zIn').onclick = () => zoomBy(1 / 1.3); $('zOut').onclick = () => zoomBy(1.3); $('zReset').onclick = () => { S.view = { x: 0, y: 0, w: RT.W, h: RT.H }; applyView(); };

  // ---------- controls ----------
  function init() {
    load();
    $('seed').value = S.seed; $('themeSel').value = S.theme;
    $('citySel').innerHTML = CITIES.map(c => `<option value="${c.id}">${RT.esc(c.name)}</option>`).join(''); $('citySel').value = S.cityId;
    $('scenarioSel').innerHTML = BATTLES.map(b => `<option value="${b.id}">${RT.esc(b.name)}</option>`).join(''); $('scenarioSel').value = S.scenario;
    $('eraSel').innerHTML = Object.keys(D.eras).map(k => `<option value="${k}">${RT.esc(D.eras[k].name)}</option>`).join(''); $('eraSel').value = S.era;
    const map = { tLabels: 'labels', tNumbers: 'numbers', tGrid: 'grid', tDeco: 'deco' };
    Object.keys(map).forEach(id => { $(id).checked = !!S.opts[map[id]]; $(id).onchange = () => { S.opts[map[id]] = $(id).checked ? 1 : 0; save(); draw(); }; });
    $('seed').onchange = () => { S.seed = $('seed').value.trim() || 'lightshield'; save(); draw(); };
    $('rollSeed').onclick = () => { S.seed = Math.random().toString(36).slice(2, 8); $('seed').value = S.seed; S.sel = null; save(); draw(); toast('Seed ' + S.seed); };
    $('themeSel').onchange = () => { S.theme = $('themeSel').value; save(); draw(); };
    $('eraSel').onchange = () => { S.era = $('eraSel').value; save(); draw(); };
    $('citySel').onchange = () => { S.cityId = $('citySel').value; S.sel = null; S.view = { x: 0, y: 0, w: RT.W, h: RT.H }; draw(); };
    $('scenarioSel').onchange = () => { S.scenario = $('scenarioSel').value; S.sel = null; draw(); };
    $('loreBtn').onclick = () => { S.sel = { kind: 'lore' }; renderPanel(); };
    $('pinType').onchange = () => { S.pinType = $('pinType').value; };
    $('pinMode').onclick = () => { S.pinMode = !S.pinMode; $('pinMode').classList.toggle('on', S.pinMode); svg.classList.toggle('pinning', S.pinMode); toast(S.pinMode ? 'Click the map to place a pin' : 'Pin placement off'); };
    document.querySelectorAll('#scaleTabs button').forEach(b => b.onclick = () => setMode(b.dataset.scale));
    document.addEventListener('keydown', e => {
      if (/TEXTAREA|SELECT/.test(e.target.tagName) || (e.target.tagName === 'INPUT' && e.target.type === 'text')) return;
      if (e.key === '1') setMode('city'); if (e.key === '2') setMode('battle');
      if (e.key === 'Escape') { S.sel = null; draw(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && S.sel && S.sel.kind === 'pin') { S.pins = S.pins.filter(p => p.id !== S.sel.id); S.sel = null; save(); draw(); }
    });
    $('exSvg').onclick = () => download(new Blob([serialize(false)], { type: 'image/svg+xml' }), name('svg'));
    $('exPng').onclick = () => exportPng(false); $('exVtt').onclick = () => exportPng(true);
    $('saveJson').onclick = () => download(new Blob([JSON.stringify({ app: 'runeterra-atlas', pins: S.pins, notes: S.notes, seed: S.seed, theme: S.theme, era: S.era }, null, 2)], { type: 'application/json' }), 'demacia-campaign.json');
    $('loadJson').onclick = () => $('fileIn').click();
    $('fileIn').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const d = JSON.parse(t); S.pins = d.pins || []; S.notes = d.notes || {}; if (d.seed) { S.seed = d.seed; $('seed').value = d.seed; } save(); draw(); toast('Campaign loaded'); } catch (er) { toast('Invalid file'); } }); e.target.value = ''; };
    $('resetAll').onclick = () => { if (confirm('Delete all pins and notes?')) { S.pins = []; S.notes = {}; S.sel = null; save(); draw(); } };
    setMode('city');
  }

  // ---------- export ----------
  const name = ext => `demacia-${S.mode === 'city' ? S.cityId : S.scenario}-${S.seed}.${ext}`;
  function download(blob, fn) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  function exportBox(clean) { if (clean && S.mode === 'battle') return { x: B.ox, y: B.oy, w: B.cols * B.cell, h: B.rows * B.cell, px: B.cols * 70, py: B.rows * 70 }; return { ...S.view, px: 3200, py: Math.round(3200 * S.view.h / S.view.w) }; }
  function serialize(clean) {
    const c = svg.cloneNode(true), bx = exportBox(clean);
    c.setAttribute('viewBox', `${bx.x} ${bx.y} ${bx.w} ${bx.h}`); c.setAttribute('width', bx.px); c.setAttribute('height', bx.py); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.removeAttribute('class'); c.removeAttribute('style');
    if (clean) ['pins', 'deco', 'grid'].forEach(id => { const n = c.querySelector('#' + id); if (n) n.remove(); });
    c.querySelectorAll('.sel').forEach(n => n.classList.remove('sel'));
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(c);
  }
  function exportPng(clean) {
    const bx = exportBox(clean), url = URL.createObjectURL(new Blob([serialize(clean)], { type: 'image/svg+xml;charset=utf-8' })), img = new Image();
    img.onload = () => { const cv = document.createElement('canvas'); cv.width = bx.px; cv.height = bx.py; cv.getContext('2d').drawImage(img, 0, 0, bx.px, bx.py); cv.toBlob(b => { download(b, name('png')); URL.revokeObjectURL(url); toast(clean && S.mode === 'battle' ? 'Exported at 70 px / square' : 'PNG exported'); }, 'image/png'); };
    img.onerror = () => toast('PNG export failed'); img.src = url;
  }
  RT.app = { S, draw, setMode };
  document.addEventListener('DOMContentLoaded', init);
})(window.RT);
