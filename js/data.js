/* Runeterra Atlas — world data. Lore is paraphrased/adapted for tabletop use; edit freely. */
window.RT = window.RT || {};
(function (RT) {
  const P = {
    A: [300, 60], B: [700, 40], C: [1060, 70], D: [380, 190], E: [600, 215], F: [800, 230], G: [980, 210],
    H: [640, 400], I: [600, 540], J: [470, 560], K: [360, 430], L: [330, 300], N: [1000, 360], O: [930, 500],
    P: [760, 520], Q: [1090, 330], R: [1110, 420], T: [990, 430], U: [1090, 520], V: [1000, 540],
    W: [980, 700], X: [780, 780], Y: [620, 700], Z1: [1250, 600], Z2: [1300, 780], Z3: [1100, 860],
    AA: [1450, 560], AB: [1500, 740]
  };
  const poly = ids => ids.split(' ').map(k => P[k]);

  RT.REGIONS = [
    { id: 'freljord', name: 'Freljord', color: '#bcd7e6', ctrl: poly('A B C G F E D'), rough: 0.55, culture: 'frel', biome: 'tundra', threat: 4,
      gov: 'Three warring tribes', tag: 'Frozen north · tribal · ancient magic',
      lore: 'A land of endless winter where the Avarosan, Winter’s Claw and Frostguard vie for the north. Iceborn spirits, Ice Witches and the Watchers of old magic stir beneath the glaciers.',
      enc: ['Avarosan ski-scouts demand a toll to cross their pass', 'Winter’s Claw raiders ambush a lone caravan — will the party intervene?', 'Whiteout blizzard: DC 14 Survival or lose a day of rations', 'A frost-drake nests in a glacier cave littered with Iceborn relics', 'A wandering Ice Witch trades warmth-runes for a secret', 'A cryophoenix egg thaws in a snowdrift; cultists and hunters both want it'],
      npcs: [['Jarl Hrefna Stonebrow', 'Avarosan warmother', 'Wary of outsiders; respects strength and honesty.'], ['Brakk the Rimeguide', 'Hired scout', 'Knows every pass — and secretly owes Winter’s Claw a debt.'], ['Sister Eira', 'Frostguard healer', 'Hides a shard of Iceborn magic in her staff.']],
      hooks: ['A sealed Iceborn tomb has begun to hum with blue light.', 'The Frostguard needs escorts for a supply convoy through the Howling Marsh.', 'A child swears the glacier spoke her name last night.'],
      icons: { pine: 5, mountain: 2.4, hill: 1 } },
    { id: 'demacia', name: 'Demacia', color: '#e6d9a0', ctrl: poly('D E H I J K L'), rough: 0.5, culture: 'dem', biome: 'temperate', threat: 2,
      gov: 'Monarchy of the Jarvans', tag: 'Kingdom of valor · petricite · mage-suspicion',
      lore: 'A proud, walled kingdom of white stone and gold banners, devoted to justice and fear of unchecked magic. The Dauntless Vanguard patrols; the Mageseekers hunt the arcane.',
      enc: ['Vanguard checkpoint demands papers and a petricite scan', 'Pilgrims en route to the Great City need an escort', 'A rogue Mageseeker detachment raids a farmstead', 'A knight of House Lightshield seeks aid for a stolen heirloom', 'Silverwing riders race overhead, chasing something in the treeline', 'A hedge-mage, hiding in a barn, begs the party for passage north'],
      npcs: [['Captain Aldric Vaelor', 'Dauntless Vanguard', 'Principled and rigid; bends the law only for children.'], ['Mother Oriel', 'Temple of Valor priest', 'Quietly shelters mage refugees.'], ['Fenwick Hale', 'Great City merchant', 'Sells spirit-silk, buys rumors.']],
      hooks: ['Someone is forging petricite writs of passage.', 'A noble house hides a sorcerer child in its cellar.', 'The border road north has fallen silent.'],
      icons: { tree: 4, hill: 2, pine: 1, mountain: 0.6 } },
    { id: 'noxus', name: 'Noxus', color: '#d49a8f', ctrl: poly('E F G N T O P I H'), rough: 0.5, culture: 'nox', biome: 'temperate', threat: 5,
      gov: 'Grand General & Trifarian Council', tag: 'Empire of strength · war machine · meritocracy',
      lore: 'A ruthless meritocratic empire that welcomes any who prove their strength. The Immortal Bastion looms over a land of garrison cities, gladiators and scheming generals.',
      enc: ['A Legion column marches through, recruiting by force', 'A gladiatorial challenge: win a duel or lose standing', 'Black Rose cabal agent tails the party', 'Noxian tax collectors and their mercenary escort', 'Trifarian Council inquiry: “Who sent you?”', 'Bandit warband — former soldiers flying the broken banner'],
      npcs: [['General Verrick Draal', 'Legion commander', 'Values results, not loyalty. Will absorb a useful party.'], ['Lysa Thorne', 'Black Rose mage', 'Elegant, always three moves ahead.'], ['“Ironjaw” Bek', 'Arena champion', 'Wants a rival worthy of a title fight.']],
      hooks: ['A promotion tribunal turns up a traitor — but whose?', 'The Bastion mints a new blade-order; someone has stolen the design.', 'A warband demands a hundred lives or a hundred coin.'],
      icons: { tree: 2, hill: 2, mountain: 1.4, pine: 1 } },
    { id: 'piltover', name: 'Piltover', color: '#b9c9dd', ctrl: poly('N Q R T'), rough: 0.4, culture: 'pil', biome: 'urban', threat: 1,
      gov: 'Council of Piltover', tag: 'City of progress · hextech · merchant princes',
      lore: 'A gleaming coastal city of brass and glass where hextech inventors and merchant houses shape the future. Its prosperity rests, uneasily, on the shoulders of Zaun below.',
      enc: ['A hextech prototype malfunctions mid-demonstration', 'Enforcer patrol investigates the party’s cargo', 'An Academy student offers to sell stolen schematics', 'Dockside smuggling: Zaunite crates, Piltovan seals', 'A merchant prince hires discreet guards', 'A rival inventor’s sabotage attempt in progress'],
      npcs: [['Councilor Mara Veyne', 'Council member', 'Champion of reform, owner of hidden debts.'], ['Inspector Tavi Holt', 'Enforcer', 'Incorruptible; hates Zaun smuggling.'], ['Dr. Pell Quickhands', 'Inventor', 'Brilliant, reckless, perpetually broke.']],
      hooks: ['A hex-core from the Academy has gone missing.', 'The Clasp market shut down overnight — no one will say why.', 'Someone is shipping hextech to the Noxian front.'],
      icons: { bldg: 4, tree: 1 } },
    { id: 'zaun', name: 'Zaun', color: '#a9c79a', ctrl: poly('T R U V O'), rough: 0.45, culture: 'pil', biome: 'urban', threat: 4,
      gov: 'Chem-Barons', tag: 'The undercity · chemtech · desperate ingenuity',
      lore: 'A sunless warren of pipes, vents and neon smog beneath and beside Piltover. Chem-barons rule; shimmer reshapes bodies; invention and ruin walk hand-in-hand.',
      enc: ['Chem-baron enforcers “tax” the party for passing through', 'A shimmer-mutated beast tears out of a vent', 'A chem-leak turns the street into a hazard zone (DC 13 Con)', 'Firelight rebels need hands for a heist', 'A street kid offers a shortcut — for a price', 'Black-market surgeon “improves” a stolen limb'],
      npcs: [['Madame Vesper Quill', 'Chem-baron', 'Smiling, patient, deadly generous.'], ['Rook', 'Street fixer', 'Knows where everyone sleeps. Works for whoever pays last.'], ['Dr. Ilex Marrow', 'Rogue chemist', 'Needs a living test subject — voluntarily, ideally.']],
      hooks: ['A cure for shimmer exists — and the barons are killing to bury it.', 'The vents are breathing wrong.', 'A Piltovan heir vanished in the Sump.'],
      icons: { bldg: 4, dead: 1.2 } },
    { id: 'targon', name: 'Targon', color: '#cbb6dd', ctrl: poly('I P O V W X Y'), rough: 0.55, culture: 'tar', biome: 'highland', threat: 3,
      gov: 'Solari & Lunari orders', tag: 'The Mountain Touching the Heavens · celestial Aspects',
      lore: 'The tallest mountain on Runeterra, where mortals climb to be chosen by celestial Aspects. The Solari and Lunari orders compete in faith and fury at its feet.',
      enc: ['Solari pilgrims singing a dawn hymn — and watching for heretics', 'Lunari moon-ritual in a high pass; trespass is forbidden', 'A star-touched wanderer speaks in prophecy', 'Avalanche: DC 15 Dex or be swept down 30 ft', 'A trial of the Aspects — a challenger needs witnesses', 'Celestial echo: a shard of starlight takes the form of a beast'],
      npcs: [['Elder Sol-Maren', 'Solari priestess', 'Believes the party is part of a prophecy.'], ['Kaelis the Pale', 'Lunari seer', 'Speaks only in riddles; usually right.'], ['Tobb Ironclimb', 'Mountain guide', 'Has seen the summit — and refuses to say what’s there.']],
      hooks: ['A star fell into a village granary and still glows.', 'A pilgrim returned from the summit with someone else’s memories.', 'The Solari and Lunari both claim the same relic.'],
      icons: { mountain: 6, hill: 1, pine: 0.6, crystal: 1 } },
    { id: 'shurima', name: 'Shurima', color: '#e5c27f', ctrl: poly('V U Z1 Z2 Z3 W'), rough: 0.55, culture: 'shu', biome: 'desert', threat: 4,
      gov: 'Fallen empire; Ascended remnants', tag: 'Buried sun-empire · desert · Ascended',
      lore: 'A vast desert once ruled by the radiant Ascended Emperors. Sun-scorched ruins, buried vaults and the Sun Disc still draw the ambitious, the faithful and the Void.',
      enc: ['A nomad caravan offers water for news', 'Sand-wraiths rise around a half-buried obelisk', 'Tomb-robbers fighting over a newly opened vault', 'Sandstorm: DC 14 Con or 1 exhaustion level', 'An Ascended guardian demands the proper rites', 'A Void-touched creature burrows beneath the dunes'],
      npcs: [['Imani Sunseeker', 'Nomad guide', 'Reads the stars; avoids Icathia’s edge.'], ['Khet-Ammon', 'Tomb scholar', 'Obsessed with the Sun Disc’s true location.'], ['Veiled Warden', 'Ascended remnant', 'Speaks for a dead emperor.']],
      hooks: ['A buried vault has opened itself.', 'The oasis wells are tasting of salt and static.', 'A prince in exile claims the Sun Disc’s throne.'],
      icons: { dune: 6, hill: 1, mountain: 1, cactus: 1.2, ruin: 0.6 } },
    { id: 'ixtal', name: 'Ixtal', color: '#9fcf94', ctrl: poly('Z1 AA AB Z2'), rough: 0.55, culture: 'ixt', biome: 'jungle', threat: 3,
      gov: 'Yun Tal elementalist sages', tag: 'Hidden jungle · elemental magic · secretive',
      lore: 'A hidden jungle-nation mastering five elements of magic and hostile to outsiders. Its cities rise through the canopy, and its wardens read the land like scripture.',
      enc: ['Ixaocan wardens silently shadow the party', 'Jungle trap: DC 14 Perception or Dex save', 'An elemental-rite spills fire into a clearing', 'A vastayan scout asks questions and gives few answers', 'Giant spiders spin across a half-seen ruin', 'A shaman’s wild-magic storm pushes the party off-path'],
      npcs: [['Yun Tal Sage Ixara', 'Elementalist', 'Offers aid if the party sever ties with outside powers.'], ['Tecuan', 'Jungle warden', 'Wants proof the party is no threat.'], ['Nahua', 'Vastayan hunter', 'Fascinated by city-folk.']],
      hooks: ['An outsider has entered the heart of Ixtal and is not leaving.', 'The jungle is growing outward toward Shurima.', 'A sage-rival sells elemental secrets abroad.'],
      icons: { palm: 5, tree: 4, hill: 1, ruin: 0.5 } },
    { id: 'ionia', name: 'Ionia', color: '#e7b6cf', ctrl: [[1250, 180], [1450, 150], [1500, 330], [1380, 440], [1230, 380]], rough: 0.8, culture: 'ion', biome: 'spirit', threat: 2,
      gov: 'Navori, Placidium & Kinkou orders', tag: 'Spirit realm · balance · monasteries',
      lore: 'An island chain of blossoming forests and spirit-touched shrines where harmony is a way of life. Scars from Noxian occupation linger as the Spirit Realm bleeds into the world.',
      enc: ['Cherry-blossom spirits test the party’s intentions', 'A Kinkou envoy requests a favor in the name of balance', 'Wuju-trained disciples spar; join or watch?', 'A stray Noxian veteran tries to disappear into the mist', 'The Spirit Realm briefly overlaps — time moves strangely', 'A vastayan child leads the party to a hidden waterfall shrine'],
      npcs: [['Master Hanae', 'Wuju instructor', 'Teaches that restraint is the sharpest blade.'], ['Ren of the Kinkou', 'Order of Shadow envoy', 'Smiles; clearly knows more than he says.'], ['Akiko', 'Placidium merchant', 'Remembers every grievance.']],
      hooks: ['A spirit has attached itself to an ordinary teapot.', 'A shrine’s bell tolls though it has no clapper.', 'Noxian relics are surfacing in the temple vaults.'],
      icons: { tree: 5, hill: 2, mountain: 1.4 } },
    { id: 'bilgewater', name: 'Bilgewater', color: '#d9a073', ctrl: [[1350, 850], [1500, 830], [1540, 930], [1400, 970], [1320, 930]], rough: 0.8, culture: 'bil', biome: 'archipelago', threat: 4,
      gov: 'Captains’ council (informal)', tag: 'Port of pirates · monster-hunters · lawless',
      lore: 'A raucous harbor city built on wrecks, where captains, hunters and smugglers jostle on every dock. The Serpent Isles teem with sea monsters and buried gold.',
      enc: ['Press gang tries to “recruit” a crewmember', 'Gangplank’s thugs demand protection money', 'A sea serpent cruises close to shore', 'A tavern brawl about to turn deadly', 'Black-market haggle on Slaughter Dock', 'A treasure-map vendor with suspiciously fresh ink'],
      npcs: [['Captain Dahlia Ironhook', 'Pirate captain', 'Rough and honest, like her ship.'], ['Mags', 'Dockside fixer', 'Everything has a price, everyone has a debt.'], ['Old Pyke', 'Monster-hunter', 'Keeps a kraken tooth around his neck.']],
      hooks: ['A ship drifts into port with its crew vanished.', 'Someone is selling fake Buccaneer’s Bounty charts.', 'A leviathan carcass washed ashore is full of coins.'],
      icons: { palm: 3, hill: 1.5, ruin: 0.6 } },
    { id: 'shadow', name: 'Shadow Isles', color: '#8fb1a6', ctrl: [[120, 640], [260, 610], [320, 720], [230, 800], [110, 760]], rough: 0.8, culture: 'shad', biome: 'blighted', threat: 5,
      gov: 'None — the Ruined King’s court', tag: 'Black Mist · undead · ruin',
      lore: 'Once a kingdom, now an isle drowned in the Black Mist where the dead refuse to rest. Every harrowing carries the Mist further across the sea.',
      enc: ['Black Mist rolls in — DC 15 Wis or flee in fear', 'A wraith-knight guarding a ruined shrine', 'A lantern-bearer offers to “lighten your burden”', 'Ghostly ship runs aground with a dead crew still at the oars', 'A survivor, half-Mist, begs for mercy or murder', 'The dead rise and march toward the sea'],
      npcs: [['Wren the Mistbound', 'Survivor', 'Guides the party — and wants to leave.'], ['The Hollow Knight', 'Wraith champion', 'Serves a king he cannot remember.'], ['Lamp-Keeper', 'Lantern spirit', 'Trades souls for passage.']],
      hooks: ['A harrowing is approaching a coastal town.', 'A ship’s captain swears he left a living crew behind.', 'Someone wants a relic from the Ruined Court.'],
      icons: { dead: 5, mountain: 1, ruin: 1.4 } },
    { id: 'bandle', name: 'Bandle City', color: '#c9e0a1', ctrl: [[110, 360], [190, 340], [220, 420], [140, 460]], rough: 0.7, culture: 'yor', biome: 'whimsy', threat: 2,
      gov: 'Yordle Council', tag: 'Hidden yordle land · whimsy · portals',
      lore: 'A hidden realm of yordles, reachable only through magic portals or a favorable moon. Cheerful chaos conceals deep craft and unexpected power.',
      enc: ['A yordle prank turns the party’s boots into sentient poros', 'A tinkerer’s experiment on the loose', 'Poro stampede', 'Council envoy tests the party’s manners', 'A portal flickers open somewhere inconvenient', 'A fairly-honest game of chance with fairly-dishonest stakes'],
      npcs: [['Pip Nettlesprocket', 'Tinkerer', 'Invents things best left uninvented.'], ['Granny Moss', 'Council elder', 'Sees everything, says little.'], ['Fizzwick', 'Prankster', 'Currently invisible; maybe.']],
      hooks: ['A portal is stuck open over a Demacian farm.', 'Someone’s stolen the Council’s moon-key.', 'The poros have started speaking in sentences.'],
      icons: { tree: 5, hill: 2, shroom: 2 } }
  ];

  RT.POIS = [
    // id, region, name, type, x, y, minor?
    ['frostguard', 'freljord', 'Frostguard Citadel', 'fortress', 680, 115],
    ['avarosa', 'freljord', 'Avarosan Longhall', 'city', 560, 100],
    ['howling', 'freljord', 'Howling Marsh', 'landmark', 470, 150],
    ['claw', 'freljord', 'Winter’s Claw Camp', 'camp', 880, 130, 1],
    ['demacia', 'demacia', 'Demacia — The Great City', 'city', 480, 425],
    ['dauntless', 'demacia', 'Fort Dauntless', 'fortress', 470, 300],
    ['dawnwatch', 'demacia', 'Port Dawnwatch', 'port', 385, 370, 1],
    ['petricite', 'demacia', 'Petricite Quarry', 'landmark', 540, 500, 1],
    ['noxus', 'noxus', 'Noxus — The Immortal Bastion', 'city', 810, 380],
    ['basilich', 'noxus', 'Basilich', 'city', 730, 300],
    ['gravelhold', 'noxus', 'Fort Gravelhold', 'fortress', 900, 330, 1],
    ['trifarix', 'noxus', 'Trifarix Barracks', 'camp', 850, 465, 1],
    ['piltover', 'piltover', 'Piltover', 'city', 1050, 385],
    ['academy', 'piltover', 'Hextech Academy', 'landmark', 1040, 400, 1],
    ['zaun', 'zaun', 'Zaun', 'city', 1030, 480],
    ['sump', 'zaun', 'The Sump', 'cave', 1060, 512, 1],
    ['targon', 'targon', 'Mount Targon', 'landmark', 800, 650],
    ['solari', 'targon', 'Solari Temple', 'shrine', 730, 585],
    ['lunari', 'targon', 'Lunari Moon Shrine', 'shrine', 900, 620, 1],
    ['shurima', 'shurima', 'Shurima — The Sun Throne', 'ruin', 1130, 720],
    ['nashramae', 'shurima', 'Nashramae', 'ruin', 1200, 650, 1],
    ['icathia', 'shurima', 'Icathian Rift', 'landmark', 1160, 800, 1],
    ['ixtal', 'ixtal', 'Ixtal', 'city', 1385, 655],
    ['heartgrove', 'ixtal', 'Ixaocan Heartgrove', 'shrine', 1430, 620, 1],
    ['placidium', 'ionia', 'Placidium', 'city', 1380, 280],
    ['navori', 'ionia', 'Navori Shrine', 'shrine', 1310, 235, 1],
    ['wuju', 'ionia', 'Wuju Monastery', 'fortress', 1395, 365, 1],
    ['bilgewater', 'bilgewater', 'Bilgewater', 'port', 1450, 892],
    ['slaughter', 'bilgewater', 'Slaughter Dock', 'port', 1400, 860, 1],
    ['camavor', 'shadow', 'Camavor Ruins', 'ruin', 205, 695],
    ['harrowing', 'shadow', 'Harrowing Shore', 'cave', 160, 725, 1],
    ['bandle', 'bandle', 'Bandle City', 'city', 160, 400]
  ].map(a => ({ id: a[0], region: a[1], name: a[2], type: a[3], x: a[4], y: a[5], minor: !!a[6] }));

  // [from, to, kind]
  RT.ROUTES = [
    ['demacia', 'noxus', 'road'], ['noxus', 'piltover', 'road'], ['piltover', 'zaun', 'road'], ['noxus', 'basilich', 'road'],
    ['demacia', 'dauntless', 'road'], ['dauntless', 'avarosa', 'road'], ['avarosa', 'frostguard', 'road'], ['basilich', 'frostguard', 'road'],
    ['noxus', 'targon', 'road'], ['targon', 'shurima', 'road'], ['zaun', 'shurima', 'road'], ['shurima', 'ixtal', 'road'],
    ['piltover', 'placidium', 'sea'], ['zaun', 'bilgewater', 'sea'], ['bilgewater', 'ixtal', 'sea'], ['dawnwatch', 'bandle', 'sea'],
    ['dawnwatch', 'camavor', 'sea'], ['placidium', 'bilgewater', 'sea']
  ];

  RT.CULTURES = {
    dem: { f: ['Lyra', 'Garen', 'Cedric', 'Elara', 'Marek', 'Isolde'], l: ['Vale', 'Crown', 'Lightshield', 'Brightmoor', 'Hale', 'Dunmere'], p: ['Dun', 'Silver', 'Vale', 'Crown', 'Bright', 'Fair'], s: ['guard', 'wick', 'hold', 'moor', 'ford', 'crest'] },
    nox: { f: ['Drax', 'Kassia', 'Vorn', 'Selene', 'Rhogar', 'Talya'], l: ['Draal', 'Kovar', 'Blackthorn', 'Sarn', 'Vex', 'Maul'], p: ['Kar', 'Dread', 'Iron', 'Blood', 'Rok', 'Bas'], s: ['hold', 'rund', 'gate', 'lich', 'burg', 'spire'] },
    frel: { f: ['Hrefna', 'Brakk', 'Sigrun', 'Torvald', 'Ylva', 'Gunnar'], l: ['Stonebrow', 'Icefang', 'Rimehelm', 'Snowmane', 'Bearsbane', 'Frostborn'], p: ['Frost', 'Rime', 'Ice', 'Wolf', 'Bear', 'Snow'], s: ['fang', 'haven', 'hold', 'march', 'peak', 'fall'] },
    ion: { f: ['Hanae', 'Ren', 'Akiko', 'Daichi', 'Sora', 'Kaito'], l: ['Shirou', 'Kazan', 'Minamoto', 'Aoi', 'Tsuki', 'Hayashi'], p: ['Navo', 'Plac', 'Shi', 'Koto', 'Ama', 'Yuki'], s: ['ri', 'dium', 'mori', 'wa', 'kai', 'no'] },
    pil: { f: ['Mara', 'Tavi', 'Pell', 'Iris', 'Corin', 'Lenna'], l: ['Veyne', 'Holt', 'Quickhands', 'Brassgate', 'Kiran', 'Sprocket'], p: ['Brass', 'Hex', 'Gear', 'Sump', 'Iron', 'Glass'], s: ['gate', 'works', 'row', 'span', 'dock', 'vent'] },
    tar: { f: ['Sol', 'Kaelis', 'Maren', 'Tobb', 'Ilyra', 'Zeth'], l: ['Ironclimb', 'Dawnbearer', 'Moonvale', 'Starfall', 'Highstep', 'Aurel'], p: ['Sol', 'Luna', 'Star', 'High', 'Dawn', 'Peak'], s: ['rest', 'step', 'spire', 'temple', 'fall', 'crown'] },
    shu: { f: ['Imani', 'Khet', 'Nasira', 'Azim', 'Taharqa', 'Ammon'], l: ['Sunseeker', 'Ammon', 'Zahir', 'Ra-Set', 'Dunewalker', 'Khemet'], p: ['Nash', 'Ra', 'Sun', 'Sand', 'Kha', 'Tal'], s: ['ramae', 'set', 'oasis', 'step', 'khem', 'dune'] },
    ixt: { f: ['Ixara', 'Tecuan', 'Nahua', 'Citlali', 'Xoc', 'Yaotl'], l: ['Yun-Tal', 'Ixaoc', 'Quetz', 'Tlaloc', 'Cuauh', 'Mixco'], p: ['Ix', 'Cuaz', 'Yun', 'Tlal', 'Oc', 'Naho'], s: ['tal', 'oc', 'tlan', 'coa', 'pan', 'tlah'] },
    bil: { f: ['Dahlia', 'Mags', 'Pyke', 'Hogan', 'Sable', 'Jory'], l: ['Ironhook', 'Redtide', 'Barnacle', 'Cutlass', 'Grimm', 'Saltlash'], p: ['Salt', 'Rust', 'Bilge', 'Hook', 'Gull', 'Rum'], s: ['dock', 'cove', 'wreck', 'point', 'reef', 'mast'] },
    shad: { f: ['Wren', 'Maldric', 'Isra', 'Hollis', 'Vesna', 'Corvin'], l: ['Mistbound', 'Hollow', 'Greywake', 'Ashen', 'Gloam', 'Blackmere'], p: ['Grey', 'Gloam', 'Wraith', 'Ash', 'Mourn', 'Hollow'], s: ['wake', 'mere', 'toll', 'barrow', 'reach', 'hall'] },
    yor: { f: ['Pip', 'Fizzwick', 'Moss', 'Tinkle', 'Bumble', 'Nib'], l: ['Nettlesprocket', 'Wobblethorn', 'Puddlefoot', 'Quibble', 'Snickerdoodle', 'Tumbleweed'], p: ['Bum', 'Fizz', 'Poro', 'Moss', 'Whim', 'Tum'], s: ['ble', 'wick', 'toot', 'bell', 'nook', 'pop'] }
  };

  RT.HOOK = {
    patron: ['a nervous merchant', 'a retired soldier', 'a masked emissary', 'a village elder', 'a guild clerk', 'a dying scholar', 'a spirit in a lantern'],
    task: ['recover a stolen heirloom', 'escort a witness', 'investigate strange lights', 'deliver a sealed letter', 'retrieve a missing relative', 'destroy a cursed object', 'shadow a suspected traitor'],
    twist: ['but a rival faction wants it first', 'but the patron is lying about why', 'and time is running out', 'though the road is no longer safe', 'and something ancient has noticed', 'but the reward is far too generous'],
    reward: ['500 gp in mixed coin', 'a favor from a powerful house', 'a minor hextech curio', 'safe passage through the region', 'a map no one else has', 'an enchanted weapon with a history']
  };

  RT.BIOMES = {
    plains: { name: 'Plains', cols: ['#a8c26b', '#92b058', '#c6d58a'], enc: ['Bandit scouts watch from a rise', 'A lost merchant cart', 'Wolves stalk the party', 'A battlefield memorial with a restless ghost', 'A traveling bard with news', 'A noble’s hunting party'] },
    forest: { name: 'Forest', cols: ['#5c8a4a', '#477a3b', '#7ea363'], enc: ['Ambush from the canopy', 'A dryad’s grove demands respect', 'Poacher traps', 'A hermit with a map', 'Dire wolves', 'Spirit lights lead astray'] },
    snow: { name: 'Frozen Tundra', cols: ['#e6f0f5', '#cfe2ec', '#f5fbff'], enc: ['Avarosan hunters', 'Frost wolves', 'Whiteout begins', 'A frozen traveler (still alive?)', 'Iceborn totem', 'A cryophage wakes'] },
    desert: { name: 'Shuriman Dunes', cols: ['#e8cd8f', '#dcbd78', '#f2dca4'], enc: ['Sand wraiths', 'A water-seller with a secret', 'Tomb-robbers', 'Ancient obelisk hums', 'Dust devil', 'Scorpion swarm'] },
    swamp: { name: 'Blighted Marsh', cols: ['#6f8b72', '#5c7a65', '#85a389'], enc: ['Mist wraiths', 'Bog hag’s bargain', 'Quicksand', 'Lantern-bearer', 'Corrupted wildlife', 'Drowned soldiers rise'] },
    ruins: { name: 'Ruined Battleground', cols: ['#a39b85', '#8e866f', '#bab29a'], enc: ['Scavengers', 'Restless dead', 'Hidden cache beneath rubble', 'Rival adventurers', 'A collapsing wall', 'Mercenary camp'] },
    coast: { name: 'Coastal Shore', cols: ['#e1d3a3', '#d3c391', '#ede1b9'], enc: ['Smugglers on the beach', 'Sea-monster tentacle', 'A beached ship with cargo', 'Press gang', 'Tidal surge', 'Crab-folk toll collectors'] },
    mountain: { name: 'Mountain Pass', cols: ['#a7a39c', '#8f8b84', '#bdb9b0'], enc: ['Rockslide', 'Pass guards', 'Mountain goats… and what hunts them', 'A sleeping drake', 'Pilgrim shrine', 'Collapsing bridge'] }
  };
  RT.BIOME_OF_REGION = { tundra: 'snow', temperate: 'plains', urban: 'ruins', highland: 'mountain', desert: 'desert', jungle: 'forest', spirit: 'forest', archipelago: 'coast', blighted: 'swamp', whimsy: 'forest' };

  RT.CITY_STYLES = {
    demacia: { ground: '#d9d3b8', wall: '#f2efe4', roof: ['#f4f1e6', '#e7dfc6', '#d6c590'], accent: '#c8aa6e', districts: ['Crownguard Quarter', 'Temple of Valor Ward', 'Merchants’ Row', 'Lightshield Heights'] },
    noxus: { ground: '#b79c8f', wall: '#3d2a2a', roof: ['#7a2d2d', '#5c2020', '#8f4141'], accent: '#d1403a', districts: ['Immortal Bastion Ward', 'Arena Quarter', 'Legion Barracks', 'Black Rose Court'] },
    piltover: { ground: '#bcc7d3', wall: '#d9b46a', roof: ['#6b8db3', '#3c5d85', '#d9b46a'], accent: '#d9b46a', districts: ['Academy Heights', 'The Clasp Market', 'Council Hill', 'Harbor Row'] },
    zaun: { ground: '#4c5a4a', wall: '#2c3a2c', roof: ['#5f7a54', '#6b4e7a', '#3a5d4a'], accent: '#8fff4a', districts: ['The Sump', 'Chem-Baron Row', 'Entresol', 'Firelight Hollow'] },
    ionia: { ground: '#d9c7b3', wall: '#cd8fa7', roof: ['#e4a6bf', '#c9809d', '#9a6a7a'], accent: '#e48fb5', districts: ['Shrine Terraces', 'Lantern Market', 'Placid Gardens', 'Kinkou Hollow'] },
    bilgewater: { ground: '#bba17c', wall: '#6b4e32', roof: ['#6b4e32', '#8f6a42', '#5a3d28'], accent: '#d9803a', districts: ['Slaughter Dock', 'Captains’ Row', 'Rustwater Slums', 'Fish Market'] },
    shurima: { ground: '#e1c78f', wall: '#c9a45a', roof: ['#e8cf94', '#cfae6a', '#f0dca8'], accent: '#c89b3c', districts: ['Sun Terrace', 'Bazaar of Dunes', 'Tomb Quarter', 'Oasis Ward'] },
    freljord: { ground: '#e2ecf1', wall: '#7a5d3d', roof: ['#6f5232', '#8a6a42', '#a98a5a'], accent: '#7fb4d2', districts: ['Longhall', 'Rimefire Market', 'Hunters’ Row', 'Warmbath Ward'] },
    ixtal: { ground: '#7ea363', wall: '#4a6a3b', roof: ['#6f9a52', '#a3c46b', '#c9ae4a'], accent: '#f0c74a', districts: ['Canopy Terraces', 'Elemental Circle', 'Wardens’ Roost', 'Root Market'] },
    shadow: { ground: '#6e867f', wall: '#2c3a38', roof: ['#3f5a56', '#2f4642', '#50706a'], accent: '#7fffd4', districts: ['The Hollow Court', 'Mistbound Row', 'Barrow Ward', 'Lantern Steps'] },
    bandle: { ground: '#c9e0a1', wall: '#8f6a42', roof: ['#e48fb5', '#f0c74a', '#7fb4d2'], accent: '#f0c74a', districts: ['Tinker’s Lane', 'Council Mushroom', 'Poro Pastures', 'Moonlit Market'] },
    targon: { ground: '#bba9cf', wall: '#e7dff0', roof: ['#e7dff0', '#cbb6dd', '#9f87b8'], accent: '#e2c4ff', districts: ['Solari Terraces', 'Lunari Steps', 'Pilgrims’ Camp', 'Starfall Ward'] }
  };
})(window.RT);
