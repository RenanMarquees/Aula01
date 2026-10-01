"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { describeChoices, findItem, formatPrice, unitPrice } from "@/lib/menu-data";
import { showToast } from "@/lib/toast";
import { BackButton } from "./BackButton";
import { PhotoPlaceholder } from "./Icon";
import { PageShell } from "./PageShell";
import { QtyStepper } from "./QtyStepper";

export function CartView() {
  const cart = useCart();

  return (
    <PageShell className="pb-36">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-paper/95 px-3 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur">
        <BackButton label="Voltar ao cardápio" />
        <h1 className="font-display text-[21px] font-normal tracking-tight">Seu pedido</h1>
      </header>

      {!cart.ready ? null : cart.lines.length === 0 ? (
        <div className="flex flex-col items-center px-8 py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tile text-accent">
            <ShoppingBag size={28} strokeWidth={1.3} aria-hidden />
          </span>
          <h2 className="mt-5 font-display text-[21px] font-normal">Seu carrinho está vazio</h2>
          <p className="mt-1 text-[13.5px] text-muted">Escolha alguns pratos para começar o pedido.</p>
          <Link
            href="/"
            className="mt-7 flex min-h-12 items-center rounded-full bg-accent px-7 text-[14px] font-medium tracking-wide text-white active:bg-accent-dark"
          >
            Ver cardápio
          </Link>
        </div>
      ) : (
        <>
          <main className="space-y-6 px-4 py-4">
            <ul className="space-y-2.5">
              {cart.lines.map((line) => {
                const item = findItem(line.itemId);
                if (!item) return null;
                const details = describeChoices(item, line.choices);
                return (
                  <li key={line.key} className="flex gap-3.5 rounded-2xl border border-line bg-surface p-3">
                    <PhotoPlaceholder name={item.icon} size={24} className="h-16 w-16 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-[14.5px] font-semibold leading-snug">{item.name}</h2>
                        <span className="shrink-0 text-[14px] font-semibold tabular-nums">
                          {formatPrice(unitPrice(item, line.choices) * line.qty)}
                        </span>
                      </div>
                      {details.map((detail) => (
                        <p key={detail} className="mt-0.5 text-[12.5px] leading-snug text-muted">
                          {detail}
                        </p>
                      ))}
                      {line.note && (
                        <p className="mt-0.5 text-[12.5px] italic leading-snug text-muted">
                          Obs.: {line.note}
                        </p>
                      )}
                      <div className="mt-2">
                        <QtyStepper
                          qty={line.qty}
                          label={item.name}
                          onMinus={() => cart.changeQty(line.key, -1)}
                          onPlus={() => cart.changeQty(line.key, 1)}
                          minusAsTrash={line.qty === 1}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/"
              className="flex min-h-11 items-center justify-center text-[13.5px] font-medium text-accent"
            >
              + Adicionar mais itens
            </Link>

            <div>
              <label htmlFor="observacao-geral" className="mb-1.5 block text-[14px] font-semibold">
                Observação para o pedido todo
              </label>
              <textarea
                id="observacao-geral"
                value={cart.generalNote}
                onChange={(event) => cart.setGeneralNote(event.target.value)}
                maxLength={200}
                rows={3}
                placeholder="Ex.: trazer os pratos juntos, alergia a amendoim…"
                className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-[14px] placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
            </div>
          </main>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
            <div className="mx-auto max-w-md space-y-2.5 p-3">
              <div className="flex items-baseline justify-between px-1">
                <span className="text-[13px] text-muted">Subtotal</span>
                <span className="font-display text-[22px] tabular-nums">{formatPrice(cart.total)}</span>
              </div>
              <button
                type="button"
                onClick={() => showToast("Em breve: escolha de mesa, retirada ou entrega.")}
                className="min-h-12 w-full rounded-full bg-accent text-[14px] font-medium tracking-wide text-white active:bg-accent-dark"
              >
                Continuar
              </button>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}
