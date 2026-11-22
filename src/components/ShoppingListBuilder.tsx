import { useMemo, useState } from 'react';
import { Check, ClipboardCopy, ListChecks, RotateCcw, ShoppingBasket } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface ShoppingListBuilderProps {
  recipes: Recipe[];
  onCopySuccess: (msg: string) => void;
}

interface ListItem {
  key: string;
  label: string;
  sources: string[];
}

const STORAGE_KEY = 'lista-general-paulina-v1';

const UNITS: Record<string, string> = {
  g: 'g',
  gr: 'g',
  gramos: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  litro: 'l',
  litros: 'l',
  cucharadita: 'cucharadita',
  cucharaditas: 'cucharadita',
  cucharada: 'cucharada',
  cucharadas: 'cucharada',
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Separa "100 g de azúcar" en cantidad, unidad y nombre para poder sumar
// ingredientes repetidos. Si no reconoce el formato, el ingrediente queda tal cual.
function parseIngredient(text: string) {
  const m = text
    .trim()
    .match(
      /^(\d+(?:[.,]\d+)?)\s*(g|gr|gramos|kg|ml|l|litros?|cucharaditas?|cucharadas?)?\s+(?:de\s+)?(.+)$/i
    );
  if (!m) return null;
  const qty = Number(m[1].replace(',', '.'));
  const unit = m[2] ? UNITS[m[2].toLowerCase()] : '';
  const name = m[3].trim();
  if (!Number.isFinite(qty) || !name) return null;
  return { qty, unit, name };
}

function formatQty(qty: number, unit: string, name: string) {
  const n = Number.isInteger(qty) ? String(qty) : String(Math.round(qty * 100) / 100).replace('.', ',');
  if (!unit) return `${n} ${name}`;
  const plural = qty !== 1 && (unit === 'cucharadita' || unit === 'cucharada') ? `${unit}s` : unit;
  return `${n} ${plural} de ${name}`;
}

function buildList(selected: Recipe[]): ListItem[] {
  const merged = new Map<string, { qty: number; unit: string; name: string; sources: string[] }>();
  const plain = new Map<string, ListItem>();
  const order: string[] = [];

  for (const recipe of selected) {
    for (const ing of recipe.ingredients) {
      const parsed = parseIngredient(ing.text);
      if (parsed) {
        const key = `q|${parsed.unit}|${normalize(parsed.name)}`;
        const prev = merged.get(key);
        if (prev) {
          prev.qty += parsed.qty;
          if (!prev.sources.includes(recipe.title)) prev.sources.push(recipe.title);
        } else {
          merged.set(key, { ...parsed, sources: [recipe.title] });
          order.push(key);
        }
      } else {
        const key = `t|${normalize(ing.text)}`;
        const prev = plain.get(key);
        if (prev) {
          if (!prev.sources.includes(recipe.title)) prev.sources.push(recipe.title);
        } else {
          plain.set(key, { key, label: ing.text.trim(), sources: [recipe.title] });
          order.push(key);
        }
      }
    }
  }

  return order.map((key) => {
    const m = merged.get(key);
    if (m) return { key, label: formatQty(m.qty, m.unit, m.name), sources: m.sources };
    return plain.get(key)!;
  });
}

function loadSaved(): { selected: string[]; have: string[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        selected: Array.isArray(parsed.selected) ? parsed.selected : [],
        have: Array.isArray(parsed.have) ? parsed.have : [],
      };
    }
  } catch {
    // sin almacenamiento disponible
  }
  return { selected: [], have: [] };
}

