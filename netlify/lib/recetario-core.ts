// Lógica del recetario compartida por la función de Netlify (adaptada de server.ts).
import { chilenizar } from '../../src/utils/chileTerms';
type ThermomixModel = 'TM6' | 'TM7';
type IngredientStatus = 'pending' | 'have' | 'missing';

interface IngredientItem {
  id: string;
  text: string;
  note?: string;
  status: IngredientStatus;
}

interface RecipeStep {
  id: string;
  order: number;
  text: string;
  thermomixParams?: string;
}

interface RecipeRecord {
  id: string;
  parentId?: string;
  clientName?: string;
  title: string;
  description: string;
  model: ThermomixModel;
  imageUrl: string;
  prepTime: string;
  servings: string;
  cookidooUrl?: string;
  ingredients: IngredientItem[];
  steps: RecipeStep[];
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
}

interface StoreData {
  recipes: RecipeRecord[];
}


const SEED_RECIPES: RecipeRecord[] = [
  {
    id: 'crema-calabaza-jengibre',
    title: 'Crema Aterciopelada de Calabaza Asada y Jengibre',
    description:
      'Suave crema otoñal con un toque cálido de jengibre fresco, leche de coco y semillas tostadas. Ideal para demostrar la textura perfecta en Thermomix.',
    model: 'TM6',
    imageUrl: '/src/assets/images/recipe_pumpkin_soup_1795285678497.jpg',
    prepTime: '30 min',
    servings: '4 porciones',
    ingredients: [
      {
        id: 'ing_cal_1',
        text: '700 g de calabaza pelada y en trozos',
        status: 'have',
      },
      {
        id: 'ing_cal_2',
        text: '1 cebolla mediana partida en cuartos',
        status: 'have',
      },
      {
        id: 'ing_cal_3',
        text: '15 g de jengibre fresco pelado',
        note: 'ajustar a gusto',
        status: 'missing',
      },
      {
        id: 'ing_cal_4',
        text: '30 g de aceite de oliva virgen extra',
        status: 'have',
      },
      {
        id: 'ing_cal_5',
        text: '500 g de caldo de verduras natural',
        status: 'missing',
      },
      {
        id: 'ing_cal_6',
        text: '150 g de leche de coco o crema para cocinar',
        note: 'opcional para un acabado más cremoso',
        status: 'pending',
      },
      {
        id: 'ing_cal_7',
        text: '1 cucharadita de sal marina y pimienta negra recién molida',
        status: 'have',
      },
      {
        id: 'ing_cal_8',
        text: 'Semillas de calabaza tostadas y hojas de salvia fresca',
        note: 'opcional para decorar al servir',
        status: 'missing',
      },
    ],
    steps: [
      {
        id: 'step_cal_1',
        order: 1,
        text: 'Pon en el vaso la cebolla y el jengibre fresco. Pica rápidamente para liberar todo su aroma.',
        thermomixParams: '4 seg · Vel 5',
      },
      {
        id: 'step_cal_2',
        order: 2,
        text: 'Baja los restos de las paredes con la espátula, añade el aceite de oliva virgen extra y sofríe suavemente hasta que la cebolla esté transparente.',
        thermomixParams: '5 min · 120°C · Vel 1',
      },
      {
        id: 'step_cal_3',
        order: 3,
        text: 'Incorpora los trozos de calabaza, el caldo de verduras, la sal y la pimienta. Cocina hasta que la calabaza esté tierna.',
        thermomixParams: '18 min · 100°C · Vel 1',
      },
      {
        id: 'step_cal_4',
        order: 4,
        text: 'Agrega la leche de coco y espera 1 minuto a que baje ligeramente la temperatura antes de triturar.',
        thermomixParams: '1 min · Sin tapa',
      },
      {
        id: 'step_cal_5',
        order: 5,
        text: 'Coloca el cubilete y tritura progresivamente de velocidad 5 a 10 hasta obtener una textura aterciopelada.',
        thermomixParams: '1 min · Vel 5 → 10 progresiva',
      },
      {
        id: 'step_cal_6',
        order: 6,
        text: 'Sirve en cuencos templados decorando con un hilo de leche de coco, semillas de calabaza tostadas y hojitas de salvia fresca.',
      },
    ],
    createdAt: '2026-11-20T10:00:00.000Z',
    updatedAt: '2026-11-20T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'risotto-hongos-parmesano',
    title: 'Risotto Cremoso de Hongos Silvestres y Parmesano',
    description:
      'Arroz Carnaroli en su punto exacto, sin remover manualmente gracias al giro a la izquierda de Thermomix TM7 y acabado mantecado con queso añejo.',
    model: 'TM7',
    imageUrl: '/src/assets/images/recipe_mushroom_risotto_1795285678465.jpg',
    prepTime: '35 min',
    servings: '4 porciones',
    ingredients: [
      {
        id: 'ing_ris_1',
        text: '60 g de queso parmesano reggiano en trozos',
        status: 'pending',
      },
      {
        id: 'ing_ris_2',
        text: '2 chalotas o 1 cebolla pequeña',
        status: 'have',
      },
      {
        id: 'ing_ris_3',
        text: '40 g de mantequilla sin sal (en dos mitades)',
        status: 'have',
      },
      {
        id: 'ing_ris_4',
        text: '300 g de hongos variados frescos laminados',
        status: 'missing',
      },
      {
        id: 'ing_ris_5',
        text: '320 g de arroz arborio o carnaroli',
        status: 'pending',
      },
      {
        id: 'ing_ris_6',
        text: '80 g de vino blanco seco',
        note: 'opcional, puede sustituirse por caldo',
        status: 'have',
      },
      {
        id: 'ing_ris_7',
        text: '850 g de caldo caliente de ave o verduras',
        status: 'have',
      },
      {
        id: 'ing_ris_8',
        text: 'Ramitas de tomillo fresco',
        note: 'para decorar',
        status: 'missing',
      },
    ],
    steps: [
      {
        id: 'step_ris_1',
        order: 1,
        text: 'Coloca el parmesano en trozos en el vaso limpio y seco para rallarlo al instante. Reserva en un bol.',
        thermomixParams: '10 seg · Vel 10',
      },
      {
        id: 'step_ris_2',
        order: 2,
        text: 'Añade las chalotas y pica finamente. Incorpora 20 g de mantequilla y sofríe suavemente.',
        thermomixParams: '3 seg · Vel 5 / 3 min · 120°C · Vel 1',
      },
      {
        id: 'step_ris_3',
        order: 3,
        text: 'Agrega los hongos laminados y rehoga con giro inverso para mantener su forma.',
        thermomixParams: '4 min · 120°C · Giro inverso · Vel cuchara',
      },
      {
        id: 'step_ris_4',
        order: 4,
        text: 'Incorpora el arroz y nacara sin cubilete. Luego vierte el vino blanco y deja evaporar el alcohol.',
        thermomixParams: '3 min · 100°C · Giro inverso · Vel 1',
      },
      {
        id: 'step_ris_5',
        order: 5,
        text: 'Vierte el caldo caliente, coloca el cestillo sobre la tapa en lugar del cubilete y cocina el risotto.',
        thermomixParams: '14 min · 100°C · Giro inverso · Vel 1',
      },
      {
        id: 'step_ris_6',
        order: 6,
        text: 'Manteca con los 20 g restantes de mantequilla y el parmesano rallado reservado. Deja reposar 2 minutos y sirve con tomillo fresco.',
      },
    ],
    createdAt: '2026-11-20T10:05:00.000Z',
    updatedAt: '2026-11-20T10:05:00.000Z',
    isSample: true,
  },
  {
    id: 'pollo-limon-romero-varoma',
    title: 'Pechugas al Limón y Romero con Papitas al Varoma',
    description:
      'Cocina completa en niveles: jugosas pechugas aromáticas con limón y romero junto a papitas doradas al vapor en una sola preparación.',
    model: 'TM6',
    imageUrl: '/src/assets/images/recipe_lemon_herb_chicken_1795285678816.jpg',
    prepTime: '40 min',
    servings: '4 porciones',
    ingredients: [
      {
        id: 'ing_pol_1',
        text: '600 g de pechuga de pollo en filetes gruesos',
        status: 'pending',
      },
      {
        id: 'ing_pol_2',
        text: '500 g de papitas cambray lavadas con piel',
        status: 'have',
      },
      {
        id: 'ing_pol_3',
        text: '1 limón amarillo en rodajas finas + su ralladura',
        status: 'missing',
      },
      {
        id: 'ing_pol_4',
        text: '2 ramitas de romero fresco y perejil picado',
        status: 'have',
      },
      {
        id: 'ing_pol_5',
        text: '2 dientes de ajo y 30 g de aceite de oliva',
        status: 'have',
      },
      {
        id: 'ing_pol_6',
        text: '500 g de agua para el vapor',
        status: 'have',
      },
      {
        id: 'ing_pol_7',
        text: 'Sal en escamas y pimienta al gusto',
        note: 'ajustar a gusto',
        status: 'have',
      },
    ],
    steps: [
      {
        id: 'step_pol_1',
        order: 1,
        text: 'Pica el ajo con las hojas de romero y el aceite de oliva para preparar la marinada aromática.',
        thermomixParams: '5 seg · Vel 7',
      },
      {
        id: 'step_pol_2',
        order: 2,
        text: 'Unta las pechugas de pollo con la mezcla, añade rodajas de limón encima y colócalas en la bandeja del Varoma.',
      },
      {
        id: 'step_pol_3',
        order: 3,
        text: 'Pon las papitas cambray en el recipiente Varoma dejando ranuras libres para que circule el vapor.',
      },
      {
        id: 'step_pol_4',
        order: 4,
        text: 'Vierte el agua en el vaso, sitúa el Varoma en su posición y cocina al vapor.',
        thermomixParams: '25 min · Varoma · Vel 1',
      },
      {
        id: 'step_pol_5',
        order: 5,
        text: 'Corta el pollo en medallones gruesos, sirve junto a las papitas con sal en escamas y decora con perejil fresco.',
      },
    ],
    createdAt: '2026-11-20T10:10:00.000Z',
    updatedAt: '2026-11-20T10:10:00.000Z',
    isSample: true,
  },
];
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42);
}

