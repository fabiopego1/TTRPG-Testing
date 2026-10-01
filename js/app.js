/* Runeterra Atlas — UI. Gridless maps authored in feet (1 unit = 1 ft); tokens are drawn to real size. */
(function (RT) {
  const $ = id => document.getElementById(id), svg = $('map'), panel = $('panel'), D = RT.DEMACIA, SIZES = RT.CREATURES;
  const STORE = 'runeterra-atlas-demacia-v3';
  const S = { level: 'city', maps: { city: 'silvermere', site: 'crownguard' }, theme: 'day', era: 'peace', opts: { labels: 1, numbers: 1, deco: 1 }, sel: null, view: null, tool: null, tokType: 'hero', tokSize: 5, px: { city: 15, site: 70 }, items: [], notes: {}, measure: null };
  const TYPES = { hero: ['Hero', '#3b8fe0'], foe: ['Foe', '#e84057'], npc: ['NPC', '#3fb27f'], mount: ['Mount / beast', '#c8aa6e'] };
  const map = () => RT.MAPS[S.maps[S.level]], eraName = () => D.eras[S.era].name;
  const tokens = () => S.items.filter(i => i.map === map().id && i.kind === 'token'), pins = () => S.items.filter(i => i.map === map().id && i.kind === 'pin');

  function save() { try { localStorage.setItem(STORE, JSON.stringify({ items: S.items, notes: S.notes, theme: S.theme, era: S.era, opts: S.opts, px: S.px })); } catch (e) { } }
  function load() { try { const d = JSON.parse(localStorage.getItem(STORE) || 'null'); if (d) { S.items = d.items || []; S.notes = d.notes || {}; S.theme = d.theme || S.theme; S.era = d.era || S.era; Object.assign(S.px, d.px || {}); Object.assign(S.opts, d.opts || {}); } } catch (e) { } }
  const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 1900); };
  const niceFt = max => { let b = 5; for (const f of [5, 10, 20, 50, 100, 200, 500, 1000]) if (f <= max) b = f; return b; };

  // ---------- drawing ----------
  function drawArt() {
    const M = map(); svg.innerHTML = `<g id="art">${RT.renderScene(M, { night: S.theme === 'night' })}</g><g id="ov"></g>`;
    S.view = S.view && S.view.map === M.id ? S.view : fullView(M); applyView();
  }
  const fullView = M => ({ map: M.id, x: -M.w * .02, y: -M.h * .02, w: M.w * 1.04, h: M.h * 1.04 });
  function kNow() { const bb = svg.getBoundingClientRect(), v = S.view; return 1 / Math.max(.0001, Math.min(bb.width / v.w, bb.height / v.h)); }
  function applyView() { const v = S.view; svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`); renderOverlay(); updateCrumb(); updateExportInfo(); }
  function tokenSvg(t, k) {
    const ty = TYPES[t.type] || TYPES.hero, r = t.size / 2 * .94, sel = S.sel && S.sel.kind === 'token' && S.sel.id === t.id, sw = Math.max(.25, t.size * .05);
    return `<g class="token" data-kind="token" data-id="${t.id}"><circle cx="${t.x + t.size * .06}" cy="${t.y + t.size * .08}" r="${r}" fill="#000" opacity=".3"/><circle cx="${t.x}" cy="${t.y}" r="${r}" fill="${ty[1]}" stroke="#fff" stroke-width="${sw}"/><circle cx="${t.x}" cy="${t.y}" r="${r * .72}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${sw * .5}"/>${sel ? `<circle cx="${t.x}" cy="${t.y}" r="${r + t.size * .1}" fill="none" stroke="#fff" stroke-width="${sw * .8}" stroke-dasharray="${t.size * .12} ${t.size * .1}"/>` : ''}<text x="${t.x}" y="${t.y + t.size * .15}" text-anchor="middle" font-size="${t.size * (t.size < 4 ? .55 : .42)}" font-weight="700" fill="#fff" font-family="Cinzel,Georgia,serif" pointer-events="none">${RT.esc((t.label || '').slice(0, 2).toUpperCase())}</text></g>`;
  }
  // overlay = everything that is not map art. k = feet per screen pixel (labels/markers keep a constant on-screen size)
  function overlayHTML(k, forExport) {
    const M = map(), night = S.theme === 'night', ink = night ? '#e8f0f8' : '#2a1d10', halo = night ? '#06122c' : '#f6edd2'; let s = '';
    const txt = (x, y, t, fs, extra) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs}" fill="${ink}" stroke="${halo}" stroke-width="${fs * .3}" paint-order="stroke" font-family="Cinzel,Georgia,serif" ${extra || ''}>${RT.esc(t)}</text>`;
    // clickable feature hit areas
    M.features.forEach(f => { const sel = S.sel && S.sel.kind === 'feature' && S.sel.id === f.id ? ' sel' : ''; s += f.rect ? `<rect class="hit${sel}" fill="transparent" data-kind="feature" data-id="${f.id}" x="${f.rect[0]}" y="${f.rect[1]}" width="${f.rect[2] - f.rect[0]}" height="${f.rect[3] - f.rect[1]}"/>` : `<circle class="hit${sel}" fill="transparent" data-kind="feature" data-id="${f.id}" cx="${f.x}" cy="${f.y}" r="${f.r || 30}"/>`; });
    if (S.opts.labels) {
      (M.districts || []).forEach(d => { s += txt(d.x, d.y, d.n.toUpperCase(), 12 * k, `font-style="italic" letter-spacing="${2 * k}" opacity=".78" data-kind="district" data-id="${d.id}" style="cursor:pointer"`); });
      (M.labels || []).forEach(l => { s += txt(l.x, l.y, l.t, (l.size || 11) * k, `font-style="italic" opacity=".85" pointer-events="none"${l.rot ? ` transform="rotate(${l.rot} ${l.x} ${l.y})"` : ''}`); });
      M.features.forEach(f => {
        if (f.nolabel) return;
        if (f.rect && M.level === 'site') { const wid = f.rect[2] - f.rect[0], hei = f.rect[3] - f.rect[1], fs = Math.min(8.5 * k, wid / (f.n.length * .66)), cx = (f.rect[0] + f.rect[2]) / 2, cy = hei > 60 ? (f.rect[1] + f.rect[3]) / 2 : f.rect[1] + 4.2; s += txt(cx, f.ly != null ? f.ly : cy, f.n.toUpperCase(), fs, 'opacity=".7" pointer-events="none"'); }
        else if (!f.rect) s += txt(f.x, f.y + (f.ly || 22), f.n.replace(/ — .*/, ''), 10.5 * k, 'pointer-events="none" opacity=".92"');
      });
    }
    if (S.opts.numbers) M.features.forEach((f, i) => { const x = f.mx != null ? f.mx : (f.rect ? (f.rect[0] + f.rect[2]) / 2 : f.x), y = f.my != null ? f.my : (f.rect ? (f.rect[1] + f.rect[3]) / 2 : f.y), r = 9 * k, sel = S.sel && S.sel.kind === 'feature' && S.sel.id === f.id; s += `<g class="mk" data-kind="feature" data-id="${f.id}"><circle cx="${x}" cy="${y}" r="${r}" fill="${night ? '#06122c' : '#f6edd2'}" stroke="${sel ? '#0ac8b9' : '#c8aa6e'}" stroke-width="${(sel ? 2.4 : 1.8) * k}"/><text x="${x}" y="${y + 3.6 * k}" text-anchor="middle" font-size="${10 * k}" font-weight="700" font-family="Cinzel,Georgia,serif" fill="${ink}" pointer-events="none">${i + 1}</text></g>`; });
    // tokens (real size) and note markers (constant screen size)
    s += tokens().map(t => tokenSvg(t, k)).join('');
    s += pins().map(p => { const r = 9 * k, sel = S.sel && S.sel.kind === 'pin' && S.sel.id === p.id; return `<g class="mk" data-kind="pin" data-id="${p.id}"><path d="M${p.x} ${p.y}c${-r * .2} ${-r * .9} ${-r} ${-r * 1.2} ${-r} ${-r * 2.1}a${r} ${r} 0 1 1 ${r * 2} 0c0 ${r * .9} ${-r * .8} ${r * 1.2} ${-r} ${r * 2.1}Z" fill="#c8aa6e" stroke="${sel ? '#fff' : '#010a13'}" stroke-width="${(sel ? 2 : 1.4) * k}"/><circle cx="${p.x}" cy="${p.y - r * 2.1}" r="${r * .38}" fill="#fff"/>${p.label ? `<text x="${p.x + r * 1.3}" y="${p.y - r * 1.8}" font-size="${11 * k}" fill="#fff" stroke="#010a13" stroke-width="${3 * k}" paint-order="stroke" font-family="Cinzel,Georgia,serif" pointer-events="none">${RT.esc(p.label)}</text>` : ''}</g>`; }).join('');
    if (S.measure && S.measure.a) { const a = S.measure.a, b = S.measure.b || a, ft = Math.hypot(b[0] - a[0], b[1] - a[1]); s += `<g pointer-events="none"><path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" stroke="#fff" stroke-width="${3.4 * k}" stroke-linecap="round" opacity=".9"/><path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" stroke="#e84057" stroke-width="${1.8 * k}" stroke-dasharray="${5 * k} ${4 * k}" stroke-linecap="round"/><circle cx="${a[0]}" cy="${a[1]}" r="${3 * k}" fill="#e84057" stroke="#fff" stroke-width="${k}"/><circle cx="${b[0]}" cy="${b[1]}" r="${3 * k}" fill="#e84057" stroke="#fff" stroke-width="${k}"/>${txt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 7 * k, Math.round(ft) + ' ft', 13 * k, 'font-weight="700"')}</g>`; }
    if (S.opts.deco) {
      const gold = night ? '#c8aa6e' : '#8a6a2b', pad = 3 * k;
      s += `<g pointer-events="none"><rect x="${-pad * 2}" y="${-pad * 2}" width="${M.w + pad * 4}" height="${M.h + pad * 4}" fill="none" stroke="${gold}" stroke-width="${2.4 * k}"/><rect x="${-pad * 3.2}" y="${-pad * 3.2}" width="${M.w + pad * 6.4}" height="${M.h + pad * 6.4}" fill="none" stroke="${gold}" stroke-width="${k}"/></g>`;
      const v = S.view, bar = niceFt(140 * k), bx = v.x + 24 * k, by = v.y + v.h - 26 * k; if (!forExport) { /* sits in view corner */ } else { }
      s += `<g pointer-events="none" font-family="Cinzel,Georgia,serif"><rect x="${bx - 10 * k}" y="${by - 24 * k}" width="${bar + 56 * k}" height="${40 * k}" rx="${4 * k}" fill="${night ? '#06122c' : '#f6edd2'}" opacity=".78"/><path d="M${bx} ${by}H${bx + bar}M${bx} ${by - 5 * k}V${by + 5 * k}M${bx + bar / 2} ${by - 3 * k}V${by + 3 * k}M${bx + bar} ${by - 5 * k}V${by + 5 * k}" stroke="${ink}" stroke-width="${2 * k}"/><text x="${bx}" y="${by - 9 * k}" font-size="${10 * k}" fill="${ink}">0</text><text x="${bx + bar + 6 * k}" y="${by + 4 * k}" font-size="${11 * k}" fill="${ink}">${bar} ft</text></g>`;
      const cx = v.x + v.w - 42 * k, cy = v.y + 46 * k, cr = 24 * k; s += `<g pointer-events="none" font-family="Cinzel,Georgia,serif"><circle cx="${cx}" cy="${cy}" r="${cr}" fill="${night ? '#06122c' : '#f6edd2'}" opacity=".78" stroke="${gold}" stroke-width="${1.4 * k}"/><path d="M${cx} ${cy - cr * .95}L${cx + cr * .22} ${cy}L${cx} ${cy + cr * .95}L${cx - cr * .22} ${cy}Z" fill="${gold}"/><path d="M${cx - cr * .95} ${cy}L${cx} ${cy - cr * .22}L${cx + cr * .95} ${cy}L${cx} ${cy + cr * .22}Z" fill="${gold}" opacity=".55"/><text x="${cx}" y="${cy - cr - 4 * k}" text-anchor="middle" font-size="${11 * k}" font-weight="700" fill="${ink}">N</text></g>`;
    }
    return s;
  }
  function renderOverlay() { const ov = $('ov'); if (ov) ov.innerHTML = overlayHTML(kNow(), false); }
  function updateCrumb() { const M = map(); $('crumb').textContent = `DEMACIA › ${M.name.toUpperCase()} · ${M.w} × ${M.h} FT`; }

  // ---------- export ----------
  function pxPerFt() { return S.px[S.level] / 5; }
  function exportDims() { const M = map(); let k = pxPerFt(), w = Math.round(M.w * k), h = Math.round(M.h * k); const mx = Math.max(w, h); if (mx > 16000) { const f = 16000 / mx; k *= f; w = Math.round(M.w * k); h = Math.round(M.h * k); } return { k, w, h }; }
  function updateExportInfo() { const e = exportDims(), per5 = e.k * 5; $('exInfo').textContent = `${e.w} × ${e.h} px · 5 ft = ${Math.round(per5 * 10) / 10} px (a 5-ft token is ${Math.round(per5)} px)`; }
  function fillPx() { const opts = S.level === 'city' ? [[10, '10 px per 5 ft — 4,000 px wide'], [15, '15 px per 5 ft — 6,000 px'], [20, '20 px per 5 ft — 8,000 px'], [30, '30 px per 5 ft — 12,000 px']] : [[50, '50 px per 5 ft'], [70, '70 px per 5 ft — Roll20 default'], [100, '100 px per 5 ft — Foundry default'], [140, '140 px per 5 ft — hi-res']]; $('pxSel').innerHTML = opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join(''); if (!opts.some(o => o[0] === S.px[S.level])) S.px[S.level] = opts[1][0]; $('pxSel').value = S.px[S.level]; }
  function serialize(clean) {
    const M = map(), e = exportDims(), c = svg.cloneNode(true); c.setAttribute('viewBox', `0 0 ${M.w} ${M.h}`); c.setAttribute('width', e.w); c.setAttribute('height', e.h); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.removeAttribute('class'); c.removeAttribute('style');
    const ov = c.querySelector('#ov'); if (ov) { if (clean) ov.remove(); else { const keep = S.sel, kv = S.view; S.sel = null; S.view = { x: 0, y: 0, w: M.w, h: M.h }; ov.innerHTML = overlayHTML(1 / e.k * 1.15, true); S.sel = keep; S.view = kv; } }
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(c);
  }
  function download(blob, fn) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  const fname = ext => `demacia-${map().id}.${ext}`;
  function exportPng(clean) {
    const e = exportDims(), url = URL.createObjectURL(new Blob([serialize(clean)], { type: 'image/svg+xml;charset=utf-8' })), img = new Image(); toast('Rendering PNG…');
    img.onload = () => { const cv = document.createElement('canvas'); cv.width = e.w; cv.height = e.h; cv.getContext('2d').drawImage(img, 0, 0, e.w, e.h); cv.toBlob(b => { download(b, fname('png')); URL.revokeObjectURL(url); toast(`Exported · 5 ft = ${Math.round(e.k * 5)} px`); }, 'image/png'); };
    img.onerror = () => toast('PNG export failed — try a lower resolution'); img.src = url;
  }

  // ---------- panel ----------
  const list = (a, fn) => a.map(fn).join('');
  const notesBox = key => `<h4>Session notes</h4><textarea data-note="${RT.esc(key)}" placeholder="Prep, clues, secrets…">${RT.esc(S.notes[key] || '')}</textarea>`;
  const npcHtml = n => `<div class="npc"><b>${RT.esc(n[0])}</b><em>${RT.esc(n[1])}</em><p>${RT.esc(n[2])}</p></div>`;
  const chip = (c, t) => `<span class="chip" style="${c ? 'border-color:#0ac8b9;color:#0ac8b9' : ''}">${t}</span>`;
  const eraBox = () => `<div class="hook" style="border-color:#0ac8b9"><b>${RT.esc(eraName())}</b> — ${RT.esc(D.eras[S.era].blurb)}</div>`;
  const dimsOf = f => f.rect ? `${Math.round(f.rect[2] - f.rect[0])} × ${Math.round(f.rect[3] - f.rect[1])} ft` : null;
  function renderPanel() {
    const s = S.sel; let h = '';
    if (s && s.kind === 'lore') h = lorePanel(); else if (s && s.kind === 'scale') h = scalePanel();
    else if (s && s.kind === 'feature') h = featurePanel(s.id); else if (s && s.kind === 'district') h = districtPanel(s.id); else if (s && s.kind === 'token') h = tokenPanel(); else if (s && s.kind === 'pin') h = pinPanel();
    else h = overview();
    panel.innerHTML = h; panel.scrollTop = 0;
  }
  function overview() {
    const M = map(), linkOut = M.parent ? `<div class="actions"><button class="btn gold" data-act="openMap" data-id="${M.parent}">← ${RT.esc(RT.MAPS[M.parent].name)}</button></div>` : '';
    return `<div class="tag">${RT.esc(M.tag)}</div><h2>${RT.esc(M.name)}</h2>${eraBox()}${linkOut}<p class="lore">${RT.esc(M.summary)}</p>
      <div class="chips">${chip(0, M.w + ' × ' + M.h + ' ft')}${chip(0, 'no grid · drawn to scale')}</div>
      ${M.dims ? `<h4>Dimensions</h4>${list(M.dims, t => `<div class="hook">${RT.esc(t)}</div>`)}` : ''}
      <h4>${M.level === 'city' ? 'Key locations' : 'Rooms & areas'}</h4><div class="list">${list(M.features, (f, i) => `<a data-act="selF" data-id="${f.id}">${i + 1}. ${RT.esc(f.n)}<small>${f.c ? 'canon' : 'invented'}</small></a>`)}</div>
      ${M.districts ? `<h4>Districts</h4><div class="list">${list(M.districts, d => `<a data-act="selD" data-id="${d.id}">${RT.esc(d.n)}<small>${d.style}</small></a>`)}</div>` : ''}
      <h4>Rumors</h4>${list(D.rumors[S.era], t => `<div class="hook">${RT.esc(t)}</div>`)}${notesBox('map:' + M.id)}`;
  }
  function featurePanel(id) {
    const M = map(), f = M.features.find(x => x.id === id); if (!f) return overview();
    const t = S.era === 'turmoil' && f.t ? f.t : {}, d = t.d || f.d, hook = t.h || f.h, dm = dimsOf(f), open = f.opens ? RT.MAPS[f.opens] : null;
    return `<div class="tag">${RT.esc(M.name)}${dm ? ' · ' + dm : ''}</div><h2>${RT.esc(f.n)}</h2><div class="chips">${chip(f.c, f.c ? 'Canon' : 'Invented for the table')}${f.t ? chip(0, S.era === 'turmoil' ? 'Turmoil version' : 'Changes in the Turmoil') : ''}</div>
      ${open ? `<div class="actions"><button class="btn gold" data-act="openMap" data-id="${open.id}">Open ${RT.esc(open.name)} map →</button></div>` : ''}
      <p class="lore">${RT.esc(d)}</p>${f.npc ? `<h4>Who’s here</h4>${npcHtml(f.npc)}` : ''}${hook ? `<h4>Hook</h4><div class="hook">${RT.esc(hook)}</div>` : ''}
      ${f.notes ? `<h4>At the table</h4>${list(f.notes, n => `<div class="hook">${RT.esc(n)}</div>`)}` : ''}<div class="actions"><button class="btn" data-act="back">← Overview</button></div>${notesBox('f:' + M.id + ':' + f.id)}`;
  }
  const STYLE = { royal: 'Royal precinct', noble: 'Noble houses — large, walled, quiet', common: 'Common homes and workshops', slum: 'Crowded, poor — alleys and shortcuts', military: 'Barracks, stables and watchposts', religious: 'Temples and shrines', market: 'Stalls and guild halls', harbor: 'Docks and warehouses' };
  function districtPanel(id) { const M = map(), d = (M.districts || []).find(x => x.id === id); if (!d) return overview(); return `<div class="tag">${RT.esc(M.name)} · district</div><h2>${RT.esc(d.n)}</h2><div class="chips">${chip(0, RT.esc(STYLE[d.style] || d.style))}</div><p class="lore">${RT.esc(d.d)}</p><div class="actions"><button class="btn" data-act="back">← Overview</button></div>${notesBox('d:' + M.id + ':' + d.id)}`; }
  function lorePanel() { return `<div class="tag">${RT.esc(D.tag)}</div><h2>Demacia</h2>${eraBox()}<p class="lore">${RT.esc(D.summary)}</p><h4>Noble houses</h4>${list(D.houses, h => `<div class="npc"><b>${RT.esc(h[0])}</b><p>${RT.esc(h[1])}</p></div>`)}<h4>Orders</h4>${list(D.orders, h => `<div class="npc"><b>${RT.esc(h[0])}</b><p>${RT.esc(h[1])}</p></div>`)}<h4>Sources</h4><div class="list">${list(D.sources, s => `<a href="${s[1]}" target="_blank" rel="noopener">${RT.esc(s[0])}<small>wiki ↗</small></a>`)}</div><p class="empty">Locations marked “invented” are table-ready additions; “canon” ones come from the wiki. Lore is paraphrased; Demacia and League of Legends belong to Riot Games.</p><div class="actions"><button class="btn" data-act="back">← Back</button></div>`; }
  function scalePanel() {
    const e = exportDims(), per5 = e.k * 5, u = 6, x0 = 6; let y = 4, rows = '';
    SIZES.forEach(s => { const d = s[1] * u, cx = x0 + d / 2, cy = y + d / 2; rows += `<circle cx="${cx}" cy="${cy}" r="${d / 2 * .94}" fill="#3b8fe0" stroke="#fff" stroke-width="1.4"/><text x="${x0 + 20 * u + 6}" y="${cy + 5}" font-size="13" fill="#f0e6d2">${s[0]} · ${s[1]} ft · ${Math.round(s[1] * e.k)} px</text>`; y += d + 8; });
    return `<div class="tag">Scale guide</div><h2>Scale &amp; tokens</h2>
      <div class="hook" style="border-color:#0ac8b9"><b>An average person is a 5-ft token.</b> Maps here have no grid: everything is drawn in feet. Tokens go anywhere and can be dragged. In your export at this resolution, <b>5 ft = ${Math.round(per5 * 10) / 10} px</b> (a person token is ${Math.round(per5)} px wide).</div>
      <h4>Token sizes (drawn to scale on the map)</h4><svg viewBox="0 0 330 ${y}" width="100%" style="max-width:340px">${rows}</svg>
      <h4>VTT setup</h4><div class="list"><a>Import the “VTT-ready PNG” (art only)<small>step 1</small></a><a>Set the scene scale so 5 ft = ${Math.round(per5)} px<small>step 2</small></a><a>Turn the VTT grid off (or make it invisible)<small>gridless</small></a></div>
      <h4>Typical sizes</h4><p class="lore">Door 4–5 ft · double door 6–8 ft · interior wall 1.6 ft · street 20–24 ft · lane 12–14 ft · city wall 12 ft thick · building 20–60 ft · a person walks 30 ft in a round.</p>
      <h4>City vs. below-city</h4><p class="lore">Both maps are drawn in true feet, so tokens are the same size on both. The city is about ${RT.MAPS.silvermere.w.toLocaleString()} ft across, so at city scale a person token is small — zoom in to move individuals, or open the site map (the mansion) for a close view.</p><div class="actions"><button class="btn" data-act="back">← Back</button></div>`;
  }
  function tokenPanel() {
    const t = S.items.find(i => i.id === S.sel.id); if (!t) return overview();
    return `<div class="tag">Token · ${t.size} ft across</div><h2>${RT.esc(t.label || 'Untitled')}</h2><label class="fld">Label<input type="text" data-tok="label" value="${RT.esc(t.label || '')}"></label>
      <label class="fld">Type<select data-tok="type">${Object.keys(TYPES).map(k => `<option value="${k}" ${k === t.type ? 'selected' : ''}>${TYPES[k][0]}</option>`).join('')}</select></label>
      <label class="fld">Size<select data-tok="size">${SIZES.map(s => `<option value="${s[1]}" ${s[1] === t.size ? 'selected' : ''}>${s[0]} (${s[1]} ft)</option>`).join('')}</select></label>
      <label class="fld">Notes<textarea data-tok="note" placeholder="Stat block, motive, secrets…">${RT.esc(t.note || '')}</textarea></label><div class="actions"><button class="btn" data-act="del" data-id="${t.id}">Delete</button></div>`;
  }
  function pinPanel() { const p = S.items.find(i => i.id === S.sel.id); if (!p) return overview(); return `<div class="tag">Note marker</div><h2>${RT.esc(p.label || 'Untitled')}</h2><label class="fld">Label<input type="text" data-tok="label" value="${RT.esc(p.label || '')}"></label><label class="fld">Notes<textarea data-tok="note" placeholder="Clues, secrets…">${RT.esc(p.note || '')}</textarea></label><div class="actions"><button class="btn" data-act="del" data-id="${p.id}">Delete</button></div>`; }
  panel.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return; const act = a.dataset.act, id = a.dataset.id;
    if (act === 'selF') { S.sel = { kind: 'feature', id }; sel(); } else if (act === 'selD') { S.sel = { kind: 'district', id }; sel(); } else if (act === 'back') { S.sel = null; sel(); }
    else if (act === 'openMap') openMap(id); else if (act === 'del') { S.items = S.items.filter(i => i.id !== id); S.sel = null; save(); sel(); }
  });
  panel.addEventListener('input', e => { const t = e.target; if (t.dataset.note) { S.notes[t.dataset.note] = t.value; save(); } else if (t.dataset.tok) { const i = S.items.find(q => q.id === S.sel.id); i[t.dataset.tok] = t.dataset.tok === 'size' ? +t.value : t.value; save(); renderOverlay(); if (t.dataset.tok === 'label') panel.querySelector('h2').textContent = t.value || 'Untitled'; } });
  const sel = () => { renderPanel(); renderOverlay(); };

  // ---------- interaction ----------
  const pt = (cx, cy) => { const p = new DOMPoint(cx, cy).matrixTransform(svg.getScreenCTM().inverse()); return [p.x, p.y]; };
  let drag = null;
  svg.addEventListener('pointerdown', e => {
    const tk = e.target.closest('.token'); const it = tk && S.items.find(i => i.id === tk.dataset.id);
    drag = { x: e.clientX, y: e.clientY, v: { ...S.view }, moved: false, id: e.pointerId, tok: it ? { it, ox: it.x, oy: it.y, p0: pt(e.clientX, e.clientY) } : null };
  });
  svg.addEventListener('pointermove', e => {
    if (S.tool === 'measure' && S.measure && S.measure.a && !S.measure.b) { S.measure.cur = pt(e.clientX, e.clientY); const m = S.measure; m.b = null; const ov = $('ov'); if (ov) { const sv = m.b; m.b = m.cur; ov.innerHTML = overlayHTML(kNow(), false); m.b = sv; } }
    if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; svg.classList.add('drag'); svg.setPointerCapture(drag.id); }
    if (!drag.moved) return;
    if (drag.tok) { const p = pt(e.clientX, e.clientY); drag.tok.it.x = drag.tok.ox + p[0] - drag.tok.p0[0]; drag.tok.it.y = drag.tok.oy + p[1] - drag.tok.p0[1]; renderOverlay(); return; }
    const bb = svg.getBoundingClientRect(), sc = Math.min(bb.width / S.view.w, bb.height / S.view.h); S.view.x = drag.v.x - dx / sc; S.view.y = drag.v.y - dy / sc; applyView();
  });
  svg.addEventListener('pointerup', e => { const d = drag; drag = null; svg.classList.remove('drag'); if (!d) return; if (d.moved) { if (d.tok) { save(); } return; } clickAt(e, d.tok && d.tok.it); });
  function clickAt(e, tokIt) {
    const el = e.target.closest('[data-kind]'), k = el && el.dataset.kind, p = pt(e.clientX, e.clientY), M = map();
    if (k === 'token' || k === 'pin') { S.sel = { kind: k, id: el.dataset.id }; sel(); return; }
    if (S.tool === 'measure') { const m = S.measure; if (!m || m.b) S.measure = { a: p, b: null }; else m.b = p; renderOverlay(); return; }
    if (S.tool === 'token' || S.tool === 'pin') {
      if (p[0] < 0 || p[1] < 0 || p[0] > M.w || p[1] > M.h) return;
      const n = S.items.filter(i => i.map === M.id && i.type === S.tokType && i.kind === 'token').length + 1;
      const it = S.tool === 'token' ? { id: 'i' + Date.now().toString(36) + Math.floor(Math.random() * 99), map: M.id, kind: 'token', type: S.tokType, size: S.tokSize, x: p[0], y: p[1], label: ({ hero: 'H', foe: 'F', npc: 'N', mount: 'M' }[S.tokType]) + n, note: '' } : { id: 'i' + Date.now().toString(36) + Math.floor(Math.random() * 99), map: M.id, kind: 'pin', x: p[0], y: p[1], label: '', note: '' };
      S.items.push(it); S.sel = { kind: it.kind, id: it.id }; save(); sel(); return;
    }
    if (!el) { S.sel = null; sel(); return; }
    S.sel = { kind: k, id: el.dataset.id }; sel();
  }
  function zoomBy(f, cx, cy) {
    const M = map(), v = S.view, [px, py] = cx == null ? [v.x + v.w / 2, v.y + v.h / 2] : pt(cx, cy), full = M.w * 1.04, minW = M.level === 'city' ? 70 : 24, w = RT.clamp(v.w * f, minW, full), k = w / v.w;
    S.view = { map: M.id, x: px - (px - v.x) * k, y: py - (py - v.y) * k, w, h: v.h * k }; applyView();
  }
  svg.addEventListener('wheel', e => { e.preventDefault(); zoomBy(e.deltaY > 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY); }, { passive: false });
  $('zIn').onclick = () => zoomBy(1 / 1.35); $('zOut').onclick = () => zoomBy(1.35); $('zReset').onclick = () => { S.view = fullView(map()); applyView(); };
  window.addEventListener('resize', () => { if (S.view) applyView(); });

  function setTool(t) {
    S.tool = S.tool === t ? null : t; if (S.tool !== 'measure') S.measure = null;
    $('toolToken').classList.toggle('on', S.tool === 'token'); $('toolPin').classList.toggle('on', S.tool === 'pin'); $('toolMeasure').classList.toggle('on', S.tool === 'measure');
    svg.classList.toggle('pinning', S.tool === 'token' || S.tool === 'pin'); svg.classList.toggle('measuring', S.tool === 'measure');
    $('toolHint').textContent = { token: 'Click the map to drop a token. Drag any token to move it. Tokens are always real size.', pin: 'Click the map to drop a note marker (stays the same on-screen size).', measure: 'Click two points to measure feet. Click again to start over.' }[S.tool] || 'Tokens go anywhere (no grid) and can be dragged. A Medium creature — an average person — is 5 ft across.';
    renderOverlay();
  }
  function openMap(id) { const M = RT.MAPS[id]; S.level = M.level; S.maps[M.level] = id; S.sel = null; S.view = null; syncLevel(); drawArt(); renderPanel(); }
  function syncLevel() {
    document.querySelectorAll('#scaleTabs button').forEach(b => b.classList.toggle('on', b.dataset.level === S.level));
    const ms = Object.values(RT.MAPS).filter(m => m.level === S.level); $('mapSel').innerHTML = ms.map(m => `<option value="${m.id}">${RT.esc(m.name)}</option>`).join(''); $('mapSel').value = S.maps[S.level]; fillPx();
  }
  function init() {
    load(); $('themeSel').value = S.theme;
    $('eraSel').innerHTML = Object.keys(D.eras).map(k => `<option value="${k}">${RT.esc(D.eras[k].name)}</option>`).join(''); $('eraSel').value = S.era;
    $('tokType').innerHTML = Object.keys(TYPES).map(k => `<option value="${k}">${TYPES[k][0]}</option>`).join('');
    $('tokSize').innerHTML = SIZES.map(s => `<option value="${s[1]}" ${s[1] === 5 ? 'selected' : ''}>${s[0]} (${s[1]} ft)</option>`).join('');
    [['tLabels', 'labels'], ['tNumbers', 'numbers'], ['tDeco', 'deco']].forEach(([id, key]) => { $(id).checked = !!S.opts[key]; $(id).onchange = () => { S.opts[key] = $(id).checked ? 1 : 0; save(); renderOverlay(); }; });
    $('themeSel').onchange = () => { S.theme = $('themeSel').value; save(); drawArt(); };
    $('eraSel').onchange = () => { S.era = $('eraSel').value; save(); renderPanel(); renderOverlay(); };
    $('mapSel').onchange = () => { S.maps[S.level] = $('mapSel').value; S.sel = null; S.view = null; drawArt(); renderPanel(); };
    $('pxSel').onchange = () => { S.px[S.level] = +$('pxSel').value; save(); updateExportInfo(); if (S.sel && S.sel.kind === 'scale') renderPanel(); };
    $('loreBtn').onclick = () => { S.sel = { kind: 'lore' }; renderPanel(); }; $('scaleBtn').onclick = () => { S.sel = { kind: 'scale' }; renderPanel(); };
    $('tokType').onchange = () => { S.tokType = $('tokType').value; }; $('tokSize').onchange = () => { S.tokSize = +$('tokSize').value; };
    $('toolToken').onclick = () => setTool('token'); $('toolPin').onclick = () => setTool('pin'); $('toolMeasure').onclick = () => setTool('measure');
    document.querySelectorAll('#scaleTabs button').forEach(b => b.onclick = () => { S.level = b.dataset.level; S.sel = null; S.view = null; S.measure = null; syncLevel(); drawArt(); renderPanel(); });
    document.addEventListener('keydown', e => {
      if (/TEXTAREA|SELECT/.test(e.target.tagName) || (e.target.tagName === 'INPUT' && e.target.type === 'text')) return;
      if (e.key === '1' || e.key === '2') { S.level = e.key === '1' ? 'city' : 'site'; S.sel = null; S.view = null; syncLevel(); drawArt(); renderPanel(); }
      if (e.key === 'Escape') { S.sel = null; S.measure = null; setTool(S.tool); S.tool = null; setTool(null); sel(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && S.sel && (S.sel.kind === 'token' || S.sel.kind === 'pin')) { S.items = S.items.filter(i => i.id !== S.sel.id); S.sel = null; save(); sel(); }
    });
    $('exSvg').onclick = () => download(new Blob([serialize(false)], { type: 'image/svg+xml' }), fname('svg')); $('exPng').onclick = () => exportPng(false); $('exVtt').onclick = () => exportPng(true);
    $('saveJson').onclick = () => download(new Blob([JSON.stringify({ app: 'runeterra-atlas', items: S.items, notes: S.notes, theme: S.theme, era: S.era }, null, 2)], { type: 'application/json' }), 'demacia-campaign.json');
    $('loadJson').onclick = () => $('fileIn').click();
    $('fileIn').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const d = JSON.parse(t); S.items = d.items || []; S.notes = d.notes || {}; save(); sel(); toast('Campaign loaded'); } catch (er) { toast('Invalid file'); } }); e.target.value = ''; };
    $('resetAll').onclick = () => { if (confirm('Delete all tokens, markers and notes?')) { S.items = []; S.notes = {}; S.sel = null; save(); sel(); } };
    syncLevel(); drawArt(); renderPanel();
  }
  RT.app = { S, openMap };
  document.addEventListener('DOMContentLoaded', init);
})(window.RT);
