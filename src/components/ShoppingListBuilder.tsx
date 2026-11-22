import { useMemo, useState } from 'react';
import { Check, ClipboardCopy, ListChecks, RotateCcw, ShoppingBasket, Trash2, Undo2 } from 'lucide-react';
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

const STORAGE_KEY = 'lista-general-paulina-v2';
const OLD_STORAGE_KEY = 'lista-general-paulina-v1';

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

interface SavedState {
  selected: string[];
  mine: string[];
  removed: string[];
}

function loadSaved(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        selected: Array.isArray(parsed.selected) ? parsed.selected : [],
        mine: Array.isArray(parsed.mine) ? parsed.mine : [],
        removed: Array.isArray(parsed.removed) ? parsed.removed : [],
      };
    }
    // Versión anterior: conserva las recetas elegidas.
    const old = localStorage.getItem(OLD_STORAGE_KEY);
    if (old) {
      const parsed = JSON.parse(old);
      return { selected: Array.isArray(parsed.selected) ? parsed.selected : [], mine: [], removed: [] };
    }
  } catch {
    // sin almacenamiento disponible
  }
  return { selected: [], mine: [], removed: [] };
}

const listText = (title: string, list: ListItem[]) =>
  `${title}\n\n` + list.map((i) => `• ${i.label}`).join('\n');