export function ShoppingListBuilder({ recipes, onCopySuccess }: ShoppingListBuilderProps) {
  const saved = useMemo(loadSaved, []);
  const [selectedIds, setSelectedIds] = useState<string[]>(saved.selected);
  const [haveKeys, setHaveKeys] = useState<string[]>(saved.have);
  const [hideHave, setHideHave] = useState(false);

  const persist = (selected: string[], have: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ selected, have }));
    } catch {
      // sin almacenamiento disponible
    }
  };

  const selectedRecipes = recipes.filter((r) => selectedIds.includes(r.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => buildList(selectedRecipes), [recipes, selectedIds]);
  const toBuy = items.filter((i) => !haveKeys.includes(i.key));

  const toggleRecipe = (id: string) => {
    const next = selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];
    setSelectedIds(next);
    persist(next, haveKeys);
  };

  const toggleHave = (key: string) => {
    const next = haveKeys.includes(key) ? haveKeys.filter((x) => x !== key) : [...haveKeys, key];
    setHaveKeys(next);
    persist(selectedIds, next);
  };

  const selectAll = () => {
    const next = selectedIds.length === recipes.length ? [] : recipes.map((r) => r.id);
    setSelectedIds(next);
    persist(next, haveKeys);
  };

  const resetHave = () => {
    setHaveKeys([]);
    persist(selectedIds, []);
  };

  const copyList = async () => {
    const text =
      `🛒 *Lista de compras*\n` +
      `Recetas: ${selectedRecipes.map((r) => r.title).join(', ')}\n\n` +
      toBuy.map((i) => `• ${i.label}`).join('\n') +
      `\n\nPaulina Rivero · Presentadora de Thermomix`;
    try {
      await navigator.clipboard.writeText(text);
      onCopySuccess('Lista copiada. Pégala en WhatsApp.');
    } catch {
      onCopySuccess('No se pudo copiar automáticamente en este navegador.');
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `🛒 *Lista de compras*\n\n${toBuy.map((i) => `• ${i.label}`).join('\n')}`
  )}`;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A241E]">Lista general de compras</h1>
        <p className="text-sm sm:text-base text-[#5A665E] max-w-2xl">
          Elige las recetas de tu clase y la app junta todos los ingredientes en una sola lista. Los repetidos se
          suman (por ejemplo, 100 g + 100 g de azúcar = 200 g). Marca lo que ya tienes para que quede solo lo que hay
          que comprar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Paso 1: elegir recetas */}
        <section className="lg:col-span-5 rounded-3xl bg-white border border-[#E4E1D8] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-[#1A241E] flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
              1. Elige las recetas
            </h2>
            <button
              type="button"
              onClick={selectAll}
              className="text-sm font-medium text-[#2D6A4F] hover:underline cursor-pointer min-h-[44px] px-2"
            >
              {selectedIds.length === recipes.length ? 'Quitar todas' : 'Elegir todas'}
            </button>
          </div>
          <ul className="space-y-2">
            {recipes.map((r) => {
              const on = selectedIds.includes(r.id);
              return (
                <li key={r.id}>
                  <label
                    className={`flex items-center gap-3 min-h-[52px] px-3 py-2 rounded-2xl border cursor-pointer transition-colors ${
                      on ? 'border-[#2D6A4F] bg-[#2D6A4F]/5' : 'border-[#E4E1D8] hover:bg-[#F3F1EB]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleRecipe(r.id)}
                      className="w-5 h-5 accent-[#2D6A4F] shrink-0"
                    />
                    <span className="flex-1 text-sm sm:text-base font-medium text-[#1A241E]">{r.title}</span>
                    <span className="text-xs text-[#5A665E] whitespace-nowrap">{r.ingredients.length} ingr.</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Paso 2: lista combinada */}
        <section className="lg:col-span-7 rounded-3xl bg-white border border-[#E4E1D8] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-[#1A241E] flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
              2. Lista de compras
            </h2>
            <p className="text-sm text-[#5A665E]">
              {toBuy.length} por comprar · {items.length - toBuy.length} ya lo tengo
            </p>
          </div>

          {selectedRecipes.length === 0 ? (
            <p className="text-sm text-[#5A665E] py-8 text-center">
              Marca una o más recetas a la izquierda para armar la lista.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copyList()}
                  className="min-h-[44px] px-4 rounded-xl bg-[#2D6A4F] text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
                >
                  <ClipboardCopy className="w-4 h-4" aria-hidden="true" />
                  Copiar lista para WhatsApp
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] px-4 rounded-xl border border-[#E4E1D8] text-sm font-medium inline-flex items-center gap-2 text-[#1A241E] hover:bg-[#F3F1EB]"
                >
                  Enviar por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setHideHave((v) => !v)}
                  className="min-h-[44px] px-4 rounded-xl border border-[#E4E1D8] text-sm font-medium text-[#1A241E] hover:bg-[#F3F1EB] cursor-pointer"
                >
                  {hideHave ? 'Mostrar todo' : 'Ocultar lo que ya tengo'}
                </button>
                <button
                  type="button"
                  onClick={resetHave}
                  className="min-h-[44px] px-3 rounded-xl text-sm font-medium text-[#5A665E] hover:text-[#1A241E] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  Limpiar marcas
                </button>
              </div>

              <ul className="divide-y divide-[#E4E1D8]">
                {items
                  .filter((i) => !(hideHave && haveKeys.includes(i.key)))
                  .map((i) => {
                    const have = haveKeys.includes(i.key);
                    return (
                      <li key={i.key}>
                        <button
                          type="button"
                          onClick={() => toggleHave(i.key)}
                          aria-pressed={have}
                          className="w-full flex items-start gap-3 py-3 text-left cursor-pointer"
                        >
                          <span
                            className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${
                              have ? 'bg-[#2D6A4F] border-[#2D6A4F]' : 'border-[#2D6A4F] bg-white'
                            }`}
                          >
                            {have && <Check className="w-4 h-4 text-white" aria-hidden="true" />}
                          </span>
                          <span className="flex-1">
                            <span
                              className={`block text-sm sm:text-base ${
                                have ? 'line-through text-[#9AA39C]' : 'text-[#1A241E]'
                              }`}
                            >
                              {i.label}
                            </span>
                            <span className="block text-xs text-[#5A665E] mt-0.5">{i.sources.join(' · ')}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
