/* Demacia pack — lore researched from the official League of Legends Universe wiki (wiki.leagueoflegends.com).
   Each landmark is flagged canon (c:1) or invented-for-the-table (c:0). Edit freely. */
window.RT = window.RT || {};
(function (RT) {
  const L = (id, n, type, x, y, c, d, npc, h, t) => ({ id, n, type, x, y, c, d, npc, h, t: t || null });

  RT.DEMACIA = {
    name: 'Demacia',
    tag: 'Kingdom of valor · petricite · fear of magic',
    summary: 'A proud kingdom in western Valoran, founded as a refuge from the Rune Wars on the strength of petricite — a pale stone that dampens magic. Governed by the Lightshield crown, an elected Royal Council and the Demacian Magistrate, it prizes justice, honor and duty — and officially bans magic.',
    houses: [['Lightshield', 'The royal house; rules from the Citadel of Dawn.'], ['Crownguard', 'Honor-bound protectors of the king; seat in High Silvermere. Garen and Lux’s family.'], ['Buvelle', 'Patrons of the musical arts and supporters of the Illuminators.'], ['Laurent', 'Elite duelists and lovers of beautiful things.'], ['Durand', 'Noble house of the Demacian Council.']],
    orders: [['Dauntless Vanguard', 'Elite warriors who guard the realm, led by Garen Crownguard.'], ['Silverwing Raptors', 'Griffin-like creatures and the riders who scout and harass from the air.'], ['Mageseekers', 'Locate and imprison mages. Disbanded by Jarvan IV in the Turmoil.'], ['Illuminators', 'A charitable order that secretly shelters mages; based in the Sepulchral Halls.']],
    eras: {
      peace: { name: 'Mageseekers’ Reign', blurb: 'The Mageseekers are active. Magic is hunted; whispers about the Illuminators grow. Every mage the party meets is a risk to hide.' },
      turmoil: { name: 'The Turmoil', blurb: 'Sylas’ rebellion has broken the Mageseekers. Jarvan IV disbanded them; the public learns Demacia was founded with mages’ help. Loyalties split, nobles bicker, riots simmer.' }
    },
    rumors: {
      peace: ['A prisoner escaped the Mageseekers’ cells — and no one will say how.', 'The Illuminators smuggle mages inside funeral processions.', 'Petricite is running out; quarrymen say the stone-trees no longer grow.', 'A Noxian agent was seen near the Citadel after dark.', 'House Laurent is quietly buying up duelists’ contracts.', 'The Silverwing riders say the raptors are unsettled lately.'],
      turmoil: ['Sylas the Unshackled was seen in the lower wards, rallying freed mages.', 'The Mageseekers’ Arcane Registry has been ransacked — or sold.', 'Nobles argue whether the king should be crowned at all.', 'Some Vanguard have refused orders to arrest mages.', 'A song about the Winged Sisters is banned in one district and sung openly in the next.', 'The Noxians are watching the border for weakness.']
    },
    sources: [['Demacia (wiki)', 'https://wiki.leagueoflegends.com/en-us/Universe:Demacia'], ['The Great City of Demacia', 'https://wiki.leagueoflegends.com/en-us/Universe:The_Great_City_of_Demacia'], ['High Silvermere', 'https://wiki.leagueoflegends.com/en-us/High_Silvermere'], ['Dawnhold', 'https://wiki.leagueoflegends.com/en-us/Dawnhold'], ['Custodian Wall', 'https://wiki.leagueoflegends.com/en-us/Custodian_Wall'], ['Greenfang Mountains', 'https://wiki.leagueoflegends.com/en-us/Universe:Greenfang_Mountains']]
  };

  // ---------------------------------------------------------------- cities (coords are relative, -1..1)
  RT.DEMACIA_CITIES = [
    {
      id: 'demacia', seed: 'v1', ft: 2.5, name: 'The Great City of Demacia', short: 'Great City', tag: 'Capital · seat of House Lightshield', ground: '#d8d5c0', view: { cx: 800, cy: 525, sx: 600, sy: 380 }, outside: 'fields',
      summary: 'Largest city in the kingdom, on a plateau by the sea. Towering spires of petricite and marble rise around King’s Rock, where the Citadel of Dawn is carved from the stone itself. Most noble houses live here; magic is officially denied.',
      wall: [[-.92, -.12], [-.82, -.5], [-.5, -.78], [-.1, -.88], [.35, -.82], [.72, -.62], [.93, -.25], [.95, .2], [.78, .5], [.4, .66], [-.1, .72], [-.55, .66], [-.85, .4]],
      water: [[[-1.5, .8], [-.8, .78], [-.4, .84], [0, .81], [.5, .83], [1, .78], [1.5, .8], [1.5, 1.5], [-1.5, 1.5]]],
      islands: [[[-.12, .88], [.3, .86], [.42, .95], [.28, 1.04], [-.05, 1.05], [-.17, .96]]],
      hills: [{ x: 0, y: -.1, r: 130 }],
      districts: [
        { id: 'citadel', n: 'Citadel Heights', x: 0, y: -.1, style: 'royal', d: 'The king’s hill: the Citadel of Dawn, the Hall of Valor and the Palace Gardens. Guarded, quiet, immaculate.' },
        { id: 'noble', n: 'Noble Quarter', x: -.5, y: -.3, style: 'noble', d: 'Manors of the great houses behind the Last Gate. Marble facades, private guards, and secrets.' },
        { id: 'temple', n: 'Temple Ward', x: -.25, y: .22, style: 'religious', d: 'Temple of the Lightbringers and the Alabaster Library — pilgrims, scholars, and quiet debate.' },
        { id: 'military', n: 'Military District', x: .05, y: -.62, style: 'military', d: 'Barracks and penitentiaries. The Mageseekers Complex looms over the north side.' },
        { id: 'aviaries', n: 'Silverwing Aviaries', x: .68, y: -.18, style: 'military', d: 'Raptor roosts and riders’ lodgings. The air smells of feathers and meat.' },
        { id: 'sepulchral', n: 'Sepulchral Halls', x: .64, y: .24, style: 'religious', d: 'The city’s main religious district — and, quietly, the Illuminators’ base.' },
        { id: 'market', n: 'Plaza Market', x: .1, y: .38, style: 'market', d: 'Stalls and guild halls around the Grand Plaza. Everything is for sale except what officers want.' },
        { id: 'dregbourne', n: 'Dregbourne', x: -.6, y: .38, style: 'slum', d: 'The poor western quarter, birthplace of Sylas. Laundry lines, narrow lanes, long memories of the Mageseekers.' },
        { id: 'craft', n: 'Craftsmen’s Row', x: .5, y: .5, style: 'common', d: 'Smiths, masons and petricite-cutters; the hammering never stops.' },
        { id: 'lantern', n: 'Lantern Row', x: -.3, y: .55, style: 'common', d: 'Inns, guild houses and middle-class homes, lit by lanterns at dusk.' },
        { id: 'harbor', n: 'City Harbor', x: .1, y: .94, style: 'harbor', d: 'A rocky island linked by a bridge. Trade on the Conqueror’s Sea.' }
      ],
      nodes: [{ id: 'rN', x: 0, y: -.3 }, { id: 'rE', x: .24, y: -.1 }, { id: 'rS', x: 0, y: .14 }, { id: 'rW', x: -.24, y: -.1 }],
      roads: [['rN', 'rE', 'main'], ['rE', 'rS', 'main'], ['rS', 'rW', 'main'], ['rW', 'rN', 'main'], ['lastgate', 'memorial', 'main'], ['memorial', 'rW', 'main'], ['plaza', 'hall', 'main'], ['hall', 'rS', 'main'], ['plaza', 'harborgate', 'main'], ['harborgate', 'harbor', 'bridge'], ['eastgate', 'sepulchral', 'main'], ['sepulchral', 'plaza', 'main'], ['aviaries', 'sepulchral', 'lane'], ['aviaries', 'rE', 'lane'], ['northgate', 'barracks', 'main'], ['barracks', 'rN', 'main'], ['mageseekers', 'barracks', 'lane'], ['mageseekers', 'aviaries', 'lane'], ['temple', 'plaza', 'lane'], ['library', 'plaza', 'lane'], ['temple', 'memorial', 'lane'], ['manorC', 'memorial', 'lane'], ['manorB', 'memorial', 'lane'], ['manorL', 'lastgate', 'lane'], ['gardens', 'rW', 'lane']],
      landmarks: [
        L('citadel', 'Citadel of Dawn', 'palace', 0, -.1, 1, 'The Lightshield royal palace, carved from King’s Rock. The king’s court, the council chamber and the seat of Demacian power.', ['Steward Alaric Venn', 'Royal seneschal (invented)', 'Controls every audience. Privately fears the crown cannot hold the nobles together.'], 'A sealed petition for the king has been tampered with — someone inside the Citadel wants the party to find out who.', { d: 'Jarvan IV holds emergency councils at all hours; the guard has tripled and every petitioner is searched.', h: 'A noble faction wants the party to carry a message to the king that bypasses the Steward — before the next council vote.' }),
        L('hall', 'Hall of Valor', 'hall', .03, .08, 1, 'The throne room, honoring Demacia’s fallen warriors. Heroes’ names are carved into every pillar; duels of honor are sanctioned here.', ['Dame Rhosyn Valecourt', 'Keeper of the Roll (invented)', 'Adds names with her own hand — and keeps one pillar blank.'], 'A hero’s name has been chiseled off the Roll of the Fallen. Who erased it, and why?'),
        L('gardens', 'Palace Gardens', 'gardens', -.2, -.12, 1, 'Topiary, sculptures and quiet paths; the late Queen Catherine’s favorite refuge.', ['Tobin Marrow', 'Head gardener (invented)', 'Hears every secret nobles whisper beneath the roses.'], 'A service passage beneath the topiary maze has been left unlocked — three guards found it empty.'),
        L('plaza', 'The Grand Plaza', 'plaza', .05, .3, 1, 'A wide courtyard before the Citadel: speeches, sentencing, festivals and trials by combat.', ['Herald Cass Thornwell', 'Crier (invented)', 'Knows the schedule of every public event — and every whisper before it.'], 'A public sentencing is about to be announced. The crowd is volatile.', { d: 'Crowds gather daily: for the mages, against them, for Sylas, against the nobles.', h: 'A protest is about to turn into a riot; the party has two rounds to pick a side — or a way out.' }),
        L('lastgate', 'The Last Gate', 'gate', -.92, -.12, 1, 'The main entrance, leading to the noble residences and King’s Rock. Everyone is searched; nobles are waved through.', ['Gatewarden Hollis', 'Guard captain (invented)', 'By the book — but can be told a good reason.'], 'A cart of “petricite ore” is stopped at the gate — it’s humming.'),
        L('memorial', 'Memorial Road & Galio Monument', 'monument', -.5, .0, 1, 'A pilgrimage route honoring the fallen. The sentient petricite colossus Galio rests here as a monument.', ['Old Warden Brannoch', 'Veteran caretaker (invented)', 'Polishes each name daily; swears the stone sometimes sighs.'], 'Galio’s stone chest has cracked. Pilgrims whisper that it stirred overnight.'),
        L('manorC', 'House Crownguard Manor', 'manor', -.55, -.42, 1, 'Seat of the family sworn to guard the king — Garen and Lux’s house. Disciplined, proud, strict.', ['Tianna Crownguard', 'Vanguard commander (canon)', 'Lux’s aunt. Strategist; will test any stranger’s resolve.'], 'A young Crownguard squire asks the party to accompany them on a secret errand — for a cousin who “isn’t well.”'),
        L('manorB', 'House Buvelle Manor', 'manor', -.35, -.24, 0, 'Patrons of the musical arts; strong supporters of the Illuminators. Concerts are held on the lawn most evenings.', ['Lord Anselm Buvelle', 'Patron (invented)', 'Charming, generous, and secretly funding mage refuges.'], 'A charity concert is a cover for smuggling a mage. The party is asked to make sure no one looks at the choir.'),
        L('manorL', 'House Laurent Manor', 'manor', -.72, -.2, 0, 'A family of duelists and collectors of beautiful things. The courtyard doubles as a fencing yard.', ['Dame Odalys Laurent', 'Duelist (invented)', 'Offers a duel of honor for the slightest insult — and pays well for a worthy loss.'], 'A rival duelist died mid-bout under suspicious circumstances; the Laurent name is at stake.'),
        L('temple', 'Temple of the Lightbringers', 'temple', -.28, .2, 1, 'An ancient structure honoring the Winged Protectors, Kayle and Morgana.', ['High Cantor Elowen', 'Priest (invented)', 'Sings the old verses; knows more about Morgana than she admits.'], 'Pilgrims have begun reciting a verse praising Morgana. The temple wardens are unsure whether it is heresy.'),
        L('library', 'Alabaster Library', 'library', -.1, .36, 1, 'A beautiful repository of poetry, history and the Canticle of the Winged Sisters.', ['Archivist Perrin Oake', 'Librarian (invented)', 'Soft-spoken and fearless about forbidden books.'], 'A pre-Rune-Wars founding record is missing — and it would prove mages helped build Demacia.'),
        L('aviaries', 'Silverwing Aviaries', 'aviary', .68, -.18, 1, 'The complex housing the silverwing raptors and their riders.', ['Aerie-master Ysolde Frayne', 'Raptor handler (invented)', 'Loves her beasts more than her superiors.'], 'A raptor refuses all riders. Someone has been feeding it something strange.'),
        L('sepulchral', 'Sepulchral Halls', 'sepulchral', .64, .24, 1, 'The city’s main religious district, with halls of the dead and — secretly — the Illuminators’ headquarters.', ['Brother Haldric', 'Illuminator (invented)', 'Offers sanctuary to anyone who knows the right words.'], 'A funeral procession needs two extra pallbearers — with strong backs and weak curiosity.'),
        L('barracks', 'Military District', 'barracks', .0, -.58, 1, 'Army barracks and penitentiaries; the Dauntless Vanguard drills in the yard.', ['Sergeant Maren Holt', 'Vanguard drill sergeant (invented)', 'Hard but fair. Her recruits keep vanishing before patrols.'], 'Three recruits have gone missing the night before a patrol. Someone has been sneaking them out.'),
        L('mageseekers', 'Mageseekers Complex', 'mageseekers', .34, -.5, 1, 'The prison and headquarters of the Mageseekers, crowned with a colossal marble eagle. It holds imprisoned mages and the Arcane Registry.', ['Commander Wisteria', 'Mageseeker commander (canon)', 'Obedient to the crown and ruthless to mages; wavers when her own order is doubted.'], 'A prisoner is scheduled for transfer. Someone wants the party to arrange for the cart to never arrive.', { d: 'Disbanded by Jarvan IV, the complex stands half-empty: archivists, jailers and former prisoners wander its petricite halls, unsure what happens next.', h: 'A cache of Arcane Registry pages is for sale. Both Sylas’ followers and the nobles want them — and so does a third party.' }),
        L('northgate', 'Northern Gate', 'gate', -.1, -.88, 0, 'The gate to the Rocky Highlands and the road to High Silvermere. Raptors circle overhead.', ['Gate-sergeant Pell', 'Guard (invented)', 'Reads travelers’ boots to guess where they’ve been.'], 'A messenger arrives with a seal that matches no house — and collapses at the gate.'),
        L('eastgate', 'Eastern Gate', 'gate', .95, .2, 0, 'The road to the Greenfang Mountains and the Custodian Wall.', ['Gate-sergeant Edda', 'Guard (invented)', 'Has watched the roads for twenty years.'], 'A caravan from Meltridge is late; the drivers say the pass is not safe.'),
        L('harborgate', 'Harbor Gate', 'gate', .1, .69, 0, 'The way out to the bridge and City Harbor.', ['Dockmaster’s clerk', 'Official (invented)', 'Counts every cask and every mage’s coin.'], 'The harbor bell rings twice at dawn — someone is leaving without a manifest.'),
        L('harbor', 'City Harbor', 'docks', .1, .94, 1, 'The harbor lies on a rocky island joined by a constructed bridge. Trade ships bring goods over the Conqueror’s Sea.', ['Harbormaster Dunstan Rook', 'Harbor official (invented)', 'Smuggles precisely nothing — and knows who does.'], 'An unlisted ship has docked, flying no banner. The crew will speak only to Illuminators.')
      ]
    },
    {
      id: 'silvermere', seed: 'v1', ft: 2, name: 'High Silvermere', short: 'High Silvermere', tag: 'City of Raptors · seat of House Crownguard', ground: '#cdd1c9', view: { cx: 800, cy: 540, sx: 570, sy: 370 }, outside: 'rocks',
      summary: 'A highland city in the crags of northern Demacia, built beside Knight’s Rock and a waterfall. The Crownguard Mansion stands at the foot of the rock; the Raptor Aerie crowns its summit.',
      wall: [[-.7, -.2], [-.55, -.6], [-.1, -.78], [.4, -.7], [.78, -.35], [.85, .15], [.6, .55], [.1, .7], [-.4, .6], [-.75, .3]],
      rivers: [{ pts: [[.78, -1.15], [.72, -.8], [.7, -.5], [.62, -.2], [.48, .1], [.35, .4], [.3, .75], [.38, 1.2]], w: 26 }],
      hills: [{ x: .42, y: -.36, r: 100 }],
      districts: [
        { id: 'heights', n: 'Crownguard Heights', x: .2, y: -.15, style: 'noble', d: 'Mansions at the foot of Knight’s Rock; the Crownguard Mansion dominates the street.' },
        { id: 'roost', n: 'Raptor Roost', x: .5, y: -.45, style: 'military', d: 'Stables, roosts and riders’ barracks beneath the Aerie.' },
        { id: 'terraces', n: 'Crag Terraces', x: -.4, y: -.1, style: 'common', d: 'Terraced homes cut into the hillside, linked by stone stairs.' },
        { id: 'market', n: 'Highland Market', x: -.1, y: .3, style: 'market', d: 'Raptor-feather traders, mountain herbs and cheese.' },
        { id: 'stonecut', n: 'Stonecutters’ Quarter', x: -.5, y: .38, style: 'slum', d: 'Quarry workers’ crowded lanes; resentful of the nobles above.' },
        { id: 'lowgate', n: 'Lowgate Row', x: -.2, y: .55, style: 'common', d: 'Inns and stables near the southern gate.' }
      ],
      nodes: [{ id: 'm1', x: .1, y: -.1 }, { id: 'm2', x: -.1, y: .1 }],
      roads: [['highgate', 'm1', 'main'], ['m1', 'mansion', 'main'], ['mansion', 'aerie', 'lane'], ['m1', 'm2', 'main'], ['m2', 'market', 'main'], ['market', 'lowgate', 'main'], ['market', 'temple', 'lane'], ['m2', 'temple', 'lane'], ['bridge', 'market', 'bridge'], ['aerie', 'stables', 'lane'], ['stables', 'mansion', 'lane'], ['northtower', 'm1', 'lane']],
      landmarks: [
        L('mansion', 'House Crownguard Mansion', 'manor', .24, -.12, 1, 'Seat of House Crownguard, at the foot of Knight’s Rock. Its library holds the “Canticle of the Winged Sisters”, an epic poem about Kayle and Morgana.', ['Lord Remy Crownguard', 'Elder of the house (invented)', 'Stern and kind; will not abandon family or duty.'], 'The Canticle’s last stanza is missing from the library’s copy. The family wants it found quietly.'),
        L('aerie', 'Knight’s Rock & Raptor Aerie', 'aviary', .42, -.4, 1, 'A rock beside a waterfall. Atop it sits the Raptor Aerie — headquarters of the Raptor-Knights and their silverwing mounts.', ['Raptor-Knight Sorrel Ward', 'Aerie captain (invented)', 'Won’t let outsiders near the nests — unless they bring good news.'], 'A clutch of eggs is missing from the highest nest. Only someone who can climb Knight’s Rock could have taken them.'),
        L('falls', 'Silvermere Falls', 'waterfall', .7, -.48, 1, 'Water thunders down beside Knight’s Rock, feeding the river that cuts through the city.', ['Ferryman Tamsin', 'River warden (invented)', 'Says the falls speak on quiet nights.'], 'A body was found beneath the falls — wearing a Vanguard tabard no unit has issued in years.'),
        L('temple', 'Shrine of the Winged Sisters', 'shrine', -.12, .06, 0, 'A small shrine to Kayle and Morgana, with two winged statues. Pilgrims light candles for both.', ['Sister Marguerite', 'Shrine keeper (invented)', 'Quietly keeps a candle lit for Morgana.'], 'The shrine’s statues have been turned to face each other overnight.'),
        L('market', 'Highland Market', 'market', -.1, .32, 0, 'A cramped market of mountain goods, raptor-feather charms and smoked meats.', ['Old Hesk', 'Feather merchant (invented)', 'Sells “lucky” feathers and genuine gossip.'], 'Counterfeit silverwing feathers have flooded the market. The Aerie wants the source.'),
        L('stables', 'Raptor Stables & Feeding Grounds', 'stable', .5, -.1, 0, 'Open-air roosts where raptors are fed and groomed. Young raptors are yellow and blue; adults silver.', ['Wren the stablehand', 'Handler (invented)', 'Whispers that one raptor speaks to him.'], 'A raptor has been poisoned. The culprit knew exactly which feed trough to use.'),
        L('highgate', 'Highland Gate', 'gate', -.75, .3, 0, 'The road south toward the Great City.', ['Gate-sergeant Bryn', 'Guard (invented)', 'Suspicious of anyone not carrying a lantern.'], 'A traveler with a petricite-lined pack asks for a lock-free room.'),
        L('lowgate', 'Lowgate', 'gate', .1, .7, 0, 'The southern gate over the river bridge.', ['Toll-keeper Neve', 'Guard (invented)', 'Collects tolls — and counts how many carry swords.'], 'A merchant with no goods insists on paying a very large toll.'),
        L('bridge', 'Silvermere Bridge', 'tower', .34, .42, 0, 'A broad stone bridge spanning the river, with a watch-tower at its center.', ['Watch-corporal Jory', 'Guard (invented)', 'Bored. Very bored.'], 'Someone has tied silk ribbons to the bridge rails — one for each missing child.'),
        L('northtower', 'North Watchtower', 'tower', -.1, -.75, 0, 'A watchtower looking toward the Freljord frontier.', ['Watch-captain Elric', 'Guard (invented)', 'Reads smoke signals and snowfall.'], 'Beacon fires burn in the north — but not the ones the tower requested.')
      ]
    },
    {
      id: 'dawnhold', seed: 'v1', ft: 2, name: 'Dawnhold', short: 'Dawnhold', tag: 'Coastal fortress-town · Westerley', ground: '#d9d2b8', view: { cx: 800, cy: 540, sx: 580, sy: 370 }, outside: 'fields',
      summary: 'A coastal fortified settlement in the Westerley region. Famous for the Battle of Dawnhold, where Knight Varya of the Dauntless Vanguard burned a Freljordian sea-wolf fleet; her twin Rodion then raided Frostheld.',
      wall: [[-.4, -.65], [.1, -.78], [.62, -.5], [.82, -.02], [.72, .5], [.2, .72], [-.38, .62], [-.55, .25], [-.55, -.3]],
      water: [[[-1.5, -1.3], [-.65, -1.2], [-.58, -.6], [-.66, -.2], [-.4, .0], [-.22, .15], [-.4, .35], [-.64, .5], [-.62, .9], [-1.5, 1.4]]],
      districts: [
        { id: 'keep', n: 'The Keep', x: -.3, y: -.45, style: 'military', d: 'The Dauntless Vanguard garrison and the old fort on the headland.' },
        { id: 'harbor', n: 'Harbor Row', x: -.3, y: .1, style: 'harbor', d: 'Quays, warehouses and fish-smoke along the bay.' },
        { id: 'market', n: 'Tide Market', x: .15, y: .1, style: 'market', d: 'Daily market for catch, rope and rumor.' },
        { id: 'fishers', n: 'Fishers’ Quarter', x: -.1, y: .5, style: 'slum', d: 'Crowded fishing homes; sailors drink here.' },
        { id: 'upper', n: 'Upper Ward', x: .4, y: -.3, style: 'common', d: 'Officers’ homes, the chapel and the magistrate’s hall.' },
        { id: 'south', n: 'Southgate Homes', x: .45, y: .4, style: 'common', d: 'Farmhands and tradesmen from the surrounding hills.' }
      ],
      nodes: [{ id: 'sq', x: .1, y: -.15 }],
      roads: [['landgate', 'sq', 'main'], ['sq', 'keep', 'main'], ['sq', 'quay', 'main'], ['quay', 'boom', 'lane'], ['sq', 'market', 'lane'], ['market', 'garrison', 'lane'], ['sq', 'beacon', 'lane'], ['shrine', 'sq', 'lane']],
      landmarks: [
        L('keep', 'Dawnhold Keep', 'keep', -.3, -.45, 0, 'The old coastal fort. A Dauntless Vanguard garrison held it during the Battle of Dawnhold.', ['Commander Aldous Vane', 'Garrison commander (invented)', 'A veteran who treats the Battle as yesterday.'], 'Someone has signaled the sea from the Keep’s tower at night — in a code no Demacian uses.'),
        L('quay', 'Varya’s Fire Quay', 'docks', -.35, .05, 0, 'The quay where, in tradition, Knight Varya set the sea-wolf fleet ablaze. A black-scorched pier remains untouched as a monument.', ['Old Gannet', 'Fisherman (invented)', 'Swears he saw the fleet burn as a boy.'], 'Charred planks of the old pier were stolen — and hidden aboard a ship leaving tonight.'),
        L('boom', 'Harbor Chain & Boom', 'tower', -.5, -.1, 0, 'A chain stretched across the bay mouth to bar raiders. The winch house is guarded day and night.', ['Winchmaster Bastien', 'Guard (invented)', 'Proud of never losing a link.'], 'The chain failed a test this morning; sabotage or neglect?'),
        L('market', 'Tide Market', 'market', .15, .1, 0, 'Stalls of fish, rope and gossip.', ['Madam Seawright', 'Fishmonger (invented)', 'Knows every captain by their smell.'], 'A fishmonger found a petricite-lined chest in the day’s catch.'),
        L('garrison', 'Vanguard Garrison', 'barracks', .4, .0, 0, 'The Dauntless Vanguard’s barracks, drill yard and armory.', ['Sergeant Raelin', 'Vanguard (invented)', 'Quiet; dislikes noble officers.'], 'The armory’s inventory is off by exactly one ballista bolt per night.'),
        L('shrine', 'Shrine of the Protector', 'shrine', .3, -.35, 0, 'A seafarers’ shrine to Kayle. Sailors leave knotted rope for safe passage.', ['Father Ansel', 'Shrine keeper (invented)', 'Collects fisherfolk’s confessions.'], 'Someone is tying red thread to the shrine at night — a Freljordian custom.'),
        L('beacon', 'Dawn Beacon', 'tower', .1, -.55, 0, 'A tall lighthouse and watch-beacon. A signal fire is lit at the first sign of raiders.', ['Beaconkeeper Tilda', 'Lighthouse keeper (invented)', 'Alone, loud and kind.'], 'The beacon was lit at midnight with no raiders in sight.'),
        L('landgate', 'Land Gate', 'gate', .72, .45, 0, 'The road inland, toward the farmland of Westerley.', ['Gate-sergeant Rook', 'Guard (invented)', 'Likes sailors better than farmers.'], 'A farmer with no cart asks to hire the party to find his missing wagon.')
      ]
    },
    {
      id: 'terbisia', seed: 'v1', ft: 1.5, name: 'Terbisia', short: 'Terbisia', tag: 'Riverside town · Lower Demacia', ground: '#cdd8b0', view: { cx: 800, cy: 540, sx: 520, sy: 340 }, outside: 'fields',
      summary: 'A riverside settlement in Lower Demacia, south of the Greenfang Mountains. Farmers, millers and bargemen sit on the trade route between the mountains and the south.',
      wall: [[-.8, -.3], [-.4, -.6], [.2, -.65], [.7, -.35], [.82, .2], [.4, .6], [-.2, .65], [-.7, .35]],
      rivers: [{ pts: [[-1.3, -.15], [-.7, -.05], [-.2, .1], [.3, .0], [.8, .12], [1.3, .3]], w: 40 }],
      districts: [
        { id: 'mills', n: 'Millside', x: -.5, y: -.2, style: 'common', d: 'Mills along the north bank; the sound of waterwheels is constant.' },
        { id: 'sq', n: 'Square', x: .1, y: -.3, style: 'market', d: 'A market square and the local magistrate’s hall.' },
        { id: 'docks', n: 'Bargers’ Quay', x: .1, y: .35, style: 'harbor', d: 'Barges moor here; a ferry runs across the river.' },
        { id: 'farms', n: 'Farmstead Row', x: .55, y: .1, style: 'common', d: 'Homes of farmers and shepherds.' }
      ],
      nodes: [],
      roads: [['bridge', 'square', 'bridge'], ['square', 'mill', 'main'], ['square', 'chapel', 'lane'], ['bridge', 'quay', 'main'], ['quay', 'inn', 'lane'], ['gate', 'square', 'main']],
      landmarks: [
        L('square', 'Terbisia Square', 'plaza', .1, -.3, 0, 'The town’s market and meeting place.', ['Alderman Corvin', 'Local magistrate (invented)', 'Honest but stubborn.'], 'A missing shipment of grain has split the town in two.'),
        L('mill', 'Old Greenfang Mill', 'mill', -.5, -.2, 0, 'A mill grinding grain from the Greenfang foothills. The owner keeps a secret in the millstone.', ['Miller Odo', 'Miller (invented)', 'Hums when nervous.'], 'The millstone struck something that rang like bronze.'),
        L('chapel', 'Chapel of the Protector', 'shrine', .45, -.4, 0, 'A small chapel to Kayle.', ['Sister Linnet', 'Priest (invented)', 'Sings for lost travelers.'], 'Pilgrims claim the chapel’s bell tolls without a rope.'),
        L('inn', 'The Silver Eel Inn', 'inn', .1, .3, 0, 'A bargers’ inn full of drink and rumor.', ['Innkeeper Maude', 'Publican (invented)', 'Remembers every face; forgets every name.'], 'A stranger leaves a coded ledger in the inn’s lockbox and vanishes.'),
        L('quay', 'Bargers’ Quay', 'docks', .1, .38, 0, 'River barges and the ferry landing.', ['Ferryman Tolly', 'Barge captain (invented)', 'Hates fog.'], 'A barge arrived upriver with all hands asleep.'),
        L('bridge', 'Terbisia Bridge', 'tower', .1, .05, 0, 'The only stone bridge for ten miles.', ['Toll-keeper Sark', 'Guard (invented)', 'Dislikes strangers on principle.'], 'The bridge toll has been doubled with no decree.'),
        L('gate', 'North Gate', 'gate', -.2, -.62, 0, 'The road to the Greenfang Mountains.', ['Gate-watch Pip', 'Guard (invented)', 'Never leaves his post.'], 'A convoy’s guards refuse to enter the town at night.')
      ]
    },
    {
      id: 'fossbarrow', seed: 'v1', ft: 1.5, name: 'Fossbarrow', short: 'Fossbarrow', tag: 'Far-northern border town', ground: '#e0e8ee', view: { cx: 800, cy: 540, sx: 520, sy: 340 }, outside: 'snow',
      summary: 'A far-northern town on the Freljord frontier. Cold, quiet and watchful; its palisade has withstood raids for generations.',
      wall: [[-.7, -.4], [-.2, -.7], [.4, -.65], [.8, -.2], [.75, .35], [.2, .65], [-.45, .6], [-.8, .15]],
      districts: [
        { id: 'sq', n: 'Frostgate Square', x: 0, y: -.1, style: 'market', d: 'A small square with a well and a notice board.' },
        { id: 'watch', n: 'Watch Quarter', x: -.4, y: -.3, style: 'military', d: 'Border guards’ barracks and watchtowers.' },
        { id: 'homes', n: 'Hearthside', x: .4, y: .2, style: 'common', d: 'Homes with deep porches and thick roofs.' },
        { id: 'hunters', n: 'Hunters’ Row', x: -.3, y: .35, style: 'slum', d: 'Trappers and hunters live crowded together.' }
      ],
      nodes: [],
      roads: [['gate', 'square', 'main'], ['square', 'watch', 'main'], ['square', 'hall', 'lane'], ['square', 'chapel', 'lane'], ['square', 'lodge', 'lane']],
      landmarks: [
        L('square', 'Frostgate Square', 'plaza', 0, -.1, 0, 'A snow-packed square with a well and a notice board.', ['Reeve Halvard', 'Town reeve (invented)', 'Gruff but fair.'], 'The well froze solid overnight — in the middle of a mild week.'),
        L('watch', 'Border Watch', 'barracks', -.4, -.3, 0, 'The Demacian border garrison, facing north.', ['Captain Jora', 'Watch captain (invented)', 'Reads Freljord tracks like a book.'], 'A patrol returned with frostbitten hands and no reports.'),
        L('hall', 'Longhall', 'hall', .25, -.25, 0, 'Town hall and meeting place.', ['Alderwoman Sigrun', 'Elder (invented)', 'Stubborn about no-one leaving.'], 'A dozen Freljordian refugees ask for shelter. The garrison says no.'),
        L('chapel', 'Hearth Chapel', 'shrine', .5, -.05, 0, 'A small, thick-walled chapel with a perpetual fire.', ['Brother Osk', 'Priest (invented)', 'Keeps the fire burning all night.'], 'The chapel’s fire has burned blue since dawn.'),
        L('lodge', 'Hunters’ Lodge', 'inn', -.3, .35, 0, 'A lodge full of furs and old trophies.', ['Master-hunter Dagny', 'Hunter (invented)', 'Wolves fear her.'], 'The hunters bring a wolf that’s clearly something more.'),
        L('gate', 'Frostgate', 'gate', .2, -.68, 0, 'The northern gate to the Freljord.', ['Gate-guard Finn', 'Guard (invented)', 'Hates the cold.'], 'Tracks lead to the gate from the north — and none lead away.')
      ]
    },
    {
      id: 'meltridge', seed: 'v1', ft: 1.5, name: 'Meltridge', short: 'Meltridge', tag: 'Eastern foothills town · Greenfang', ground: '#d6cfb8', view: { cx: 800, cy: 540, sx: 520, sy: 340 }, outside: 'rocks',
      summary: 'An eastern Demacian settlement in the Greenfang foothills, near the Custodian Wall. Site of a tense diplomatic convoy incident with Arbormark.',
      wall: [[-.75, -.2], [-.4, -.62], [.2, -.7], [.72, -.38], [.82, .15], [.5, .6], [-.1, .68], [-.65, .4]],
      districts: [
        { id: 'sq', n: 'Convoy Square', x: 0, y: -.1, style: 'market', d: 'Merchants and diplomats pass through the central square.' },
        { id: 'fort', n: 'Wallward', x: .45, y: -.35, style: 'military', d: 'Troops stationed for the Custodian Wall.' },
        { id: 'terrace', n: 'Terraced Rows', x: -.45, y: -.05, style: 'common', d: 'Homes set into the foothill terraces.' },
        { id: 'mine', n: 'Miners’ Quarter', x: -.2, y: .4, style: 'slum', d: 'Miners and quarry-workers; stone dust lingers.' }
      ],
      nodes: [],
      roads: [['gate', 'square', 'main'], ['square', 'hall', 'lane'], ['square', 'inn', 'lane'], ['square', 'wallroad', 'main'], ['inn', 'shrine', 'lane']],
      landmarks: [
        L('square', 'Convoy Square', 'plaza', 0, -.1, 0, 'Where merchants, diplomats and soldiers cross paths.', ['Guild-reeve Odrin', 'Trade official (invented)', 'Unflappable.'], 'A diplomatic convoy from Arbormark was seized in the square — by whom?'),
        L('hall', 'Magistrate’s Hall', 'hall', .3, .1, 0, 'The magistrate’s hall and archive.', ['Magistrate Anwen', 'Official (invented)', 'Nervous about the convoy inquiry.'], 'The convoy records in the archive have been rewritten.'),
        L('inn', 'The Convoy’s Rest', 'inn', -.2, .2, 0, 'A busy inn where convoy guards and diplomats mingle.', ['Innkeeper Rurik', 'Publican (invented)', 'Hears everything.'], 'A diplomat’s aide begs the party to carry a letter out of town.'),
        L('shrine', 'Roadside Shrine', 'shrine', -.45, .15, 0, 'A shrine to Ornn for miners and masons.', ['Sister Brenna', 'Shrine keeper (invented)', 'Quietly funds the miners.'], 'The shrine’s hammer-statue has been reforged overnight.'),
        L('wallroad', 'Custodian Wall Road', 'tower', .6, -.5, 1, 'The road to the Custodian Wall, a line of linked fortresses guarding the eastern border above Greenfang Pass.', ['Wall-warden Sten', 'Fortress officer (invented)', 'Hates paperwork.'], 'Beacon signals from the Wall contradict one another.'),
        L('gate', 'West Gate', 'gate', -.4, -.6, 0, 'The road west to the Great City.', ['Gate-sergeant Mira', 'Guard (invented)', 'Fair but cautious.'], 'A lone rider with a Noxian cloak asks for hospitality.')
      ]
    }
  ];

  // ---------------------------------------------------------------- battle scenarios
  RT.DEMACIA_BATTLES = [
    { id: 'cloudwoods', seed: 'v1', features: ["Dirt road: 15 ft wide, runs west to east.", "Stream: 10 ft wide; stone bridge: 15 ft wide (3 squares) — a chokepoint.", "Broken wagon (10×5 ft) with crates blocks the road; half cover.", "Trees: trunk blocks movement, canopy gives half cover. Forest floor hides tracks.", "Roadside statue: three-quarters cover."], name: 'Cloudwoods Road Ambush', tag: 'Lower Demacia · forest road', desc: 'A narrow dirt road through the Cloudwoods. A broken cart blocks the way. A stream and a stone bridge split the field in two.', },
    { id: 'custodian', seed: 'v1', features: ["Wall: 15 ft thick (3 squares), walkway on top is 10 ft above ground and reached by stairs only.", "Gate: 20 ft wide (4 squares), winch-operated.", "Towers at each end of the wall: arrow slits give three-quarters cover.", "Two ballistae on the rampart: 3d10 piercing, range 120/480 ft.", "North side: rocky scree and boulders; south side: cobbled yard, two 35×25 ft buildings.", "Outer edges: sheer drop."], name: 'Custodian Wall at Greenfang Pass', tag: 'Eastern border · fortress', desc: 'A line of linked bastions across Greenfang Pass. North: the rocky approach. South: the Demacian yard, barracks and ballistae.', },
    { id: 'plaza', seed: 'v1', features: ["Grand Plaza: marble, about 70×60 ft, with a 10×10 ft fountain.", "Main streets: 20–30 ft wide (4–6 squares) in four directions; alleys: 5 ft.", "Market stalls: half cover, can be overturned.", "Buildings: impassable from outside; doors open onto the plaza and streets.", "Marble floor is slippery when running: Stealth is noisy."], name: 'Great City Plaza Skirmish', tag: 'Great City · riot', desc: 'The marble Grand Plaza, ringed by townhouses and market stalls. Streets feed in from every direction.', },
    { id: 'mageseekers', seed: 'v1', features: ["Petricite floor throughout: magic is dampened (suggested house rule: disadvantage on spellcasting; low-level spells fail).", "Cells: 25×30 ft with iron bars (door 5 ft). Cell bars: see-through, half cover from ranged.", "Central hall: 40 ft wide; guard station in the middle; pillars every 30 ft.", "Arcane Registry (east): shelves topple for 2d6 damage.", "West gate: 10 ft wide, the only way out."], name: 'Mageseekers Complex — Petricite Cells', tag: 'Great City · prison break', desc: 'A petricite prison: cells on both sides of a long hall, a guard station in the middle and the Arcane Registry at the east end.', },
    { id: 'dawnhold', seed: 'v1', features: ["Fortress wall along the north, 10 ft thick, with a 20 ft gate.", "Three piers, each 10 ft wide; moored ships about 15×35 ft with a mast.", "Warehouses: two large (35×25 ft) and one small; crates and barrels give half cover.", "Shore: sand strip (difficult for wheels); shallow water then deep water.", "Fountain in the yard: 10×10 ft."], name: 'Dawnhold Harbor Raid', tag: 'Westerley coast · naval', desc: 'A cobbled harbor with three piers, moored ships and warehouses. The fortress wall runs along the north.', },
    { id: 'manor', seed: 'v1', features: ["Manor house: 100×30 ft, grand doors 10 ft wide, marble terrace with pillars.", "Garden walls: 5 ft thick; gate at the south, 20 ft wide.", "Hedge rooms: hedges give half cover and are difficult terrain.", "Central fountain: 10×10 ft; statues give three-quarters cover.", "Flower beds are open ground; the host will not be pleased."], name: 'Noble Manor Gala', tag: 'Great City · intrigue', desc: 'A walled manor garden with a fountain, hedge rooms and a grand terrace. A gala is underway; an assassination is imminent.', },
    { id: 'aerie', seed: 'v1', features: ["Roost hall: 50×30 ft with pillared ring and a 10 ft door.", "Bridges: 5–10 ft wide, stone; low parapets.", "Nests: difficult terrain; eggs and parents nearby.", "Edge of the crag: sheer drop (60 ft+), strong wind.", "East waterfall: impassable and drenches those next to it."], name: 'Silverwing Aerie Cliffs', tag: 'High Silvermere · crag', desc: 'A windswept plateau atop a crag with a roost hall, nests, narrow stone bridges and a sheer drop on every side.', }
  ];
})(window.RT);
