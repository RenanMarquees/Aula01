import { formatPrice, isSimple, type MenuItem } from "@/lib/menu-data";

type Props = {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  onChoose: () => void;
};

export function ItemCard({ item, qty, onAdd, onRemove, onChoose }: Props) {
  const simple = isSimple(item);

  return (
    <li
      className={`flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200 ${
        item.available ? "" : "opacity-60"
      }`}
    >
      {/* Foto provisória: troque pela foto real no painel (Etapa 4). */}
      <div
        aria-hidden
        className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-5xl ${item.tone}`}
      >
        {item.emoji}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-semibold leading-snug">{item.name}</h3>
        <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-stone-600">
          {item.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            {!simple && <span className="block text-xs text-stone-500">a partir de</span>}
            <span className="font-bold text-orange-700">{formatPrice(item.price)}</span>
          </div>

          {!item.available ? (
            <span className="rounded-full bg-stone-100 px-3 py-2 text-xs font-medium text-stone-600">
              Esgotado hoje
            </span>
          ) : simple && qty > 0 ? (
            <div className="flex items-center rounded-full bg-orange-50 ring-1 ring-orange-200">
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Tirar uma unidade de ${item.name}`}
                className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-semibold text-orange-700 active:bg-orange-100"
              >
                −
              </button>
              <span aria-live="polite" className="w-6 text-center font-semibold">
                {qty}
              </span>
              <button
                type="button"
                onClick={onAdd}
                aria-label={`Adicionar mais uma unidade de ${item.name}`}
                className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-semibold text-orange-700 active:bg-orange-100"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={simple ? onAdd : onChoose}
              aria-label={`${simple ? "Adicionar" : "Escolher opções de"} ${item.name}`}
              className="min-h-11 rounded-full bg-orange-600 px-5 text-sm font-semibold text-white shadow-sm active:bg-orange-700"
            >
              {simple ? "Adicionar" : "Escolher"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
