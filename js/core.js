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
  // Creature sizes: diameter of a token in feet (D&D 5e space).
  RT.CREATURES = [['Tiny', 2.5, 'about 2½ ft — rat, raven'], ['Small / Medium', 5, '5 ft — an average person, dwarf, halfling, wolf'], ['Large', 10, '10 ft — horse, silverwing raptor, ogre'], ['Huge', 15, '15 ft — giant, young dragon'], ['Gargantuan', 20, '20 ft+ — ancient dragon, kraken']];
})(window.RT);
