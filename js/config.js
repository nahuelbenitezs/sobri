/* ============================================================
   CONFIG.JS — ⚙️ EL CEREBRO EDITABLE DEL JUEGO
   Si querés cambiar dificultad, jefes o ataques: TOCÁ SOLO ACÁ
   ============================================================ */

const CONFIG = {
  playerNameDefault: 'ENTRENADOR',
  playerMaxHP: 160,      // Vida máxima de Charizard
  megaMultiplier: 1.35,  // Multiplicador de daño tras mega-evolucionar
  typeText: '¡Es súper eficaz!',
};

/* Los 3 jefes, en orden. hp = vida, min/max = daño que hacen ellos */
const BOSSES = [
  { name:'VENUSAUR', id:3,   hp:100, atk:'Látigo Cepa', min:12, max:20, types:'🌿 Planta', intro:'¡VENUSAUR aparece! El guardián de la selva desafía a tus llamas.' },
  { name:'ARTICUNO', id:146, hp:120, atk:'Rayo Hielo',  min:14, max:22, types:'❄️ Hielo',  intro:'¡ARTICUNO aparece! El ave legendaria congela el aire del gimnasio.' },
  { name:'SCIZOR',   id:212, hp:140, atk:'Puño Bala',   min:16, max:24, types:'🪲 Acero',  intro:'¡ÚLTIMO JEFE! SCIZOR entra con pinzas de acero puro.' },
];

/* 🐞 BUG ARREGLADO: Garra Dragón ahora TIENE min/max propios.
   Antes no tenía → el daño salía NaN → el jefe quedaba inmortal. */
const MOVES = [
  { key:'flamethrower', icon:'🔥', name:'Lanzallamas',  min:26, max:34, msg:'¡Charizard lanzó una llamarada feroz!' },
  { key:'flareblitz',   icon:'☄️', name:'Envite Ígneo', min:40, max:52, recoil:12, msg:'¡Envite Ígneo! Charizard ardió con todo...' },
  { key:'dragonclaw',   icon:'🐉', name:'Garra Dragón', min:22, max:28, critMin:46, critMax:58, critChance:0.5, msg:'¡Charizard atacó con garras draconianas!' },
  { key:'mega',         icon:'💥', name:'Mega-Evolución' },
];

/* Galería de Pokémon de fuego para la tarjeta: [nombre, id nacional] */
const FIRE_TEAM = [
  ['Charizard',6],['Arcanine',59],['Ninetales',38],['Rapidash',78],['Magmar',126],
  ['Flareon',136],['Moltres',146],['Typhlosion',157],['Houndoom',229],['Entei',244],
  ['Ho-Oh',250],['Blaziken',257],['Torkoal',324],['Infernape',392],['Magmortar',467],
  ['Heatran',485],['Emboar',500],['Chandelure',609],['Volcarona',637],['Reshiram',643],
  ['Delphox',655],['Talonflame',663],['Incineroar',727],['Cinderace',815],
  ['Fuecoco',909],['Skeledirge',911],['Ceruledge',937],
];

/* URLs de sprites (PokéAPI / Pokémon Showdown) */
const SPR = {
  back:  id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${id}.gif`,
  front: id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`,
  art:   id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
  any(id){ return id <= 649 ? this.front(id) : this.art(id); },
  playerStatic: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png',
  megaBack: 'https://play.pokemonshowdown.com/sprites/gen5ani-back/charizard-megax.gif',
};