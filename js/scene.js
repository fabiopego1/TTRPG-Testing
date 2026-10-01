/* Scene renderer: authored map data (feet) -> illustrated SVG. No grids, no randomness. */
(function (RT) {
  const f1 = n => (+n).toFixed(1).replace(/\.0$/, '');
  const P = p => f1(p[0]) + ' ' + f1(p[1]);
  const shade = (c, k) => k >= 0 ? RT.mix(c, '#ffffff', k) : RT.mix(c, '#000000', -k);
  function smooth(pts, closed) {
    const n = pts.length; if (n < 3) return 'M' + pts.map(P).join('L');
    const g = i => closed ? pts[((i % n) + n) % n] : pts[RT.clamp(i, 0, n - 1)];
    let d = 'M' + P(pts[0]);
    for (let i = 0; i < (closed ? n : n - 1); i++) { const a = g(i - 1), b = g(i), c = g(i + 1), e = g(i + 2); d += `C${P([b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6])} ${P([c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6])} ${P(c)}`; }
    return d + (closed ? 'Z' : '');
  }
  RT.smoothPath = smooth;
  const st = it => `${it.fill ? `fill="${it.fill}"` : 'fill="none"'}${it.stroke ? ` stroke="${it.stroke}" stroke-width="${it.sw || .5}"` : ''}${it.op != null ? ` opacity="${it.op}"` : ''}${it.dash ? ` stroke-dasharray="${it.dash}"` : ''}${it.cap ? ` stroke-linecap="${it.cap}"` : ''}${it.filter ? ` filter="url(#${it.filter})"` : ''}${it.join ? ` stroke-linejoin="${it.join}"` : ' stroke-linejoin="round"'}`;
  const tf = (x, y, rot) => `transform="translate(${f1(x)} ${f1(y)})${rot ? ` rotate(${f1(rot)})` : ''}"`;

  // ------------------------------------------------------------------ defs: textures in feet
  const DEFS = `<defs>
  <pattern id="wood" width="12" height="4" patternUnits="userSpaceOnUse"><rect width="12" height="4" fill="#b98c5a"/><rect y="2" width="12" height="2" fill="#a97d4d" opacity=".55"/><path d="M0 0H12M0 2H12" stroke="#6e4a26" stroke-width=".28" opacity=".6"/><path d="M0 0V2M6 2V4" stroke="#6e4a26" stroke-width=".28" opacity=".6"/><path d="M1 .9H4.5M7 2.9H10.5M2 1.4H3" stroke="#d9b383" stroke-width=".2" opacity=".5"/></pattern>
  <pattern id="woodDark" width="12" height="4" patternUnits="userSpaceOnUse"><rect width="12" height="4" fill="#8a6440"/><rect y="2" width="12" height="2" fill="#7b5836" opacity=".55"/><path d="M0 0H12M0 2H12" stroke="#4a301a" stroke-width=".28" opacity=".7"/><path d="M0 0V2M6 2V4" stroke="#4a301a" stroke-width=".28" opacity=".7"/></pattern>
  <pattern id="marble" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#eeebe2"/><rect x="5" width="5" height="5" fill="#d9d6cb"/><rect y="5" width="5" height="5" fill="#d9d6cb"/><path d="M0 0H10M0 5H10M0 0V10M5 0V10" stroke="#b7b2a2" stroke-width=".22"/><path d="M1 1.2L3.4 3.6M6.2 6.4L8.6 8.8" stroke="#fff" stroke-width=".25" opacity=".8"/></pattern>
  <pattern id="flag" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#b9b3a4"/><path d="M0 4.2L3.8 4.6L4.4 0M4.4 4.6L8.4 3.8L9 0M9 3.9L12 4.2M0 8.6L2.6 8.2L3 4.4M3.2 8.3L7.6 8.9L8.2 4M8 8.6L12 8M0 12L1.8 8.6M5 12L5.6 8.7M9.4 12L8.6 8.5" fill="none" stroke="#7d786a" stroke-width=".32"/><path d="M1.2 2L3 1.4M5.4 2.4L7.2 1.8M1 6.4L2.4 6M5 6.6L6.6 6.4M9 6L10.6 5.6" stroke="#d3cebf" stroke-width=".25" opacity=".7"/></pattern>
  <pattern id="cobble" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#d6cdb7"/><g fill="#e4dcc7" stroke="#aea58b" stroke-width=".22"><ellipse cx="1.8" cy="1.7" rx="1.6" ry="1.3"/><ellipse cx="5.8" cy="1.5" rx="1.7" ry="1.2"/><ellipse cx="3.9" cy="4.1" rx="1.5" ry="1.3"/><ellipse cx="7.3" cy="5" rx="1.2" ry="1.4"/><ellipse cx="1.3" cy="5.6" rx="1.3" ry="1.3"/><ellipse cx="4.6" cy="7.2" rx="1.6" ry="1"/></g></pattern>
  <pattern id="gravel" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#d8cfb6"/><g fill="#b3a98d"><circle cx="1.2" cy="1.5" r=".35"/><circle cx="4.4" cy=".8" r=".3"/><circle cx="7.6" cy="2.2" r=".4"/><circle cx="2.6" cy="4.8" r=".4"/><circle cx="6" cy="5.6" r=".3"/><circle cx="8.2" cy="7.9" r=".35"/><circle cx="3.2" cy="8.2" r=".3"/></g><g fill="#efe8d2"><circle cx="2.8" cy="2.6" r=".3"/><circle cx="5.6" cy="3.6" r=".3"/><circle cx="1.2" cy="7" r=".3"/><circle cx="7.4" cy="6.6" r=".25"/></g></pattern>
  <pattern id="grass" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#98b673"/><g stroke="#7b9a58" stroke-width=".35" fill="none" stroke-linecap="round"><path d="M2 5L2.4 3M2.4 5L3.4 3.2M12 12L12.2 10M12.6 12L13.6 10.4M7 16L7.2 14M15 4L15.2 2.2"/></g><g stroke="#b4cf8c" stroke-width=".3" fill="none" stroke-linecap="round"><path d="M8 4L8.4 2.4M5 11L5.2 9.6M16 14L16.4 12.6"/></g></pattern>
  <pattern id="meadow" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#a9bc8c"/><g stroke="#8aa06b" stroke-width=".45" fill="none" stroke-linecap="round"><path d="M3 8L3.6 5M4 8L5.4 5.4M17 20L17.4 17M18 20L19.4 17.4M10 25L10.4 22M22 9L22.4 6.4"/></g><g fill="#e9e4a4" opacity=".7"><circle cx="9" cy="6" r=".5"/><circle cx="21" cy="14" r=".45"/><circle cx="6" cy="19" r=".5"/></g></pattern>
  <pattern id="rockface" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#8f8a7f"/><path d="M0 6L5 8L9 4L14 7L22 3M0 15L6 13L11 17L17 14L22 18M3 22L7 19M12 22L15 20" fill="none" stroke="#5f5b52" stroke-width=".5"/><path d="M2 3L6 2M12 12L16 11M5 18L9 17" stroke="#b5b0a3" stroke-width=".4" opacity=".7"/></pattern>
  <pattern id="stonewall" width="6" height="3" patternUnits="userSpaceOnUse"><rect width="6" height="3" fill="#d4cfc3"/><path d="M0 0H6M0 1.5H6M0 0V1.5M3 1.5V3" stroke="#9a9588" stroke-width=".2"/></pattern>
  <pattern id="hedge" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#4f7d45"/><g fill="#3d6a36"><circle cx="1.2" cy="1.2" r=".9"/><circle cx="3.8" cy="2.6" r=".9"/><circle cx="1.6" cy="4" r=".8"/></g><g fill="#6a9a58"><circle cx="2.8" cy=".9" r=".45"/><circle cx="4.4" cy="4.4" r=".4"/></g></pattern>
  <pattern id="soil" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#7a5a3c"/><path d="M0 1.5H6M0 4.5H6" stroke="#5e4329" stroke-width=".45"/></pattern>
  <pattern id="waves" width="30" height="14" patternUnits="userSpaceOnUse"><path d="M0 4Q3.75 1 7.5 4T15 4T22.5 4T30 4M0 11Q3.75 8 7.5 11T15 11T22.5 11T30 11" fill="none" stroke="#c8e6f0" stroke-width=".7" opacity=".55"/></pattern>
  <pattern id="shingle" width="4" height="3" patternUnits="userSpaceOnUse"><path d="M0 1.5H4M2 0V1.5M0 1.5V3M4 1.5V3" stroke="#000" stroke-width=".18" opacity=".22" fill="none"/></pattern>
  <radialGradient id="glowW"><stop offset="0" stop-color="#ffd88a" stop-opacity=".75"/><stop offset=".5" stop-color="#ffb347" stop-opacity=".28"/><stop offset="1" stop-color="#ff9a2e" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowC"><stop offset="0" stop-color="#cfe9ff" stop-opacity=".5"/><stop offset="1" stop-color="#8fc4ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="mist"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <linearGradient id="fall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#d4ecf6" stop-opacity=".75"/></linearGradient>
  <linearGradient id="vignette" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset="1" stop-color="#000" stop-opacity=".0"/></linearGradient>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .25  0 0 0 0 .2  0 0 0 0 .1  0 0 0 .22 0"/></filter>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter>
  <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>`;

  // ------------------------------------------------------------------ item drawers (all in feet)
  const DRAW = {
    rect(it) { const cx = it.x + it.w / 2, cy = it.y + it.h / 2, g = it.rot ? `transform="rotate(${it.rot} ${f1(cx)} ${f1(cy)})"` : ''; return (it.sh ? `<rect x="${f1(it.x + it.sh)}" y="${f1(it.y + it.sh * 1.2)}" width="${f1(it.w)}" height="${f1(it.h)}" rx="${it.rx || 0}" fill="#000" opacity=".22" ${g}/>` : '') + `<rect x="${f1(it.x)}" y="${f1(it.y)}" width="${f1(it.w)}" height="${f1(it.h)}" rx="${it.rx || 0}" ${st(it)} ${g}/>`; },
    poly(it) { const d = it.smooth ? smooth(it.pts, true) : 'M' + it.pts.map(P).join('L') + 'Z'; return (it.sh ? `<path d="${d}" fill="#000" opacity=".2" transform="translate(${it.sh} ${it.sh * 1.2})"/>` : '') + `<path d="${d}" ${st(it)}/>`; },
    path(it) { return `<path d="${it.pts ? smooth(it.pts, false) : it.d}" ${st(it)}/>`; },
    circle(it) { return (it.sh ? `<circle cx="${f1(it.x + it.sh)}" cy="${f1(it.y + it.sh * 1.2)}" r="${f1(it.r)}" fill="#000" opacity=".22"/>` : '') + `<circle cx="${f1(it.x)}" cy="${f1(it.y)}" r="${f1(it.r)}" ${st(it)}/>`; },
    ellipse(it) { return `<ellipse cx="${f1(it.x)}" cy="${f1(it.y)}" rx="${f1(it.rx)}" ry="${f1(it.ry)}" ${st(it)}${it.rot ? ` transform="rotate(${it.rot} ${f1(it.x)} ${f1(it.y)})"` : ''}/>`; },
    // road: wide smooth path with edge, surface and cobble speckle
    road(it) {
      const d = smooth(it.pts, false), c = it.c || '#e6dec6', e = it.e || '#9b8f74';
      return `<path d="${d}" fill="none" stroke="${e}" stroke-width="${it.w + 3.2}" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${it.w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#c4baa0" stroke-width="${it.w * .82}" stroke-dasharray=".25 2.4" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${it.w * .5}" stroke-dasharray=".2 3.6" stroke-linecap="round" stroke-linejoin="round" opacity=".45"/>`;
    },
    // wall: thick stroked line with light top and crenel marks
    wall(it) {
      const d = it.smooth ? smooth(it.pts, !!it.closed) : 'M' + it.pts.map(P).join('L') + (it.closed ? 'Z' : '');
      return `<path d="${d}" fill="none" stroke="#000" stroke-width="${it.w + 3}" stroke-linejoin="round" opacity=".28" transform="translate(2.4 3)"/><path d="${d}" fill="none" stroke="#5b564b" stroke-width="${it.w + 2}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#d8d3c7" stroke-width="${it.w}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#a49f92" stroke-width="${it.w * .55}" stroke-dasharray="2.2 2.2" stroke-linejoin="round" opacity=".8"/><path d="${d}" fill="none" stroke="#f4f1e8" stroke-width="1" stroke-linejoin="round" opacity=".7" transform="translate(-${it.w * .25} -${it.w * .25})"/>`;
    },
    tower(it) { const r = it.r; return `<circle cx="${f1(it.x + 2.4)}" cy="${f1(it.y + 3)}" r="${r}" fill="#000" opacity=".25"/><circle cx="${f1(it.x)}" cy="${f1(it.y)}" r="${r + 1}" fill="#5b564b"/><circle cx="${f1(it.x)}" cy="${f1(it.y)}" r="${r}" fill="#dcd7cb"/><circle cx="${f1(it.x)}" cy="${f1(it.y)}" r="${r * .62}" fill="${it.roof || '#8aa0bd'}" stroke="#4a5568" stroke-width=".6"/><circle cx="${f1(it.x - r * .18)}" cy="${f1(it.y - r * .18)}" r="${r * .3}" fill="#fff" opacity=".28"/>`; },
    // list of gable-roofed buildings: [x, y, w, h, rot, colorIndex]
    bld(it) {
      let s = '';
      it.list.forEach(b => {
        const [x, y, w, h, rot, ci] = b, col = it.pal[ci % it.pal.length], dk = shade(col, -.32), long = w >= h, a = rot || 0;
        s += `<g ${tf(x + 2.4, y + 3.2, a)} opacity=".24"><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="#000"/></g>`;
        s += `<g ${tf(x, y, a)}><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="${col}" stroke="${dk}" stroke-width=".7" rx=".5"/>`;
        s += long ? `<rect x="${f1(-w / 2)}" y="0" width="${f1(w)}" height="${f1(h / 2)}" fill="#000" opacity=".16"/><path d="M${f1(-w / 2)} 0H${f1(w / 2)}" stroke="${shade(col, .35)}" stroke-width=".9" opacity=".9"/>` : `<rect x="0" y="${f1(-h / 2)}" width="${f1(w / 2)}" height="${f1(h)}" fill="#000" opacity=".16"/><path d="M0 ${f1(-h / 2)}V${f1(h / 2)}" stroke="${shade(col, .35)}" stroke-width=".9" opacity=".9"/>`;
        if (Math.min(w, h) > 13) s += `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="url(#shingle)" opacity=".9"/>`;
        if (it.chim && Math.max(w, h) > 24) s += `<rect x="${f1(long ? w * .22 : -1.2)}" y="${f1(long ? -1.2 : h * .22)}" width="2.4" height="2.4" fill="#8b867a" stroke="#4a463f" stroke-width=".3"/>`;
        s += '</g>';
      });
      return s;
    },
    trees(it) {
      let s = '';
      it.list.forEach(t => {
        const [x, y, r] = t;
        if (it.kind === 'pine') s += `<circle cx="${f1(x + r * .45)}" cy="${f1(y + r * .55)}" r="${f1(r * .95)}" fill="#000" opacity=".2"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#2f5a3f" stroke="#1d3a28" stroke-width=".5"/><circle cx="${f1(x - r * .12)}" cy="${f1(y - r * .12)}" r="${f1(r * .68)}" fill="#3d7050"/><circle cx="${f1(x - r * .2)}" cy="${f1(y - r * .22)}" r="${f1(r * .3)}" fill="#5b8f68" opacity=".85"/>`;
        else s += `<circle cx="${f1(x + r * .4)}" cy="${f1(y + r * .5)}" r="${f1(r * .95)}" fill="#000" opacity=".2"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#5f8a45" stroke="#3a5a2c" stroke-width=".5"/><circle cx="${f1(x - r * .3)}" cy="${f1(y - r * .25)}" r="${f1(r * .55)}" fill="#7aa85a"/><circle cx="${f1(x + r * .3)}" cy="${f1(y + r * .25)}" r="${f1(r * .42)}" fill="#4d7a39" opacity=".7"/>`;
      });
      return s;
    },
    rocks(it) { return it.list.map(r => `<path d="${r.d}" fill="${it.c || '#a8a398'}" stroke="#58544a" stroke-width=".5" stroke-linejoin="round"/><path d="${r.hl}" fill="#d0cbbf" opacity=".55"/>`).join(''); },
    // furniture & set dressing, centered at x,y; w,h in ft; rot in degrees
    f(it) {
      const { t, x, y } = it, w = it.w || 2, h = it.h || 2, a = it.rot || 0, c = it.c, sh = `<rect x="${f1(-w / 2 + .7)}" y="${f1(-h / 2 + .9)}" width="${f1(w)}" height="${f1(h)}" rx=".5" fill="#000" opacity=".26"/>`;
      let b = '';
      switch (t) {
        case 'table': b = sh + `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${it.round ? Math.min(w, h) / 2 : .5}" fill="${c || '#8b6a42'}" stroke="#4a3320" stroke-width=".4"/><rect x="${f1(-w / 2 + .4)}" y="${f1(-h / 2 + .4)}" width="${f1(w - .8)}" height="${f1(h - .8)}" rx=".3" fill="none" stroke="#c49a66" stroke-width=".25" opacity=".7"/>`; break;
        case 'cloth': b = sh + `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx=".4" fill="${c || '#8b6a42'}" stroke="#4a3320" stroke-width=".4"/><rect x="${f1(-w / 2 + .5)}" y="${f1(-h / 2 + .5)}" width="${f1(w - 1)}" height="${f1(h - 1)}" fill="#f1ead2" stroke="#c8aa6e" stroke-width=".3"/>`; break;
        case 'chair': b = `<rect x="${f1(-w / 2 + .5)}" y="${f1(-h / 2 + .6)}" width="${f1(w)}" height="${f1(h)}" rx=".5" fill="#000" opacity=".25"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx=".6" fill="${c || '#7a4f2d'}" stroke="#3a2412" stroke-width=".3"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height=".5" fill="#2e1c0e"/>`; break;
        case 'bench': b = sh + `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx=".3" fill="${c || '#7a5a36'}" stroke="#3a2412" stroke-width=".3"/>`; break;
        case 'shelf': { let bk = ''; const n = Math.max(3, Math.floor(Math.max(w, h) / .9)), cols = ['#8e3b32', '#2f5d8a', '#c8aa6e', '#4d7a4a', '#6a4a8a', '#a7a29a']; for (let i = 0; i < n; i++) { bk += w >= h ? `<rect x="${f1(-w / 2 + .15 + i * (w - .3) / n)}" y="${f1(-h / 2 + .25)}" width="${f1((w - .3) / n - .12)}" height="${f1(h - .5)}" fill="${cols[i % 6]}"/>` : `<rect x="${f1(-w / 2 + .25)}" y="${f1(-h / 2 + .15 + i * (h - .3) / n)}" width="${f1(w - .5)}" height="${f1((h - .3) / n - .12)}" fill="${cols[i % 6]}"/>`; } b = sh + `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="#4a3220" stroke="#25170c" stroke-width=".3"/>` + bk; break; }
        case 'rug': b = `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx=".4" fill="${c || '#7e2f36'}" stroke="#3a1216" stroke-width=".35"/><rect x="${f1(-w / 2 + .9)}" y="${f1(-h / 2 + .9)}" width="${f1(w - 1.8)}" height="${f1(h - 1.8)}" fill="none" stroke="#c8aa6e" stroke-width=".35"/><rect x="${f1(-w / 2 + 1.6)}" y="${f1(-h / 2 + 1.6)}" width="${f1(w - 3.2)}" height="${f1(h - 3.2)}" fill="${shade(c || '#7e2f36', .12)}" opacity=".6"/><path d="M0 ${f1(-h / 2 + 1.6)}L${f1(w / 2 - 1.6)} 0L0 ${f1(h / 2 - 1.6)}L${f1(-w / 2 + 1.6)} 0Z" fill="none" stroke="#c8aa6e" stroke-width=".3" opacity=".8"/>`; break;
        case 'bed': b = sh + `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx=".5" fill="#e8e0c8" stroke="#4a3320" stroke-width=".35"/><rect x="${f1(-w / 2 + .2)}" y="${f1(-h / 2 + h * .3)}" width="${f1(w - .4)}" height="${f1(h * .68)}" fill="${c || '#2f5d8a'}"/><rect x="${f1(-w / 2 + .4)}" y="${f1(-h / 2 + .3)}" width="${f1(w / 2 - .6)}" height="${f1(h * .2)}" rx=".3" fill="#fff"/>`; break;
        case 'hearth': b = `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="#8a857a" stroke="#3f3b33" stroke-width=".4"/><rect x="${f1(-w / 2 + .6)}" y="${f1(-h / 2 + .6)}" width="${f1(w - 1.2)}" height="${f1(h - 1.2)}" fill="#2a1d14"/><ellipse cx="0" cy="0" rx="${f1(Math.max(.8, w / 2 - 1.2))}" ry="${f1(Math.max(.5, h / 2 - .9))}" fill="#ff9a2e"/><ellipse cx="0" cy="0" rx="${f1(Math.max(.5, w / 4))}" ry="${f1(Math.max(.3, h / 4))}" fill="#ffe08a"/>`; break;
        case 'stair': { let ln = ''; const n = Math.round((it.dir === 'v' ? h : w) / 1.1); for (let i = 1; i < n; i++) ln += it.dir === 'v' ? `M${f1(-w / 2)} ${f1(-h / 2 + i * h / n)}H${f1(w / 2)}` : `M${f1(-w / 2 + i * w / n)} ${f1(-h / 2)}V${f1(h / 2)}`; b = `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="#cfc8b6" stroke="#5b564b" stroke-width=".4"/><path d="${ln}" stroke="#7d786a" stroke-width=".3"/>` + (it.arrow ? `<path d="M0 ${f1(h / 4)}L0 ${f1(-h / 4)}M-1 ${f1(-h / 4 + 1.2)}L0 ${f1(-h / 4)}L1 ${f1(-h / 4 + 1.2)}" stroke="#4a463f" stroke-width=".3" fill="none"/>` : ''); break; }
        case 'pillar': b = `<circle cx=".6" cy=".8" r="${f1(w / 2)}" fill="#000" opacity=".25"/><circle r="${f1(w / 2)}" fill="#f2efe6" stroke="#8b867a" stroke-width=".35"/><circle r="${f1(w / 2 * .55)}" fill="none" stroke="#c8aa6e" stroke-width=".25"/>`; break;
        case 'statue': b = `<rect x="${f1(-w / 2 + .5)}" y="${f1(-h / 2 + .6)}" width="${f1(w)}" height="${f1(h)}" fill="#000" opacity=".25"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="#bfbcb0" stroke="#6f6b60" stroke-width=".35"/>` + (it.wing ? `<path d="M0 -.3L${f1(-w * .95)} ${f1(-h * .1)}L${f1(-w * .55)} ${f1(h * .35)}ZM0 -.3L${f1(w * .95)} ${f1(-h * .1)}L${f1(w * .55)} ${f1(h * .35)}Z" fill="#f4f1e6" stroke="#6f6b60" stroke-width=".3"/>` : '') + `<circle r="${f1(Math.min(w, h) * .3)}" fill="#fff" stroke="#6f6b60" stroke-width=".3"/>`; break;
        case 'fountain': b = `<circle cx=".8" cy="1" r="${f1(w / 2)}" fill="#000" opacity=".25"/><circle r="${f1(w / 2)}" fill="#e7e4da" stroke="#6f6b60" stroke-width=".5"/><circle r="${f1(w / 2 - .9)}" fill="#7fb3c8" stroke="#3f6a80" stroke-width=".3"/><circle r="${f1(w / 2 - 1.8)}" fill="url(#waves)"/><circle r="${f1(w * .14)}" fill="#cbc6b8" stroke="#6f6b60" stroke-width=".3"/><circle r="${f1(w * .06)}" fill="#fff"/><circle r="${f1(w * .26)}" fill="none" stroke="#fff" stroke-width=".25" opacity=".7"/>`; break;
        case 'crate': b = sh + `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="#8a6f43" stroke="#3a2f1b" stroke-width=".35"/><path d="M${f1(-w / 2)} ${f1(-h / 2)}L${f1(w / 2)} ${f1(h / 2)}M${f1(w / 2)} ${f1(-h / 2)}L${f1(-w / 2)} ${f1(h / 2)}" stroke="#3a2f1b" stroke-width=".3"/>`; break;
        case 'barrel': b = `<circle cx=".5" cy=".7" r="${f1(w / 2)}" fill="#000" opacity=".25"/><circle r="${f1(w / 2)}" fill="#8a6a42" stroke="#3a2a14" stroke-width=".35"/><circle r="${f1(w / 2 - .4)}" fill="none" stroke="#3a2a14" stroke-width=".25"/><circle r="${f1(w / 2 - .9)}" fill="#a08050" opacity=".7"/>`; break;
        case 'plant': b = `<circle cx=".5" cy=".6" r="${f1(w / 2)}" fill="#000" opacity=".2"/><circle r="${f1(w / 2)}" fill="${c || '#5c8a4a'}" stroke="#2f5a2b" stroke-width=".3"/><circle cx="${f1(-w * .15)}" cy="${f1(-w * .15)}" r="${f1(w * .25)}" fill="#7fae62"/>`; break;
        case 'lectern': b = sh + `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx=".3" fill="#6d4c2a" stroke="#2e1c0e" stroke-width=".3"/><rect x="${f1(-w / 2 + .3)}" y="${f1(-h / 2 + .3)}" width="${f1(w / 2 - .4)}" height="${f1(h - .6)}" fill="#f4efe0" stroke="#8a7a5a" stroke-width=".2"/><rect x="${f1(.1)}" y="${f1(-h / 2 + .3)}" width="${f1(w / 2 - .4)}" height="${f1(h - .6)}" fill="#f4efe0" stroke="#8a7a5a" stroke-width=".2"/>`; break;
        case 'sofa': b = sh + `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx=".9" fill="${c || '#3e5f8a'}" stroke="#1e2f47" stroke-width=".35"/><rect x="${f1(-w / 2 + .4)}" y="${f1(-h / 2 + .4)}" width="${f1(w - .8)}" height="${f1(h * .35)}" rx=".4" fill="${shade(c || '#3e5f8a', -.2)}"/>`; break;
        case 'harp': b = sh + `<path d="M${f1(-w / 2)} ${f1(h / 2)}L${f1(-w / 2)} ${f1(-h / 2)}Q${f1(w * .2)} ${f1(-h / 2)} ${f1(w / 2)} ${f1(-h * .1)}L${f1(w / 2)} ${f1(h / 2)}Z" fill="#5a3a22" stroke="#25170c" stroke-width=".35"/><path d="M${f1(-w / 2 + .6)} ${f1(h / 2 - .6)}H${f1(w / 2 - .6)}" stroke="#d9c79a" stroke-width=".25"/>`; break;
        case 'altar': b = sh + `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="#e9e5da" stroke="#6f6b60" stroke-width=".4"/><circle cx="${f1(-w / 2 + .9)}" cy="0" r=".35" fill="#ffd27a"/><circle cx="${f1(w / 2 - .9)}" cy="0" r=".35" fill="#ffd27a"/><rect x="-1" y="-.5" width="2" height="1" fill="#c8aa6e"/>`; break;
        case 'bush': b = `<circle cx=".6" cy=".8" r="${f1(w / 2)}" fill="#000" opacity=".2"/><circle r="${f1(w / 2)}" fill="url(#hedge)" stroke="#2f5a2b" stroke-width=".35"/>${it.flower ? `<circle cx="${f1(-w * .2)}" cy="${f1(-w * .1)}" r=".4" fill="${it.flower}"/><circle cx="${f1(w * .2)}" cy="${f1(w * .15)}" r=".4" fill="${it.flower}"/><circle cx="0" cy="${f1(w * .25)}" r=".4" fill="${it.flower}"/>` : ''}`; break;
        case 'hedge': b = `<rect x="${f1(-w / 2 + .5)}" y="${f1(-h / 2 + .7)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(Math.min(w, h) / 2.2)}" fill="#000" opacity=".22"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(Math.min(w, h) / 2.2)}" fill="url(#hedge)" stroke="#2f5a2b" stroke-width=".4"/>`; break;
        case 'bed2': b = `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx=".5" fill="url(#soil)" stroke="#3a2a1a" stroke-width=".35"/>` + (it.crop ? Array.from({ length: Math.floor(w / 1.4) }, (_, i) => `<circle cx="${f1(-w / 2 + .9 + i * 1.4)}" cy="${f1(-h / 4)}" r=".45" fill="${it.crop}"/><circle cx="${f1(-w / 2 + .9 + i * 1.4)}" cy="${f1(h / 4)}" r=".45" fill="${it.crop}"/>`).join('') : ''); break;
        case 'well': b = `<circle cx=".7" cy=".9" r="${f1(w / 2)}" fill="#000" opacity=".25"/><circle r="${f1(w / 2)}" fill="#cfcabd" stroke="#5b564b" stroke-width=".4"/><circle r="${f1(w / 2 - .8)}" fill="#1f3a4a"/><circle r="${f1(w / 2 - 1.3)}" fill="#3a6a80" opacity=".8"/>`; break;
        case 'lamp': b = `<circle r=".6" fill="#3a3a3a"/><circle r=".35" fill="#ffd27a"/>`; break;
        case 'banner': b = `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" fill="${c || '#2f5d8a'}" stroke="#c8aa6e" stroke-width=".3"/><path d="M${f1(-w / 2)} ${f1(h / 2)}L0 ${f1(h / 2 - .8)}L${f1(w / 2)} ${f1(h / 2)}" fill="${c || '#2f5d8a'}" stroke="#c8aa6e" stroke-width=".3"/>`; break;
        case 'nest': b = `<circle cx=".6" cy=".8" r="${f1(w / 2)}" fill="#000" opacity=".22"/><circle r="${f1(w / 2)}" fill="#8a6a3f" stroke="#3a2a14" stroke-width=".4"/><circle r="${f1(w / 2 - .8)}" fill="#a98a58"/>${it.eggs ? `<ellipse cx="-.5" cy=".2" rx=".55" ry=".75" fill="#e8f2f8" stroke="#6f87a8" stroke-width=".2"/><ellipse cx=".6" cy="-.3" rx=".55" ry=".75" fill="#e8f2f8" stroke="#6f87a8" stroke-width=".2"/>` : ''}`; break;
      }
      return `<g ${tf(x, y, a)}>${b}</g>`;
    },
    // door across a wall: x,y = center of opening; w = width; dir 'h' (wall runs east-west) or 'v'; thickness t
    door(it) {
      const w = it.w || 4, t = it.t || 2, h = it.dir === 'v', dbl = it.dbl || w >= 6, th = '#c9bba0';
      const gap = h ? `<rect x="${f1(-t / 2 - .1)}" y="${f1(-w / 2)}" width="${f1(t + .2)}" height="${f1(w)}" fill="${th}"/>` : `<rect x="${f1(-w / 2)}" y="${f1(-t / 2 - .1)}" width="${f1(w)}" height="${f1(t + .2)}" fill="${th}"/>`;
      const jam = h ? `<path d="M${f1(-t / 2)} ${f1(-w / 2)}H${f1(t / 2)}M${f1(-t / 2)} ${f1(w / 2)}H${f1(t / 2)}" stroke="#4a4338" stroke-width=".5"/>` : `<path d="M${f1(-w / 2)} ${f1(-t / 2)}V${f1(t / 2)}M${f1(w / 2)} ${f1(-t / 2)}V${f1(t / 2)}" stroke="#4a4338" stroke-width=".5"/>`;
      const leaf = h ? (dbl ? `<rect x="-.5" y="${f1(-w / 2)}" width="1" height="${f1(w / 2)}" fill="#7a5a34" stroke="#2e1c0e" stroke-width=".25"/><rect x="-.5" y="0" width="1" height="${f1(w / 2)}" fill="#7a5a34" stroke="#2e1c0e" stroke-width=".25"/>` : `<rect x="-.5" y="${f1(-w / 2)}" width="1" height="${f1(w)}" fill="#7a5a34" stroke="#2e1c0e" stroke-width=".25"/>`) : (dbl ? `<rect x="${f1(-w / 2)}" y="-.5" width="${f1(w / 2)}" height="1" fill="#7a5a34" stroke="#2e1c0e" stroke-width=".25"/><rect x="0" y="-.5" width="${f1(w / 2)}" height="1" fill="#7a5a34" stroke="#2e1c0e" stroke-width=".25"/>` : `<rect x="${f1(-w / 2)}" y="-.5" width="${f1(w)}" height="1" fill="#7a5a34" stroke="#2e1c0e" stroke-width=".25"/>`);
      return `<g ${tf(it.x, it.y)}>${gap}${jam}${leaf}</g>`;
    },
    win(it) { const w = it.w || 3, h = it.dir === 'v'; return `<g ${tf(it.x, it.y)}><rect x="${f1(h ? -.9 : -w / 2)}" y="${f1(h ? -w / 2 : -.9)}" width="${f1(h ? 1.8 : w)}" height="${f1(h ? w : 1.8)}" fill="#a9d3e8" stroke="#4a4338" stroke-width=".4"/><path d="${h ? `M0 ${f1(-w / 2)}V${f1(w / 2)}` : `M${f1(-w / 2)} 0H${f1(w / 2)}`}" stroke="#4a4338" stroke-width=".25"/></g>`; },
    raptor(it) { const s = it.s || 1; return `<g ${tf(it.x, it.y, it.rot)} opacity=".95"><path d="M0 ${-9 * s}Q${3 * s} ${-3 * s} ${2 * s} ${5 * s}L0 ${8 * s}L${-2 * s} ${5 * s}Q${-3 * s} ${-3 * s} 0 ${-9 * s}Z" fill="#c9d6e8" stroke="#46566e" stroke-width=".5"/><path d="M${2 * s} ${-2 * s}Q${12 * s} ${-9 * s} ${22 * s} ${-4 * s}Q${15 * s} ${-2 * s} ${13 * s} ${3 * s}Q${9 * s} ${0} ${6 * s} ${4 * s}Z M${-2 * s} ${-2 * s}Q${-12 * s} ${-9 * s} ${-22 * s} ${-4 * s}Q${-15 * s} ${-2 * s} ${-13 * s} ${3 * s}Q${-9 * s} ${0} ${-6 * s} ${4 * s}Z" fill="#dfe7f1" stroke="#46566e" stroke-width=".5"/><circle cy="${-8 * s}" r="${1.4 * s}" fill="#f2cf6a"/></g>`; },
    light(it, ctx) { ctx.lights.push(it); return ''; },
    text(it) { return `<text x="${f1(it.x)}" y="${f1(it.y)}" font-size="${it.size || 4}" text-anchor="middle" fill="${it.fill || '#2a1d10'}" font-family="Cinzel,Georgia,serif" ${it.rot ? `transform="rotate(${it.rot} ${f1(it.x)} ${f1(it.y)})"` : ''} opacity="${it.op || .8}">${RT.esc(it.t)}</text>`; }
  };
  // axis-aligned wall segment given a center line and thickness: {k:'wall2', x1,y1,x2,y2,t}
  DRAW.wall2 = it => { const t = it.t || 1.6, x = Math.min(it.x1, it.x2), y = Math.min(it.y1, it.y2), w = Math.abs(it.x2 - it.x1), h = Math.abs(it.y2 - it.y1), rw = w < .01 ? t : w + (it.cap === false ? 0 : t), rh = h < .01 ? t : h + (it.cap === false ? 0 : t), rx = w < .01 ? x - t / 2 : x - (it.cap === false ? 0 : t / 2), ry = h < .01 ? y - t / 2 : y - (it.cap === false ? 0 : t / 2); return `<rect x="${f1(rx + .8)}" y="${f1(ry + 1)}" width="${f1(rw)}" height="${f1(rh)}" fill="#000" opacity=".25"/><rect x="${f1(rx)}" y="${f1(ry)}" width="${f1(rw)}" height="${f1(rh)}" fill="url(#stonewall)" stroke="#4a463f" stroke-width=".4"/>`; };

  // ------------------------------------------------------------------ public API
  RT.renderScene = function (S, o) {
    const ctx = { lights: [] }; let out = DEFS;
    out += `<rect x="-200" y="-200" width="${S.w + 400}" height="${S.h + 400}" fill="${S.ground || '#c8cdb6'}"/>`;
    S.draw.forEach(it => { const fn = DRAW[it.k]; if (fn) out += fn(it, ctx); });
    if (o && o.night) {
      out += `<rect x="-200" y="-200" width="${S.w + 400}" height="${S.h + 400}" fill="#06122c" opacity=".55" pointer-events="none"/>`;
      ctx.lights.concat(S.lights || []).forEach(l => { out += `<circle cx="${l.x}" cy="${l.y}" r="${l.r}" fill="url(#${l.moon ? 'glowC' : 'glowW'})" pointer-events="none"/>`; });
    } else {
      (S.lights || []).forEach(l => { if (!l.moon) out += `<circle cx="${l.x}" cy="${l.y}" r="${l.r * .45}" fill="url(#glowW)" opacity=".35" pointer-events="none"/>`; });
    }
    return out;
  };
})(window.RT);
