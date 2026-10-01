import Link from "next/link";
import { formatPrice, isSimple, type MenuItem } from "@/lib/menu-data";
import { PhotoPlaceholder } from "./Icon";
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
      className={`flex gap-3.5 rounded-2xl border border-line bg-surface p-3 ${
        item.available ? "" : "opacity-60"
      }`}
    >
      {/* Foto provisória: troque pela foto real no painel (Etapa 4). */}
      <Wrapper available={item.available} href={href} tabIndex={-1} ariaHidden className="shrink-0">
        <PhotoPlaceholder name={item.icon} size={30} className="h-[84px] w-[84px] rounded-xl" />
      </Wrapper>

      <div className="flex min-w-0 flex-1 flex-col">
        <Wrapper available={item.available} href={href}>
          <h3 className="text-[15px] font-semibold leading-snug">{item.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-muted">
            {item.description}
          </p>
        </Wrapper>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <div className="leading-none">
            {!simple && <span className="mb-1 block text-[11px] text-muted">a partir de</span>}
            <span className="text-[14px] font-semibold tabular-nums">{formatPrice(item.price)}</span>
          </div>

          {!item.available ? (
            <span className="rounded-full border border-line px-3 py-2 text-[11.5px] font-medium text-muted">
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
              className="min-h-11 rounded-full bg-accent px-5 text-[13px] font-medium tracking-wide text-white active:bg-accent-dark"
            >
              Adicionar
            </button>
          ) : (
            <Link
              href={href}
              aria-label={`Escolher opções de ${item.name}`}
              className="flex min-h-11 items-center rounded-full border border-accent px-5 text-[13px] font-medium tracking-wide text-accent active:bg-accent-soft"
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
