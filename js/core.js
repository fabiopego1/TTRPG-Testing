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
  // Token diameter = the creature's body footprint in feet. A person is ~18 in (1.5 ft) across the shoulders.
  // The 5-ft D&D "square" is the space a creature controls, not its body.
  RT.CREATURES = [['Tiny', .75, 'about 9 in — rat, raven'], ['Medium', 1.5, 'about 18 in across the shoulders — an average person, dwarf, halfling'], ['Large', 3, '3 ft — horse, silverwing raptor, ogre'], ['Huge', 6, '6 ft — giant, young dragon'], ['Gargantuan', 12, '12 ft — ancient dragon, kraken']];
})(window.RT);
