/* Runeterra Atlas — core utilities: seeded RNG, noise, geometry */
window.RT = window.RT || {};
(function (RT) {
  RT.hashStr = function (s) {
    let h = 2166136261;
    s = String(s);
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  RT.rng = function (seed) {
    let a = (typeof seed === 'string' ? RT.hashStr(seed) : seed) >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  RT.pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  RT.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  RT.lerp = (a, b, t) => a + (b - a) * t;

  // value noise 2D + fbm
  RT.noise = function (seed) {
    const s = RT.hashStr(seed);
    const h = (x, y) => {
      let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ s;
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
    };
    const sm = t => t * t * (3 - 2 * t);
    const v = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
      return RT.lerp(RT.lerp(h(xi, yi), h(xi + 1, yi), xf), RT.lerp(h(xi, yi + 1), h(xi + 1, yi + 1), xf), yf);
    };
    return function (x, y, oct) {
      oct = oct || 4; let amp = 1, f = 1, sum = 0, tot = 0;
      for (let i = 0; i < oct; i++) { sum += v(x * f, y * f) * amp; tot += amp; amp *= 0.5; f *= 2; }
      return sum / tot;
    };
  };

  // Midpoint-displaced edge; canonical direction => shared borders match exactly.
  RT.edgePts = function (a, b, seed, amp, depth) {
    const rev = a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]);
    const p = rev ? b : a, q = rev ? a : b;
    const r = RT.rng(p + '|' + q + '|' + seed);
    let pts = [p, q], k = amp;
    for (let d = 0; d < depth; d++) {
      const out = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const A = pts[i], B = pts[i + 1], dx = B[0] - A[0], dy = B[1] - A[1], off = (r() - 0.5) * k;
        out.push(A, [(A[0] + B[0]) / 2 - dy * off, (A[1] + B[1]) / 2 + dx * off]);
      }
      out.push(pts[pts.length - 1]); pts = out; k *= 0.55;
    }
    return rev ? pts.reverse() : pts;
  };
  RT.roughPoly = function (ctrl, seed, amp, depth) {
    const out = [];
    for (let i = 0; i < ctrl.length; i++) {
      const seg = RT.edgePts(ctrl[i], ctrl[(i + 1) % ctrl.length], seed, amp, depth);
      seg.pop(); out.push.apply(out, seg);
    }
    return out;
  };
  RT.pathOf = pts => 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
  RT.inPoly = function (pt, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  };
  RT.bbox = function (poly) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    poly.forEach(p => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  };
  RT.centroid = function (poly) {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length], f = p[0] * q[1] - q[0] * p[1];
      a += f; cx += (p[0] + q[0]) * f; cy += (p[1] + q[1]) * f;
    }
    a *= 3; return [cx / a, cy / a];
  };
  RT.distSeg = function (p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy;
    let t = l ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l : 0; t = RT.clamp(t, 0, 1);
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  };
  RT.mix = function (c1, c2, t) {
    const p = c => [1, 3, 5].map(i => parseInt(c.substr(i, 2), 16));
    const a = p(c1), b = p(c2);
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
  };
  RT.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  RT.W = 1600; RT.H = 1000;
})(window.RT);
