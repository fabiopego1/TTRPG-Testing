/* Runeterra Atlas — UI. Gridless maps authored in feet (1 unit = 1 ft); tokens are drawn at real size. */
(function (RT) {
  const $ = id => document.getElementById(id), svg = $('map'), panel = $('panel'), D = RT.DEMACIA, SIZES = RT.CREATURES;
  const STORE = 'runeterra-atlas-demacia-v4', FONT = 'Marcellus, Georgia, serif';
  const S = { level: 'city', maps: { city: 'silvermere', site: 'crownguard' }, theme: 'day', opts: { labels: 1, numbers: 1, deco: 1 }, sel: null, view: null, tool: null, tokType: 'hero', tokSize: 1.5, px: { city: 15, site: 70 }, items: [], notes: {}, measure: null };
  const TYPES = { hero: ['Hero', '#4f86d6'], foe: ['Foe', '#cc5a4f'], npc: ['NPC', '#6fa05d'], mount: ['Mount / beast', '#c4a363'] };
  const map = () => RT.MAPS[S.maps[S.level]];
  const tokens = () => S.items.filter(i => i.map === map().id && i.kind === 'token'), pins = () => S.items.filter(i => i.map === map().id && i.kind === 'pin');

  function save() { try { localStorage.setItem(STORE, JSON.stringify({ items: S.items, notes: S.notes, theme: S.theme, opts: S.opts, px: S.px })); } catch (e) { } }
  function load() { try { const d = JSON.parse(localStorage.getItem(STORE) || 'null'); if (d) { S.items = d.items || []; S.notes = d.notes || {}; S.theme = d.theme || S.theme; Object.assign(S.px, d.px || {}); Object.assign(S.opts, d.opts || {}); } } catch (e) { } }
  const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 1900); };
  const niceFt = max => { let b = 5; for (const f of [5, 10, 20, 50, 100, 200, 500, 1000]) if (f <= max) b = f; return b; };
  const num = n => n.toLocaleString('en-US');

  // ---------- drawing ----------
  function drawArt() {
    const M = map(); svg.innerHTML = `<g id="art">${RT.renderScene(M, { night: S.theme === 'night' })}</g><g id="ov"></g>`;
    S.view = S.view && S.view.map === M.id ? S.view : fullView(M); applyView();
  }
  const fullView = M => ({ map: M.id, x: -M.w * .02, y: -M.h * .02, w: M.w * 1.04, h: M.h * 1.04 });
  function kNow() { const bb = svg.getBoundingClientRect(), v = S.view; return 1 / Math.max(.0001, Math.min(bb.width / v.w, bb.height / v.h)); }
  function applyView() { const v = S.view; svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`); renderOverlay(); updateCartouche(); updateExportInfo(); }
  function tokenSvg(t) {
    const ty = TYPES[t.type] || TYPES.hero, r = t.size / 2 * .94, sel = S.sel && S.sel.kind === 'token' && S.sel.id === t.id, sw = Math.max(.18, t.size * .05);
    return `<g class="token" data-kind="token" data-id="${t.id}"><circle cx="${t.x + t.size * .06}" cy="${t.y + t.size * .08}" r="${r}" fill="#000" opacity=".3"/><circle cx="${t.x}" cy="${t.y}" r="${r}" fill="${ty[1]}" stroke="#fff" stroke-width="${sw}"/><circle cx="${t.x}" cy="${t.y}" r="${r * .72}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${sw * .5}"/>${sel ? `<circle cx="${t.x}" cy="${t.y}" r="${r + t.size * .12}" fill="none" stroke="#fff" stroke-width="${sw * .8}" stroke-dasharray="${t.size * .14} ${t.size * .1}"/>` : ''}<text x="${t.x}" y="${t.y + t.size * .14}" text-anchor="middle" font-size="${t.size * (t.size < 3 ? .46 : .4)}" font-weight="700" fill="#fff" font-family="${FONT}" pointer-events="none">${RT.esc((t.label || '').slice(0, 2).toUpperCase())}</text></g>`;
  }
  // octagonal numeral plate — the atlas's marker shape (chamfered, matching the notched buttons)
  const plate = (x, y, r) => { const c = r * .42, a = r; return `M${x - a + c} ${y - a}H${x + a - c}L${x + a} ${y - a + c}V${y + a - c}L${x + a - c} ${y + a}H${x - a + c}L${x - a} ${y + a - c}V${y - a + c}Z`; };
  // overlay = everything that is not map art. k = feet per screen pixel (labels/markers keep a constant on-screen size)
  function overlayHTML(k, forExport) {
    const M = map(), night = S.theme === 'night', ink = night ? '#e8f0f8' : '#2a1d10', halo = night ? '#06122c' : '#f6edd2'; let s = '';
    const txt = (x, y, t, fs, extra) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs}" fill="${ink}" stroke="${halo}" stroke-width="${fs * .3}" paint-order="stroke" font-family="${FONT}" ${extra || ''}>${RT.esc(t)}</text>`;
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
    if (S.opts.numbers) M.features.forEach((f, i) => { const x = f.mx != null ? f.mx : (f.rect ? (f.rect[0] + f.rect[2]) / 2 : f.x), y = f.my != null ? f.my : (f.rect ? (f.rect[1] + f.rect[3]) / 2 : f.y), r = 9.5 * k, sel = S.sel && S.sel.kind === 'feature' && S.sel.id === f.id; s += `<g class="mk" data-kind="feature" data-id="${f.id}"><path d="${plate(x, y, r)}" fill="${sel ? '#2d4b7a' : (night ? '#0c1117' : '#f2ecda')}" stroke="${sel ? '#6b93d1' : '#a8864a'}" stroke-width="${(sel ? 2 : 1.6) * k}"/><text x="${x}" y="${y + 3.7 * k}" text-anchor="middle" font-size="${10.5 * k}" font-family="${FONT}" fill="${sel ? '#fff' : ink}" pointer-events="none">${i + 1}</text></g>`; });
    s += tokens().map(t => tokenSvg(t)).join('');
    s += pins().map(p => { const r = 9 * k, sel = S.sel && S.sel.kind === 'pin' && S.sel.id === p.id; return `<g class="mk" data-kind="pin" data-id="${p.id}"><path d="M${p.x} ${p.y}L${p.x - r * .8} ${p.y - r * 1.5}L${p.x} ${p.y - r * 2.6}L${p.x + r * .8} ${p.y - r * 1.5}Z" fill="#c4a363" stroke="${sel ? '#fff' : '#0c1117'}" stroke-width="${(sel ? 2 : 1.4) * k}" stroke-linejoin="miter"/><circle cx="${p.x}" cy="${p.y - r * 1.5}" r="${r * .3}" fill="#0c1117"/>${p.label ? `<text x="${p.x + r * 1.3}" y="${p.y - r * 1.2}" font-size="${11 * k}" fill="#fff" stroke="#0c1117" stroke-width="${3 * k}" paint-order="stroke" font-family="${FONT}" pointer-events="none">${RT.esc(p.label)}</text>` : ''}</g>`; }).join('');
    if (S.measure && S.measure.a) { const a = S.measure.a, b = S.measure.b || S.measure.cur || a, ft = Math.hypot(b[0] - a[0], b[1] - a[1]); s += `<g pointer-events="none"><path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" stroke="#fff" stroke-width="${3.4 * k}" stroke-linecap="round" opacity=".9"/><path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" stroke="#cc5a4f" stroke-width="${1.8 * k}" stroke-dasharray="${5 * k} ${4 * k}" stroke-linecap="round"/><circle cx="${a[0]}" cy="${a[1]}" r="${3 * k}" fill="#cc5a4f" stroke="#fff" stroke-width="${k}"/><circle cx="${b[0]}" cy="${b[1]}" r="${3 * k}" fill="#cc5a4f" stroke="#fff" stroke-width="${k}"/>${txt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 7 * k, Math.round(ft) + ' ft', 13 * k, 'font-weight="700"')}</g>`; }
    if (S.opts.deco) {
      const gold = night ? '#c4a363' : '#8a6a2b', pad = 3 * k;
      s += `<g pointer-events="none"><rect x="${-pad * 2}" y="${-pad * 2}" width="${M.w + pad * 4}" height="${M.h + pad * 4}" fill="none" stroke="${gold}" stroke-width="${2.4 * k}"/><rect x="${-pad * 3.2}" y="${-pad * 3.2}" width="${M.w + pad * 6.4}" height="${M.h + pad * 6.4}" fill="none" stroke="${gold}" stroke-width="${k}"/></g>`;
      const v = S.view, bar = niceFt(140 * k), bx = v.x + 24 * k, by = v.y + v.h - 26 * k;
      s += `<g pointer-events="none" font-family="${FONT}"><rect x="${bx - 10 * k}" y="${by - 24 * k}" width="${bar + 56 * k}" height="${40 * k}" fill="${night ? '#0c1117' : '#f6edd2'}" opacity=".82"/><path d="M${bx} ${by}H${bx + bar}M${bx} ${by - 5 * k}V${by + 5 * k}M${bx + bar / 2} ${by - 3 * k}V${by + 3 * k}M${bx + bar} ${by - 5 * k}V${by + 5 * k}" stroke="${ink}" stroke-width="${2 * k}"/><text x="${bx}" y="${by - 9 * k}" font-size="${10 * k}" fill="${ink}">0</text><text x="${bx + bar + 6 * k}" y="${by + 4 * k}" font-size="${11 * k}" fill="${ink}">${bar} ft</text></g>`;
      const cx = v.x + v.w - 42 * k, cy = v.y + 46 * k, cr = 24 * k; s += `<g pointer-events="none" font-family="${FONT}"><path d="${plate(cx, cy, cr)}" fill="${night ? '#0c1117' : '#f6edd2'}" opacity=".85" stroke="${gold}" stroke-width="${1.4 * k}"/><path d="M${cx} ${cy - cr * .8}L${cx + cr * .2} ${cy}L${cx} ${cy + cr * .8}L${cx - cr * .2} ${cy}Z" fill="${gold}"/><path d="M${cx - cr * .8} ${cy}L${cx} ${cy - cr * .2}L${cx + cr * .8} ${cy}L${cx} ${cy + cr * .2}Z" fill="${gold}" opacity=".5"/><text x="${cx}" y="${cy - cr - 4 * k}" text-anchor="middle" font-size="${11 * k}" fill="${ink}">N</text></g>`;
    }
    return s;
  }
  function renderOverlay() { const ov = $('ov'); if (ov) ov.innerHTML = overlayHTML(kNow(), false); }
  function updateCartouche() { const M = map(); $('crumb').innerHTML = `<b>${RT.esc(M.name)}</b><small>${num(M.w)} × ${num(M.h)} ft · drawn to scale</small>`; }

  // ---------- export ----------
  function pxPerFt() { return S.px[S.level] / 5; }
  function exportDims() { const M = map(); let k = pxPerFt(), w = Math.round(M.w * k), h = Math.round(M.h * k); const mx = Math.max(w, h); if (mx > 16000) { const f = 16000 / mx; k *= f; w = Math.round(M.w * k); h = Math.round(M.h * k); } return { k, w, h }; }
  function updateExportInfo() { const e = exportDims(); $('exInfo').textContent = `${num(e.w)} × ${num(e.h)} px\n5 ft = ${Math.round(e.k * 5 * 10) / 10} px · person = ${Math.round(e.k * 1.5 * 10) / 10} px`; $('exInfo').style.whiteSpace = 'pre-line'; }
  function fillPx() { const opts = S.level === 'city' ? [[10, '10 px per 5 ft'], [15, '15 px per 5 ft'], [20, '20 px per 5 ft'], [30, '30 px per 5 ft']] : [[50, '50 px per 5 ft'], [70, '70 px · Roll20'], [100, '100 px · Foundry'], [140, '140 px · hi-res']]; $('pxSel').innerHTML = opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join(''); if (!opts.some(o => o[0] === S.px[S.level])) S.px[S.level] = opts[1][0]; $('pxSel').value = S.px[S.level]; }
  function serialize(clean) {
    const M = map(), e = exportDims(), c = svg.cloneNode(true); c.setAttribute('viewBox', `0 0 ${M.w} ${M.h}`); c.setAttribute('width', e.w); c.setAttribute('height', e.h); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.removeAttribute('class'); c.removeAttribute('style');
    const ov = c.querySelector('#ov'); if (ov) { if (clean) ov.remove(); else { const keep = S.sel, kv = S.view; S.sel = null; S.view = { x: 0, y: 0, w: M.w, h: M.h }; ov.innerHTML = overlayHTML(1 / e.k * 1.15, true); S.sel = keep; S.view = kv; } }
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(c);
  }
  function download(blob, fn) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  const fname = ext => `demacia-${map().id}.${ext}`;
  function exportPng(clean) {
    const e = exportDims(), url = URL.createObjectURL(new Blob([serialize(clean)], { type: 'image/svg+xml;charset=utf-8' })), img = new Image(); toast('Rendering PNG…');
    img.onload = () => { const cv = document.createElement('canvas'); cv.width = e.w; cv.height = e.h; cv.getContext('2d').drawImage(img, 0, 0, e.w, e.h); cv.toBlob(b => { download(b, fname('png')); URL.revokeObjectURL(url); toast(`Exported · 5 ft = ${Math.round(e.k * 5 * 10) / 10} px`); }, 'image/png'); };
    img.onerror = () => toast('PNG export failed — try a lower resolution'); img.src = url;
  }

  // ---------- codex panel ----------
  const list = (a, fn) => a.map(fn).join('');
  const notesBox = key => `<h3 class="sec">Notes</h3><textarea data-note="${RT.esc(key)}" placeholder="Your notes for this entry…">${RT.esc(S.notes[key] || '')}</textarea>`;
  const glyph = c => `<svg><use href="#i-${c ? 'canon' : 'invented'}"/></svg>`;
  const dimsOf = f => f.rect ? `${Math.round(f.rect[2] - f.rect[0])} × ${Math.round(f.rect[3] - f.rect[1])} ft` : null;
  function renderPanel() {
    const s = S.sel; let h = '';
    if (s && s.kind === 'scale') h = scalePanel(); else if (s && s.kind === 'feature') h = featurePanel(s.id); else if (s && s.kind === 'district') h = districtPanel(s.id); else if (s && s.kind === 'token') h = tokenPanel(); else if (s && s.kind === 'pin') h = pinPanel(); else h = overview();
    panel.innerHTML = h; panel.scrollTop = 0;
  }
  function overview() {
    const M = map(), out = M.parent ? `<div class="acts"><button class="btn" data-act="openMap" data-id="${M.parent}">← ${RT.esc(RT.MAPS[M.parent].name)}</button></div>` : '';
    return `<div class="eyebrow">${RT.esc(M.tag)}</div><h2 class="title">${RT.esc(M.name)}</h2>
      <div class="plate"><span>${num(M.w)} × ${num(M.h)} ft</span><span>no grid</span></div>${out}
      <p class="lede">${RT.esc(M.summary)}</p><hr class="rule">
      <h3 class="sec" style="margin-top:0">${M.level === 'city' ? 'Locations' : 'Rooms &amp; areas'}<span class="legend"><span class="canon">${glyph(1)}Canon</span><span>${glyph(0)}Invented</span></span></h3>
      <ol class="index">${list(M.features, (f, i) => `<li><a data-act="selF" data-id="${f.id}"><span class="n">${i + 1}</span><span class="nm">${RT.esc(f.n)}</span><span class="lead"></span><span class="st ${f.c ? 'canon' : ''}" title="${f.c ? 'Canon' : 'Invented'}">${glyph(f.c)}</span></a></li>`)}</ol>
      ${M.districts ? `<h3 class="sec">Districts</h3><ol class="index">${list(M.districts, d => `<li><a data-act="selD" data-id="${d.id}"><span class="nm">${RT.esc(d.n)}</span><span class="lead"></span></a></li>`)}</ol>` : ''}
      <h3 class="sec">Dimensions</h3><dl class="dims">${list(M.dims, t => { const i = t.indexOf(':'); return i > 0 && i < 18 ? `<div><dt>${RT.esc(t.slice(0, i))}</dt><dd>${RT.esc(t.slice(i + 1).trim())}</dd></div>` : `<div><dd>${RT.esc(t)}</dd></div>`; })}</dl>
      ${notesBox('map:' + M.id)}
      <p class="src">Lore: ${list(D.sources, (s, i) => `${i ? ' · ' : ''}<a href="${s[1]}" target="_blank" rel="noopener">${RT.esc(s[0])}</a>`)}. Canon marks what the lore says; invented marks the author’s additions. Demacia and League of Legends belong to Riot Games.</p>`;
  }
  function featurePanel(id) {
    const M = map(), f = M.features.find(x => x.id === id); if (!f) return overview(); const dm = dimsOf(f), open = f.opens ? RT.MAPS[f.opens] : null, i = M.features.indexOf(f);
    return `<div class="eyebrow">${RT.esc(M.name)} · № ${i + 1}</div><h2 class="title sm">${RT.esc(f.n)}</h2>
      <div class="status ${f.c ? 'canon' : ''}">${glyph(f.c)}${f.c ? 'Canon' : 'Invented for the table'}</div>
      ${dm ? `<div class="plate"><span>${dm}</span></div>` : ''}<p class="lede">${RT.esc(f.d)}</p>
      <div class="acts">${open ? `<button class="btn primary" data-act="openMap" data-id="${open.id}" style="width:auto;padding:11px 20px">Open ${RT.esc(open.name)} →</button>` : ''}<button class="btn" data-act="back">← Overview</button></div>
      <hr class="rule">${notesBox('f:' + M.id + ':' + f.id)}`;
  }
  function districtPanel(id) { const M = map(), d = (M.districts || []).find(x => x.id === id); if (!d) return overview(); return `<div class="eyebrow">${RT.esc(M.name)} · district</div><h2 class="title sm">${RT.esc(d.n)}</h2><p class="lede">${RT.esc(d.d)}</p><div class="acts"><button class="btn" data-act="back">← Overview</button></div><hr class="rule">${notesBox('d:' + M.id + ':' + d.id)}`; }
  function scalePanel() {
    const e = exportDims(), per5 = e.k * 5; let rows = '';
    SIZES.forEach(s => { const u = 5, d = s[1] * u; rows += `<div><svg width="${Math.max(d, 8)}" height="${Math.max(d, 8)}" viewBox="0 0 ${Math.max(d, 8)} ${Math.max(d, 8)}"><circle cx="${Math.max(d, 8) / 2}" cy="${Math.max(d, 8) / 2}" r="${d / 2 * .94}" fill="#4f86d6" stroke="#fff" stroke-width="1.2"/></svg><b>${s[0]}</b><span>${s[1]} ft · ${Math.round(s[1] * e.k * 10) / 10} px</span></div>`; });
    return `<div class="eyebrow">Scale guide</div><h2 class="title sm">Scale &amp; tokens</h2>
      <p class="lede">Everything is drawn in feet. A token is the creature’s <b>body footprint</b>: an average person is <b>1.5 ft</b> (18 in) across the shoulders. Tokens go anywhere and can be dragged. The 5-ft D&amp;D “square” is the space a creature controls, not its body.</p>
      <h3 class="sec">Token sizes, to scale</h3><div class="sizes">${rows}</div>
      <h3 class="sec">At this export resolution</h3><dl class="dims"><div><dt>5 ft</dt><dd>${Math.round(per5 * 10) / 10} px</dd></div><div><dt>Person</dt><dd>${Math.round(per5 * .3 * 10) / 10} px</dd></div><div><dt>Image</dt><dd>${num(e.w)} × ${num(e.h)} px</dd></div></dl>
      <h3 class="sec">VTT setup</h3><dl class="dims"><div><dt>1</dt><dd>Import the VTT-ready PNG (art only)</dd></div><div><dt>2</dt><dd>Set the scene scale so 5 ft = ${Math.round(per5 * 10) / 10} px</dd></div><div><dt>3</dt><dd>Turn the grid off</dd></div></dl>
      <h3 class="sec">Reference sizes</h3><dl class="dims"><div><dt>Furniture</dt><dd>chair 1.5 ft · table 3 ft wide · sofa 6.5 ft</dd></div><div><dt>Doors</dt><dd>3 ft · double 5 ft · entrance 6 ft</dd></div><div><dt>Walls</dt><dd>interior 1.2 ft · exterior 2 ft · city 10 ft</dd></div><div><dt>Streets</dt><dd>main 24 ft · other 14 ft</dd></div><div><dt>Houses</dt><dd>20–30 ft frontage · 32–38 ft deep</dd></div></dl>
      <div class="acts"><button class="btn" data-act="back">← Back</button></div>`;
  }
  function tokenPanel() {
    const t = S.items.find(i => i.id === S.sel.id); if (!t) return overview();
    return `<div class="eyebrow">Token · ${t.size} ft across</div><h2 class="title sm">${RT.esc(t.label || 'Untitled')}</h2>
      <label class="fld"><span>Label</span><input type="text" data-tok="label" value="${RT.esc(t.label || '')}"></label>
      <div class="pair"><label class="fld"><span>Type</span><select data-tok="type">${Object.keys(TYPES).map(k => `<option value="${k}" ${k === t.type ? 'selected' : ''}>${TYPES[k][0]}</option>`).join('')}</select></label>
      <label class="fld"><span>Size</span><select data-tok="size">${SIZES.map(s => `<option value="${s[1]}" ${s[1] === t.size ? 'selected' : ''}>${s[0]} (${s[1]} ft)</option>`).join('')}</select></label></div>
      <label class="fld"><span>Notes</span><textarea data-tok="note" placeholder="Stat block, motive, secrets…">${RT.esc(t.note || '')}</textarea></label><div class="acts"><button class="btn danger" data-act="del" data-id="${t.id}" style="padding-left:0">Delete token</button></div>`;
  }
  function pinPanel() { const p = S.items.find(i => i.id === S.sel.id); if (!p) return overview(); return `<div class="eyebrow">Note marker</div><h2 class="title sm">${RT.esc(p.label || 'Untitled')}</h2><label class="fld"><span>Label</span><input type="text" data-tok="label" value="${RT.esc(p.label || '')}"></label><label class="fld"><span>Notes</span><textarea data-tok="note" placeholder="Clues, secrets…">${RT.esc(p.note || '')}</textarea></label><div class="acts"><button class="btn danger" data-act="del" data-id="${p.id}" style="padding-left:0">Delete marker</button></div>`; }
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
    if (S.tool === 'measure' && S.measure && S.measure.a && !S.measure.b) { S.measure.cur = pt(e.clientX, e.clientY); renderOverlay(); }
    if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; svg.classList.add('drag'); svg.setPointerCapture(drag.id); }
    if (!drag.moved) return;
    if (drag.tok) { const p = pt(e.clientX, e.clientY); drag.tok.it.x = drag.tok.ox + p[0] - drag.tok.p0[0]; drag.tok.it.y = drag.tok.oy + p[1] - drag.tok.p0[1]; renderOverlay(); return; }
    const bb = svg.getBoundingClientRect(), sc = Math.min(bb.width / S.view.w, bb.height / S.view.h); S.view.x = drag.v.x - dx / sc; S.view.y = drag.v.y - dy / sc; applyView();
  });
  svg.addEventListener('pointerup', e => { const d = drag; drag = null; svg.classList.remove('drag'); if (!d) return; if (d.moved) { if (d.tok) save(); return; } clickAt(e); });
  function clickAt(e) {
    const el = e.target.closest('[data-kind]'), k = el && el.dataset.kind, p = pt(e.clientX, e.clientY), M = map();
    if (k === 'token' || k === 'pin') { S.sel = { kind: k, id: el.dataset.id }; sel(); return; }
    if (S.tool === 'measure') { const m = S.measure; if (!m || m.b) S.measure = { a: p, b: null }; else m.b = p; renderOverlay(); return; }
    if (S.tool === 'token' || S.tool === 'pin') {
      if (p[0] < 0 || p[1] < 0 || p[0] > M.w || p[1] > M.h) return;
      const n = S.items.filter(i => i.map === M.id && i.type === S.tokType && i.kind === 'token').length + 1, id = 'i' + Date.now().toString(36) + Math.floor(Math.random() * 99);
      const it = S.tool === 'token' ? { id, map: M.id, kind: 'token', type: S.tokType, size: S.tokSize, x: p[0], y: p[1], label: ({ hero: 'H', foe: 'F', npc: 'N', mount: 'M' }[S.tokType]) + n, note: '' } : { id, map: M.id, kind: 'pin', x: p[0], y: p[1], label: '', note: '' };
      S.items.push(it); S.sel = { kind: it.kind, id: it.id }; save(); sel(); return;
    }
    if (!el) { S.sel = null; sel(); return; }
    S.sel = { kind: k, id: el.dataset.id }; sel();
  }
  function zoomBy(f, cx, cy) {
    const M = map(), v = S.view, [px, py] = cx == null ? [v.x + v.w / 2, v.y + v.h / 2] : pt(cx, cy), full = M.w * 1.04, minW = M.level === 'city' ? 40 : 18, w = RT.clamp(v.w * f, minW, full), k = w / v.w;
    S.view = { map: M.id, x: px - (px - v.x) * k, y: py - (py - v.y) * k, w, h: v.h * k }; applyView();
  }
  svg.addEventListener('wheel', e => { e.preventDefault(); zoomBy(e.deltaY > 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY); }, { passive: false });
  $('zIn').onclick = () => zoomBy(1 / 1.35); $('zOut').onclick = () => zoomBy(1.35); $('zReset').onclick = () => { S.view = fullView(map()); applyView(); };
  window.addEventListener('resize', () => { if (S.view) applyView(); });

  const HINT = 'Tokens go anywhere (no grid) and can be dragged. An average person is a 1.5-ft token.';
  function setTool(t) {
    S.tool = S.tool === t ? null : t; if (S.tool !== 'measure') S.measure = null;
    $('toolToken').classList.toggle('on', S.tool === 'token'); $('toolPin').classList.toggle('on', S.tool === 'pin'); $('toolMeasure').classList.toggle('on', S.tool === 'measure');
    svg.classList.toggle('pinning', S.tool === 'token' || S.tool === 'pin'); svg.classList.toggle('measuring', S.tool === 'measure');
    $('toolHint').textContent = { token: 'Click the map to drop a token; drag a token to move it. Tokens are always real size.', pin: 'Click the map to drop a note marker (constant on-screen size).', measure: 'Click two points to measure feet; click again to start over.' }[S.tool] || HINT;
    renderOverlay();
  }
  function openMap(id) { const M = RT.MAPS[id]; S.level = M.level; S.maps[M.level] = id; S.sel = null; S.view = null; syncLevel(); drawArt(); renderPanel(); }
  function syncLevel() {
    document.querySelectorAll('#scaleTabs button').forEach(b => { const on = b.dataset.level === S.level; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    const ms = Object.values(RT.MAPS).filter(m => m.level === S.level); $('mapSel').innerHTML = ms.map(m => `<option value="${m.id}">${RT.esc(m.name)}</option>`).join(''); $('mapSel').value = S.maps[S.level]; fillPx();
  }
  function goLevel(l) { S.level = l; S.sel = null; S.view = null; S.measure = null; syncLevel(); drawArt(); renderPanel(); }
  function init() {
    load(); $('themeSel').value = S.theme; $('toolHint').textContent = HINT;
    $('tokType').innerHTML = Object.keys(TYPES).map(k => `<option value="${k}">${TYPES[k][0]}</option>`).join('');
    $('tokSize').innerHTML = SIZES.map(s => `<option value="${s[1]}" ${s[1] === 1.5 ? 'selected' : ''}>${s[0]} · ${s[1]} ft</option>`).join('');
    [['tLabels', 'labels'], ['tNumbers', 'numbers'], ['tDeco', 'deco']].forEach(([id, key]) => { $(id).checked = !!S.opts[key]; $(id).onchange = () => { S.opts[key] = $(id).checked ? 1 : 0; save(); renderOverlay(); }; });
    $('themeSel').onchange = () => { S.theme = $('themeSel').value; save(); drawArt(); };
    $('mapSel').onchange = () => { S.maps[S.level] = $('mapSel').value; S.sel = null; S.view = null; drawArt(); renderPanel(); };
    $('pxSel').onchange = () => { S.px[S.level] = +$('pxSel').value; save(); updateExportInfo(); if (S.sel && S.sel.kind === 'scale') renderPanel(); };
    $('scaleBtn').onclick = () => { S.sel = { kind: 'scale' }; renderPanel(); };
    $('tokType').onchange = () => { S.tokType = $('tokType').value; }; $('tokSize').onchange = () => { S.tokSize = +$('tokSize').value; };
    $('toolToken').onclick = () => setTool('token'); $('toolPin').onclick = () => setTool('pin'); $('toolMeasure').onclick = () => setTool('measure');
    document.querySelectorAll('#scaleTabs button').forEach(b => b.onclick = () => goLevel(b.dataset.level));
    document.addEventListener('keydown', e => {
      if (/TEXTAREA|SELECT/.test(e.target.tagName) || (e.target.tagName === 'INPUT' && e.target.type === 'text')) return;
      if (e.key === '1') goLevel('city'); if (e.key === '2') goLevel('site');
      if (e.key === 'Escape') { S.sel = null; S.measure = null; if (S.tool) setTool(S.tool); sel(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && S.sel && (S.sel.kind === 'token' || S.sel.kind === 'pin')) { S.items = S.items.filter(i => i.id !== S.sel.id); S.sel = null; save(); sel(); }
    });
    $('exSvg').onclick = () => download(new Blob([serialize(false)], { type: 'image/svg+xml' }), fname('svg')); $('exPng').onclick = () => exportPng(false); $('exVtt').onclick = () => exportPng(true);
    $('saveJson').onclick = () => download(new Blob([JSON.stringify({ app: 'runeterra-atlas', items: S.items, notes: S.notes, theme: S.theme }, null, 2)], { type: 'application/json' }), 'demacia-campaign.json');
    $('loadJson').onclick = () => $('fileIn').click();
    $('fileIn').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const d = JSON.parse(t); S.items = d.items || []; S.notes = d.notes || {}; save(); sel(); toast('Campaign loaded'); } catch (er) { toast('Invalid file'); } }); e.target.value = ''; };
    $('resetAll').onclick = () => { if (confirm('Delete all tokens, markers and notes?')) { S.items = []; S.notes = {}; S.sel = null; save(); sel(); } };
    syncLevel(); drawArt(); renderPanel();
  }
  RT.app = { S, openMap };
  document.addEventListener('DOMContentLoaded', init);
})(window.RT);