export function ShoppingListBuilder({ recipes, onCopySuccess }: ShoppingListBuilderProps) {
  const saved = useMemo(loadSaved, []);
  const [selectedIds, setSelectedIds] = useState<string[]>(saved.selected);
  const [mineKeys, setMineKeys] = useState<string[]>(saved.mine);
  const [removedKeys, setRemovedKeys] = useState<string[]>(saved.removed);

  const persist = (next: Partial<SavedState>) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selected: selectedIds, mine: mineKeys, removed: removedKeys, ...next })
      );
    } catch {
      // sin almacenamiento disponible
    }
  };

  const selectedRecipes = recipes.filter((r) => selectedIds.includes(r.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => buildList(selectedRecipes), [recipes, selectedIds]);
  const visible = items.filter((i) => !removedKeys.includes(i.key));
  const removed = items.filter((i) => removedKeys.includes(i.key));
  const mine = visible.filter((i) => mineKeys.includes(i.key));
  const client = visible.filter((i) => !mineKeys.includes(i.key));

  const toggleRecipe = (id: string) => {
    const next = selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];
    setSelectedIds(next);
    persist({ selected: next });
  };

  const selectAll = () => {
    const next = selectedIds.length === recipes.length ? [] : recipes.map((r) => r.id);
    setSelectedIds(next);
    persist({ selected: next });
  };

  const toggleMine = (key: string) => {
    const next = mineKeys.includes(key) ? mineKeys.filter((x) => x !== key) : [...mineKeys, key];
    setMineKeys(next);
    persist({ mine: next });
  };

  const removeItem = (key: string) => {
    const next = [...removedKeys, key];
    setRemovedKeys(next);
    persist({ removed: next });
  };

  const restoreItem = (key: string) => {
    const next = removedKeys.filter((x) => x !== key);
    setRemovedKeys(next);
    persist({ removed: next });
  };

  const resetAll = () => {
    setMineKeys([]);
    setRemovedKeys([]);
    persist({ mine: [], removed: [] });
  };

  const clientText = listText('🛒 *Lo que necesitas tener para nuestra clase de cocina*', client) +
    '\n\n¡Nos vemos pronto! 💚\nPaulina Rivero · Presentadora de Thermomix';
  const mineText = listText('🧺 *Lo que llevo yo*', mine);

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onCopySuccess(msg);
    } catch {
      onCopySuccess('No se pudo copiar automáticamente en este navegador.');
    }
  };

  const btnMain =
    'min-h-[44px] px-4 rounded-xl bg-[#2D6A4F] text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer';
  const btnSoft =
    'min-h-[44px] px-4 rounded-xl border border-[#E4E1D8] text-sm font-medium inline-flex items-center gap-2 text-[#1A241E] hover:bg-[#F3F1EB] cursor-pointer';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A241E]">Lista general de compras</h1>
        <p className="text-sm sm:text-base text-[#5A665E] max-w-2xl">
          Elige las recetas de tu clase y la app junta todos los ingredientes (los repetidos se suman). Marca{' '}
          <strong>«Lo llevo yo»</strong> en lo que llevas tú y borra lo que no quieres en la lista. Abajo quedan
          separadas la lista para tu clienta y la tuya.
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

        {/* Paso 2: ordenar ingredientes */}
        <section className="lg:col-span-7 rounded-3xl bg-white border border-[#E4E1D8] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-[#1A241E] flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5 text-[#2D6A4F]" aria-hidden="true" />
              2. Ordena los ingredientes
            </h2>
            {(mineKeys.length > 0 || removedKeys.length > 0) && (
              <button
                type="button"
                onClick={resetAll}
                className="min-h-[44px] px-2 text-sm font-medium text-[#5A665E] hover:text-[#1A241E] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Empezar de nuevo
              </button>
            )}
          </div>

          {selectedRecipes.length === 0 ? (
            <p className="text-sm text-[#5A665E] py-8 text-center">
              Marca una o más recetas para armar la lista.
            </p>
          ) : (
            <>
              <p className="text-sm text-[#5A665E]">
                {client.length} para la clienta · {mine.length} los llevo yo
                {removed.length > 0 ? ` · ${removed.length} borrados` : ''}
              </p>
              <ul className="divide-y divide-[#E4E1D8]">
                {visible.map((i) => {
                  const isMine = mineKeys.includes(i.key);
                  return (
                    <li key={i.key} className="flex items-start gap-2 py-2.5">
                      <button
                        type="button"
                        onClick={() => toggleMine(i.key)}
                        aria-pressed={isMine}
                        className="flex-1 flex items-start gap-3 text-left cursor-pointer min-h-[44px]"
                      >
                        <span
                          className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${
                            isMine ? 'bg-[#2D6A4F] border-[#2D6A4F]' : 'border-[#2D6A4F] bg-white'
                          }`}
                        >
                          {isMine && <Check className="w-4 h-4 text-white" aria-hidden="true" />}
                        </span>
                        <span className="flex-1">
                          <span
                            className={`block text-sm sm:text-base ${
                              isMine ? 'line-through text-[#9AA39C]' : 'text-[#1A241E]'
                            }`}
                          >
                            {i.label}
                          </span>
                          <span className="block text-xs text-[#5A665E] mt-0.5">
                            {isMine ? 'Lo llevo yo · ' : ''}
                            {i.sources.join(' · ')}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(i.key)}
                        aria-label={`Borrar ${i.label} de la lista`}
                        title="Borrar de la lista"
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-[#9AA39C] hover:text-[#B3412E] hover:bg-[#FBEDEA] cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-[#5A665E]">
                Toca un ingrediente para marcar «Lo llevo yo». El basurero lo borra de las dos listas.
              </p>
              {removed.length > 0 && (
                <details className="rounded-2xl bg-[#F3F1EB] px-4 py-2">
                  <summary className="cursor-pointer text-sm font-medium text-[#1A241E] min-h-[40px] flex items-center">
                    Borrados ({removed.length})
                  </summary>
                  <ul className="pb-2">
                    {removed.map((i) => (
                      <li key={i.key} className="flex items-center justify-between gap-2 py-1">
                        <span className="text-sm text-[#5A665E]">{i.label}</span>
                        <button
                          type="button"
                          onClick={() => restoreItem(i.key)}
                          className="min-h-[40px] px-3 text-sm font-medium text-[#2D6A4F] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Undo2 className="w-4 h-4" aria-hidden="true" />
                          Recuperar
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </>
          )}
        </section>
      </div>

      {selectedRecipes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Lista para la clienta */}
          <section className="rounded-3xl bg-white border-2 border-[#2D6A4F] p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#1A241E]">🛒 Lo que debe tener la clienta</h2>
              <p className="text-sm text-[#5A665E]">{client.length} ingredientes · esta es la lista que le mandas</p>
            </div>
            {client.length === 0 ? (
              <p className="text-sm text-[#5A665E]">No queda nada para la clienta.</p>
            ) : (
              <ul className="space-y-1.5">
                {client.map((i) => (
                  <li key={i.key} className="text-sm sm:text-base text-[#1A241E]">
                    • {i.label}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copy(clientText, 'Lista de la clienta copiada. Pégala en WhatsApp.')}
                className={btnMain}
              >
                <ClipboardCopy className="w-4 h-4" aria-hidden="true" />
                Copiar lista de la clienta
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(clientText)}`}
                target="_blank"
                rel="noreferrer"
                className={btnSoft}
              >
                Enviar por WhatsApp
              </a>
            </div>
          </section>

          {/* Lo que lleva Paulina */}
          <section className="rounded-3xl bg-[#F3F1EB] border border-[#E4E1D8] p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#1A241E]">🧺 Lo que llevo yo</h2>
              <p className="text-sm text-[#5A665E]">Tu recordatorio para la presentación</p>
            </div>
            {mine.length === 0 ? (
              <p className="text-sm text-[#5A665E]">
                Todavía no marcas nada. Toca «Lo llevo yo» en los ingredientes que llevas tú.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {mine.map((i) => (
                  <li key={i.key} className="text-sm sm:text-base text-[#1A241E]">
                    • {i.label}
                  </li>
                ))}
              </ul>
            )}
            {mine.length > 0 && (
              <button
                type="button"
                onClick={() => void copy(mineText, 'Tu lista copiada.')}
                className={btnSoft}
              >
                <ClipboardCopy className="w-4 h-4" aria-hidden="true" />
                Copiar mi lista
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
