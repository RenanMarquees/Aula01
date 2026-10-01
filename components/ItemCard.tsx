import Link from "next/link";
import { formatPrice, isSimple, type MenuItem } from "@/lib/menu-data";
import { QtyStepper } from "./QtyStepper";

type Props = {
  item: MenuItem;
  /** Unidades do item simples já no carrinho (usado pelo seletor − 2 +). */
  qty: number;
  onChangeQty: (delta: number) => void;
};

export function ItemCard({ item, qty, onChangeQty }: Props) {
  const simple = isSimple(item);
  const href = `/item/${item.id}`;

  return (
    <li
      className={`flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200 ${
        item.available ? "" : "opacity-60"
      }`}
    >
      {/* Foto provisória: troque pela foto real no painel (Etapa 4). */}
      <Wrapper available={item.available} href={href} tabIndex={-1} ariaHidden className="shrink-0">
        <div
          aria-hidden
          className={`flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br text-5xl ${item.tone}`}
        >
          {item.emoji}
        </div>
      </Wrapper>

      <div className="flex min-w-0 flex-1 flex-col">
        <Wrapper available={item.available} href={href}>
          <h3 className="font-semibold leading-snug">{item.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-stone-600">
            {item.description}
          </p>
        </Wrapper>

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
            <QtyStepper
              qty={qty}
              label={item.name}
              onMinus={() => onChangeQty(-1)}
              onPlus={() => onChangeQty(1)}
            />
          ) : simple ? (
            <button
              type="button"
              onClick={() => onChangeQty(1)}
              aria-label={`Adicionar ${item.name}`}
              className="min-h-11 rounded-full bg-orange-600 px-5 text-sm font-semibold text-white shadow-sm active:bg-orange-700"
            >
              Adicionar
            </button>
          ) : (
            <Link
              href={href}
              aria-label={`Escolher opções de ${item.name}`}
              className="flex min-h-11 items-center rounded-full bg-orange-600 px-5 text-sm font-semibold text-white shadow-sm active:bg-orange-700"
            >
              Escolher
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

/** Torna foto e texto clicáveis (abrem o detalhe), exceto em itens esgotados. */
function Wrapper({
  available,
  href,
  children,
  className = "",
  tabIndex,
  ariaHidden,
}: {
  available: boolean;
  href: string;
  children: React.ReactNode;
  className?: string;
  tabIndex?: number;
  ariaHidden?: boolean;
}) {
  if (!available) return <div className={className}>{children}</div>;
  return (
    <Link href={href} tabIndex={tabIndex} aria-hidden={ariaHidden} className={`block ${className}`}>
      {children}
    </Link>
  );
}
