import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/menu-helpers";

type Props = {
  count: number;
  total: number;
};

/** Carrinho fixo, logo acima da barra de categorias. */
export function CartBar({ count, total }: Props) {
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 px-3 pb-2">
      <Link
        href="/carrinho"
        className="mx-auto flex min-h-13 w-full max-w-md items-center justify-between rounded-2xl bg-ink px-4 text-white shadow-[0_8px_24px_-8px_rgba(35,29,25,0.55)] active:bg-black"
      >
        <span className="flex items-center gap-2.5 text-[14px] font-medium">
          <span className="relative">
            <ShoppingBag size={20} strokeWidth={1.5} aria-hidden />
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none">
              {count}
            </span>
          </span>
          <span className="ml-1">Ver carrinho</span>
        </span>
        <span className="text-[14px] font-semibold tabular-nums">{formatPrice(total)}</span>
      </Link>
    </div>
  );
}
