import { formatPrice } from "@/lib/menu-data";

type Props = {
  count: number;
  total: number;
  onOpen: () => void;
};

/** Carrinho fixo, logo acima da barra de categorias. */
export function CartBar({ count, total, onOpen }: Props) {
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 px-3 pb-2">
      <button
        type="button"
        onClick={onOpen}
        className="mx-auto flex min-h-14 w-full max-w-md items-center justify-between rounded-2xl bg-orange-600 px-4 text-white shadow-lg active:bg-orange-700"
      >
        <span className="flex items-center gap-2 font-semibold">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-1.5 text-sm text-orange-700">
            {count}
          </span>
          Ver carrinho
        </span>
        <span className="font-bold">{formatPrice(total)}</span>
      </button>
    </div>
  );
}
