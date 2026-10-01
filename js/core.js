/* Runeterra Atlas — tiny shared helpers. All maps are authored data in feet (1 unit = 1 ft). */
window.RT = window.RT || {};
(function (RT) {
  RT.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  RT.lerp = (a, b, t) => a + (b - a) * t;
  RT.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  RT.mix = function (c1, c2, t) {
    const p = c => [1, 3, 5].map(i => parseInt(c.substr(i, 2), 16)), a = p(c1), b = p(c2);
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
  };
  RT.MAPS = {};
  // Token diameter = the creature's body footprint in feet (not the 5-ft D&D "square" it controls).
  // A person is about 2 ft across at the shoulders; the token is 2.5 ft so it reads clearly.
  RT.CREATURES = [['Tiny', 1.25, 'about 1¼ ft — rat, raven'], ['Medium', 2.5, 'about 2½ ft — an average person, dwarf, halfling'], ['Large', 5, '5 ft — horse, silverwing raptor, ogre'], ['Huge', 10, '10 ft — giant, young dragon'], ['Gargantuan', 15, '15 ft — ancient dragon, kraken']];
})(window.RT);
