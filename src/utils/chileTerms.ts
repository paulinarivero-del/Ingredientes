// Cambia nombres de ingredientes y términos de cocina de España, México y otros
// países por los que se usan en Chile. Las frases con artículo van primero para
// mantener la concordancia (p. ej. "la calabaza" -> "el zapallo").
const TERMS: Array<[string, string]> = [
  // Con artículo (concordancia de género)
  ['el aguacate', 'la palta'],
  ['los aguacates', 'las paltas'],
  ['un aguacate', 'una palta'],
  ['la calabaza', 'el zapallo'],
  ['las calabazas', 'los zapallos'],
  ['una calabaza', 'un zapallo'],
  ['las judías verdes', 'los porotos verdes'],
  ['las judías', 'los porotos'],
  ['las alubias', 'los porotos'],
  ['los guisantes', 'las arvejas'],
  ['los chícharos', 'las arvejas'],
  ['la nata', 'la crema'],
  ['el zumo', 'el jugo'],
  ['la remolacha', 'la betarraga'],
  ['el betabel', 'la betarraga'],
  ['la lombarda', 'el repollo morado'],
  ['la col', 'el repollo'],
  ['la tarta', 'la torta'],
  ['el bizcocho', 'el queque'],

  // Frases de varias palabras
  ['aguacates maduros', 'paltas maduras'],
  ['aguacate maduro', 'palta madura'],
  ['cacahuates tostados', 'maní tostado'],
  ['cacahuetes tostados', 'maní tostado'],
  ['cacahuates pelados', 'maní pelado'],
  ['cacahuetes pelados', 'maní pelado'],
  ['mantequilla de cacahuate', 'mantequilla de maní'],
  ['mantequilla de cacahuete', 'mantequilla de maní'],
  ['crema de cacahuete', 'mantequilla de maní'],
  ['judías verdes', 'porotos verdes'],
  ['cebolla de cambray', 'cebollín'],
  ['cebollas de cambray', 'cebollines'],
  ['carne picada', 'carne molida'],
  ['azúcar glas', 'azúcar flor'],
  ['azúcar glass', 'azúcar flor'],
  ['azúcar glacé', 'azúcar flor'],
  ['azúcar moreno', 'azúcar rubia'],
  ['azúcar morena', 'azúcar rubia'],
  ['levadura química', 'polvo de hornear'],
  ['levadura en polvo', 'polvo de hornear'],
  ['polvo para hornear', 'polvo de hornear'],
  ['nata para montar', 'crema para batir'],
  ['nata montada', 'crema batida'],
  ['nata líquida', 'crema'],
  ['crema para cocinar', 'crema'],
  ['tomate concentrado', 'pasta de tomate'],
  ['maíz dulce', 'choclo'],
  ['maíz tierno', 'choclo'],
  ['pimiento rojo', 'pimentón rojo'],
  ['pimiento verde', 'pimentón verde'],
  ['pimientos rojos', 'pimentones rojos'],
  ['pimientos verdes', 'pimentones verdes'],

  // Palabras sueltas
  ['aguacates', 'paltas'],
  ['aguacate', 'palta'],
  ['cacahuates', 'maní'],
  ['cacahuate', 'maní'],
  ['cacahuetes', 'maní'],
  ['cacahuete', 'maní'],
  ['calabacines', 'zapallos italianos'],
  ['calabacín', 'zapallo italiano'],
  ['calabacitas', 'zapallos italianos'],
  ['calabacita', 'zapallo italiano'],
  ['calabazas', 'zapallos'],
  ['calabaza', 'zapallo'],
  ['patatas', 'papas'],
  ['patata', 'papa'],
  ['boniatos', 'camotes'],
  ['boniato', 'camote'],
  ['batatas', 'camotes'],
  ['batata', 'camote'],
  ['fresones', 'frutillas'],
  ['fresón', 'frutilla'],
  ['fresas', 'frutillas'],
  ['fresa', 'frutilla'],
  ['melocotones', 'duraznos'],
  ['melocotón', 'durazno'],
  ['albaricoques', 'damascos'],
  ['albaricoque', 'damasco'],
  ['chabacanos', 'damascos'],
  ['chabacano', 'damasco'],
  ['guisantes', 'arvejas'],
  ['guisante', 'arveja'],
  ['chícharos', 'arvejas'],
  ['chícharo', 'arveja'],
  ['ejotes', 'porotos verdes'],
  ['alubias', 'porotos'],
  ['frijoles', 'porotos'],
  ['frijol', 'poroto'],
  ['judías', 'porotos'],
  ['elotes', 'choclos'],
  ['elote', 'choclo'],
  ['jitomates', 'tomates'],
  ['jitomate', 'tomate'],
  ['pimientos', 'pimentones'],
  ['pimiento', 'pimentón'],
  ['guindillas', 'ajíes'],
  ['guindilla', 'ají'],
  ['chiles', 'ajíes'],
  ['chile', 'ají'],
  ['cebolletas', 'cebollines'],
  ['cebolleta', 'cebollín'],
  ['cebollino', 'cebollín'],
  ['remolachas', 'betarragas'],
  ['remolacha', 'betarraga'],
  ['betabel', 'betarraga'],
  ['lombarda', 'repollo morado'],
  ['gambas', 'camarones'],
  ['gamba', 'camarón'],
  ['langostinos', 'camarones'],
  ['beicon', 'tocino'],
  ['bacon', 'tocino'],
  ['panceta', 'tocino'],
  ['hierbabuena', 'menta'],
  ['zumo', 'jugo'],
  ['zumos', 'jugos'],
  ['nata', 'crema'],
  ['tarta', 'torta'],
  ['bizcocho', 'queque'],
];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const PATTERN = new RegExp(
  `(?<![\\p{L}])(${TERMS.map(([from]) => escapeRe(from)).join('|')})(?![\\p{L}])`,
  'giu'
);

const LOOKUP = new Map(TERMS.map(([from, to]) => [from.toLowerCase(), to]));

/** Devuelve el texto con los nombres de ingredientes usados en Chile. */
export function chilenizar(text: string): string {
  if (!text) return text;
  return text.replace(PATTERN, (match) => {
    const to = LOOKUP.get(match.toLowerCase());
    if (!to) return match;
    // "Chile" con mayúscula es el país, no el ají.
    if (match === 'Chile' || match === 'CHILE') return match;
    const first = match.charAt(0);
    return first !== first.toLowerCase() ? to.charAt(0).toUpperCase() + to.slice(1) : to;
  });
}