function generateUniqueId(base: string, existingIds: Set<string>): string {
  const cleanBase = slugify(base) || 'receta';
  const suffix = Math.random().toString(36).slice(2, 6);
  let candidate = `${cleanBase}-${suffix}`;
  while (existingIds.has(candidate)) {
    candidate = `${cleanBase}-${Math.random().toString(36).slice(2, 7)}`;
  }
  return candidate;
}

function isBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '::1' ||
    lower === '0.0.0.0' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(lower)) {
    const parts = lower.split('.').map(Number);
    if (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
    ) {
      return true;
    }
  }
  return false;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
    .trim();
}

function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function formatIsoDuration(iso?: string): string | undefined {
  if (!iso || typeof iso !== 'string') return undefined;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!match) return iso;
  const hours = match[1] ? Number(match[1]) : 0;
  const mins = match[2] ? Number(match[2]) : 0;
  if (hours && mins) return `${hours} h ${mins} min`;
  if (hours) return `${hours} h`;
  if (mins) return `${mins} min`;
  return undefined;
}

function extractRecipeFromHtml(html: string, sourceUrl: string) {
  let title: string | undefined;
  let description: string | undefined;
  let imageUrl: string | undefined;
  let prepTime: string | undefined;
  let servings: string | undefined;
  const ingredients: Array<{ text: string; note?: string }> = [];
  const steps: Array<{ text: string; thermomixParams?: string }> = [];

  // 1. Parse JSON-LD schema.org/Recipe blocks
  const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = ldJsonRegex.exec(html)) !== null) {
    try {
      const rawJson = match[1].trim();
      const parsed = JSON.parse(rawJson);
      const candidates = Array.isArray(parsed)
        ? parsed
        : parsed['@graph'] && Array.isArray(parsed['@graph'])
          ? parsed['@graph']
          : [parsed];

      for (const item of candidates) {
        const typeVal = item?.['@type'];
        const isRecipe =
          typeVal === 'Recipe' ||
          (Array.isArray(typeVal) && typeVal.includes('Recipe'));
        if (!isRecipe) continue;

        if (!title && typeof item.name === 'string') {
          title = decodeHtmlEntities(item.name);
        }
        if (!description && typeof item.description === 'string') {
          description = decodeHtmlEntities(item.description);
        }
        if (!imageUrl && item.image) {
          if (typeof item.image === 'string') imageUrl = item.image;
          else if (Array.isArray(item.image) && typeof item.image[0] === 'string') {
            imageUrl = item.image[0];
          } else if (typeof item.image?.url === 'string') {
            imageUrl = item.image.url;
          }
        }
        if (!prepTime) {
          prepTime = formatIsoDuration(item.totalTime || item.prepTime || item.cookTime);
        }
        if (!servings && item.recipeYield) {
          servings = Array.isArray(item.recipeYield)
            ? String(item.recipeYield[0])
            : String(item.recipeYield);
        }
        if (Array.isArray(item.recipeIngredient) && ingredients.length === 0) {
          for (const ing of item.recipeIngredient) {
            if (typeof ing === 'string' && ing.trim()) {
              ingredients.push({ text: decodeHtmlEntities(ing.trim()) });
            }
          }
        }
        if (Array.isArray(item.recipeInstructions) && steps.length === 0) {
          for (const st of item.recipeInstructions) {
            if (typeof st === 'string' && st.trim()) {
              steps.push({ text: decodeHtmlEntities(st.trim()) });
            } else if (st && typeof st.text === 'string' && st.text.trim()) {
              steps.push({ text: decodeHtmlEntities(st.text.trim()) });
            }
          }
        }
      }
    } catch {
      // Continue scanning other JSON-LD blocks
    }
  }

  // 2. OpenGraph & Meta tags fallback
  const getMeta = (attrName: string, attrVal: string): string | undefined => {
    const re1 = new RegExp(
      `<meta[^>]*${attrName}=["']${attrVal}["'][^>]*content=["']([^"']+)["'][^>]*>`,
      'i'
    );
    const re2 = new RegExp(
      `<meta[^>]*content=["']([^"']+)["'][^>]*${attrName}=["']${attrVal}["'][^>]*>`,
      'i'
    );
    const found = html.match(re1) || html.match(re2);
    return found?.[1] ? decodeHtmlEntities(found[1]) : undefined;
  };

  if (!title) {
    title = getMeta('property', 'og:title') || getMeta('name', 'title');
    if (title) {
      title = title.replace(/\s*[-|]\s*Cookidoo.*$/i, '').trim();
    } else {
      const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleTag?.[1]) {
        title = stripTags(titleTag[1]).replace(/\s*[-|]\s*Cookidoo.*$/i, '').trim();
      }
    }
  }

  if (!imageUrl) {
    imageUrl = getMeta('property', 'og:image') || getMeta('name', 'twitter:image');
  }

  if (!description) {
    description = getMeta('property', 'og:description') || getMeta('name', 'description');
  }

  // 3. Fallback DOM pattern for Cookidoo public ingredient sections
  if (ingredients.length === 0) {
    const ingSectionMatch =
      html.match(/<ul[^>]*id=["']ingredients[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i) ||
      html.match(/<div[^>]*id=["']ingredients[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
      html.match(/<section[^>]*class=["'][^"']*ingredients[^"']*["'][^>]*>([\s\S]*?)<\/section>/i);

    if (ingSectionMatch?.[1]) {
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch: RegExpExecArray | null;
      while ((liMatch = liRegex.exec(ingSectionMatch[1])) !== null) {
        const text = stripTags(liMatch[1]);
        if (text && text.length > 1 && text.length < 180) {
          ingredients.push({ text });
        }
      }
    }
  }

  // 4. Fallback DOM pattern for public steps if available
  if (steps.length === 0) {
    const stepsSectionMatch =
      html.match(/<ol[^>]*id=["']preparation-steps[^"']*["'][^>]*>([\s\S]*?)<\/ol>/i) ||
      html.match(/<ol[^>]*class=["'][^"']*steps[^"']*["'][^>]*>([\s\S]*?)<\/ol>/i);

    if (stepsSectionMatch?.[1]) {
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch: RegExpExecArray | null;
      while ((liMatch = liRegex.exec(stepsSectionMatch[1])) !== null) {
        const text = stripTags(liMatch[1]);
        if (text && text.length > 3) {
          steps.push({ text });
        }
      }
    }
  }

  // Resolve relative image URL if needed
  if (imageUrl && imageUrl.startsWith('/')) {
    try {
      const base = new URL(sourceUrl);
      imageUrl = `${base.origin}${imageUrl}`;
    } catch {
      // keep as is
    }
  }

  return {
    title,
    description,
    imageUrl,
    prepTime,
    servings,
    ingredients,
    steps,
    cookidooUrl: sourceUrl,
  };
}
// ---------------------------------------------------------------------------
// Almacenamiento: interfaz simple para poder usar Netlify Blobs en producción
// (y un almacenamiento en memoria para pruebas).
// ---------------------------------------------------------------------------
export interface RecetarioStore {
  load(): Promise<StoreData | null>;
  save(data: StoreData): Promise<void>;
}

async function readStore(store: RecetarioStore): Promise<StoreData> {
  try {
    const data = await store.load();
    if (data && Array.isArray(data.recipes) && data.recipes.length > 0) return data;
  } catch {
    // datos dañados: se vuelve a las recetas iniciales
  }
  const initial: StoreData = { recipes: structuredClone(SEED_RECIPES) };
  await store.save(initial);
  return initial;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

function cleanIngredients(list: unknown): IngredientItem[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((i: any) => i && typeof i.text === 'string' && i.text.trim())
    .map((i: any, idx: number) => ({
      id: typeof i.id === 'string' && i.id ? i.id : `ing_${Date.now()}_${idx}`,
      text: i.text.trim().slice(0, 240),
      note: typeof i.note === 'string' && i.note.trim() ? i.note.trim().slice(0, 120) : undefined,
      status: i.status === 'have' || i.status === 'missing' ? i.status : 'pending',
    }));
}

function cleanSteps(list: unknown): RecipeStep[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((s: any) => s && typeof s.text === 'string' && s.text.trim())
    .map((s: any, idx: number) => ({
      id: typeof s.id === 'string' && s.id ? s.id : `step_${Date.now()}_${idx}`,
      order: idx + 1,
      text: s.text.trim(),
      thermomixParams:
        typeof s.thermomixParams === 'string' && s.thermomixParams.trim()
          ? s.thermomixParams.trim().slice(0, 80)
          : undefined,
    }));
}

async function extractCookidoo(rawUrl: string): Promise<Response> {
  if (!rawUrl) return json({ error: 'Pega un enlace público de Cookidoo para intentar cargarlo.' }, 400);
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return json({ error: 'El enlace ingresado no tiene un formato de URL válido.' }, 400);
  }
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    return json({ error: 'Solo se admiten enlaces web http o https.' }, 400);
  }
  if (isBlockedHost(parsedUrl.hostname)) {
    return json({ error: 'La dirección ingresada no es un enlace público válido.' }, 400);
  }
  const blocked = (message: string, data: unknown) =>
    json({ success: false, partial: false, blocked: true, message, data });
  try {
    const response = await fetch(parsedUrl.toString(), {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(7000),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
    });
    if (!response.ok) {
      return blocked(
        'Cookidoo restringió la lectura automática de este enlace (muy común en la versión gratuita). Usa el Ingreso Manual Inteligente debajo para pegar la receta al instante.',
        { ingredients: [], steps: [], cookidooUrl: parsedUrl.toString() }
      );
    }
    const html = await response.text();
    const raw = extractRecipeFromHtml(html, parsedUrl.toString());
    // Nombres de ingredientes y términos como se usan en Chile.
    const extracted = {
      ...raw,
      title: raw.title ? chilenizar(raw.title) : raw.title,
      ingredients: raw.ingredients.map((i) => ({ ...i, text: chilenizar(i.text) })),
      steps: raw.steps.map((st) => ({ ...st, text: chilenizar(st.text) })),
    };
    const hasTitle = Boolean(extracted.title && !/login|iniciar sesi[oó]n|cookidoo/i.test(extracted.title));
    const hasIngredients = extracted.ingredients.length > 0;
    const hasSteps = extracted.steps.length > 0;
    if (!hasTitle && !hasIngredients) {
      return blocked(
        'Esta vista pública de Cookidoo no expuso los datos sin iniciar sesión. Activa tu Plan B: pega los ingredientes y pasos en los cuadros de abajo y la app los ordenará automáticamente.',
        { ...extracted, title: undefined }
      );
    }
    if (!hasIngredients || !hasSteps) {
      return json({
        success: true,
        partial: true,
        blocked: false,
        message: !hasIngredients
          ? 'Cargamos la portada de la receta, pero Cookidoo ocultó los ingredientes. Pégalos en bloque aquí abajo para separarlos automáticamente.'
          : 'Cargamos título, foto e ingredientes. Como Cookidoo gratuito oculta el paso a paso completo, pega o escribe los pasos en el Plan B.',
        data: extracted,
      });
    }
    return json({
      success: true,
      partial: false,
      blocked: false,
      message: 'Receta importada desde Cookidoo correctamente. Puedes revisarla o ajustarla antes de guardar.',
      data: extracted,
    });
  } catch {
    return blocked(
      'No se pudo conectar automáticamente con el enlace de Cookidoo. No te preocupes: pega la lista de ingredientes y pasos en el Plan B manual y quedará lista en segundos.',
      { ingredients: [], steps: [], cookidooUrl: parsedUrl.toString() }
    );
  }
}

// ---------------------------------------------------------------------------
// Router: mismas rutas y respuestas que el servidor Express original.
// ---------------------------------------------------------------------------
export async function handleApi(req: Request, store: RecetarioStore): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/\.netlify\/functions\/api/, '/api').replace(/\/+$/, '');
  const method = req.method.toUpperCase();
  let body: any = {};
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      body = await req.json();
    } catch {
      body = {};
    }
  }

  if (path === '/api/cookidoo/extract' && method === 'POST') {
    return extractCookidoo(typeof body?.url === 'string' ? body.url.trim() : '');
  }

  if (path === '/api/recipes') {
    const data = await readStore(store);
    if (method === 'GET') {
      return json({
        recipes: data.recipes.filter((r) => !r.parentId),
        sharedLinks: data.recipes.filter((r) => Boolean(r.parentId)),
      });
    }
    if (method === 'POST') {
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      if (!title) return json({ error: 'El título de la receta es obligatorio.' }, 400);
      const now = new Date().toISOString();
      const newRecipe: RecipeRecord = {
        id: generateUniqueId(title, new Set(data.recipes.map((r) => r.id))),
        title: title.slice(0, 160),
        description: typeof body.description === 'string' ? body.description.trim().slice(0, 500) : '',
        model: body.model === 'TM7' ? 'TM7' : 'TM6',
        imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '',
        prepTime:
          typeof body.prepTime === 'string' && body.prepTime.trim() ? body.prepTime.trim().slice(0, 40) : '30 min',
        servings:
          typeof body.servings === 'string' && body.servings.trim()
            ? body.servings.trim().slice(0, 40)
            : '4 porciones',
        cookidooUrl:
          typeof body.cookidooUrl === 'string' && body.cookidooUrl.trim() ? body.cookidooUrl.trim() : undefined,
        ingredients: cleanIngredients(body.ingredients),
        steps: cleanSteps(body.steps),
        createdAt: now,
        updatedAt: now,
      };
      data.recipes.unshift(newRecipe);
      await store.save(data);
      return json({ recipe: newRecipe }, 201);
    }
    return json({ error: 'Método no permitido.' }, 405);
  }

  const share = path.match(/^\/api\/recipes\/([^/]+)\/share$/);
  if (share && method === 'POST') {
    const data = await readStore(store);
    const source = data.recipes.find((r) => r.id === decodeURIComponent(share[1]));
    if (!source) return json({ error: 'No se encontró la receta origen.' }, 404);
    const clientName = typeof body?.clientName === 'string' ? body.clientName.trim().slice(0, 60) : '';
    const resetChecks = body?.resetChecks !== false;
    const now = new Date().toISOString();
    const sharedRecipe: RecipeRecord = {
      ...source,
      id: generateUniqueId(
        clientName ? `${clientName}-${source.title}` : source.title,
        new Set(data.recipes.map((r) => r.id))
      ),
      parentId: source.parentId || source.id,
      clientName: clientName || undefined,
      isSample: false,
      ingredients: source.ingredients.map((ing, idx) => ({
        ...ing,
        id: `${ing.id}_${idx}`,
        status: resetChecks ? 'pending' : ing.status,
      })),
      steps: source.steps.map((st) => ({ ...st })),
      createdAt: now,
      updatedAt: now,
    };
    data.recipes.push(sharedRecipe);
    await store.save(data);
    return json({ recipe: sharedRecipe }, 201);
  }

  const pantry = path.match(/^\/api\/recipes\/([^/]+)\/pantry$/);
  if (pantry && method === 'PATCH') {
    const data = await readStore(store);
    const index = data.recipes.findIndex((r) => r.id === decodeURIComponent(pantry[1]));
    if (index === -1) return json({ error: 'Enlace de receta no encontrado.' }, 404);
    const recipe = data.recipes[index];
    const { ingredientId, status, resetAll } = body as {
      ingredientId?: string;
      status?: IngredientStatus;
      resetAll?: boolean;
    };
    if (resetAll) {
      recipe.ingredients = recipe.ingredients.map((ing) => ({ ...ing, status: 'pending' }));
    } else if (typeof ingredientId === 'string' && (status === 'pending' || status === 'have' || status === 'missing')) {
      recipe.ingredients = recipe.ingredients.map((ing) => (ing.id === ingredientId ? { ...ing, status } : ing));
    } else {
      return json({ error: 'Datos de actualización inválidos.' }, 400);
    }
    recipe.updatedAt = new Date().toISOString();
    data.recipes[index] = recipe;
    await store.save(data);
    return json({ recipe });
  }

  const one = path.match(/^\/api\/recipes\/([^/]+)$/);
  if (one) {
    const id = decodeURIComponent(one[1]);
    const data = await readStore(store);
    const index = data.recipes.findIndex((r) => r.id === id);
    if (method === 'GET') {
      if (index === -1) return json({ error: 'No encontramos esta receta o enlace compartido.' }, 404);
      return json({ recipe: data.recipes[index] });
    }
    if (method === 'PUT') {
      if (index === -1) return json({ error: 'Receta no encontrada.' }, 404);
      const existing = data.recipes[index];
      const updated: RecipeRecord = {
        ...existing,
        title:
          typeof body.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 160) : existing.title,
        description:
          typeof body.description === 'string' ? body.description.trim().slice(0, 500) : existing.description,
        model: body.model === 'TM7' ? 'TM7' : body.model === 'TM6' ? 'TM6' : existing.model,
        imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : existing.imageUrl,
        prepTime:
          typeof body.prepTime === 'string' && body.prepTime.trim()
            ? body.prepTime.trim().slice(0, 40)
            : existing.prepTime,
        servings:
          typeof body.servings === 'string' && body.servings.trim()
            ? body.servings.trim().slice(0, 40)
            : existing.servings,
        cookidooUrl:
          typeof body.cookidooUrl === 'string' ? body.cookidooUrl.trim() || undefined : existing.cookidooUrl,
        ingredients: Array.isArray(body.ingredients) ? cleanIngredients(body.ingredients) : existing.ingredients,
        steps: Array.isArray(body.steps) ? cleanSteps(body.steps) : existing.steps,
        updatedAt: new Date().toISOString(),
      };
      data.recipes[index] = updated;
      await store.save(data);
      return json({ recipe: updated });
    }
    if (method === 'DELETE') {
      if (index === -1) return json({ error: 'Receta no encontrada.' }, 404);
      const target = data.recipes[index];
      const masters = data.recipes.filter((r) => !r.parentId);
      if (!target.parentId && masters.length <= 1) {
        return json({ error: 'Debe quedar al menos una receta activa en tu recetario.' }, 400);
      }
      data.recipes = data.recipes.filter((r) => r.id !== id);
      await store.save(data);
      return json({ deleted: true });
    }
    return json({ error: 'Método no permitido.' }, 405);
  }

  return json({ error: 'Ruta no encontrada.' }, 404);
}
