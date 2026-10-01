"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { describeChoices, findItem, formatPrice, unitPrice } from "@/lib/menu-data";
import { showToast } from "@/lib/toast";
import { BackButton } from "./BackButton";
import { PageShell } from "./PageShell";
import { QtyStepper } from "./QtyStepper";

export function CartView() {
  const cart = useCart();

  return (
    <PageShell className="pb-32">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-stone-200 bg-[var(--background)]/95 px-3 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur">
        <BackButton label="Voltar ao cardápio" />
        <h1 className="text-xl font-bold">Seu pedido</h1>
      </header>

      {!cart.ready ? null : cart.lines.length === 0 ? (
        <div className="flex flex-col items-center px-8 py-20 text-center">
          <span aria-hidden className="text-6xl">
            🛒
          </span>
          <h2 className="mt-4 text-xl font-bold">Seu carrinho está vazio</h2>
          <p className="mt-1 text-stone-600">Escolha alguns pratos para começar o pedido.</p>
          <Link
            href="/"
            className="mt-6 flex min-h-12 items-center rounded-full bg-orange-600 px-6 font-semibold text-white active:bg-orange-700"
          >
            Ver cardápio
          </Link>
        </div>
      ) : (
        <>
          <main className="space-y-6 px-4 py-4">
            <ul className="space-y-3">
              {cart.lines.map((line) => {
                const item = findItem(line.itemId);
                if (!item) return null;
                const details = describeChoices(item, line.choices);
                return (
                  <li key={line.key} className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-stone-200">
                    <div
                      aria-hidden
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-3xl ${item.tone}`}
                    >
                      {item.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-semibold leading-snug">{item.name}</h2>
                        <span className="shrink-0 font-bold text-orange-700">
                          {formatPrice(unitPrice(item, line.choices) * line.qty)}
                        </span>
                      </div>
                      {details.map((detail) => (
                        <p key={detail} className="text-sm leading-snug text-stone-600">
                          {detail}
                        </p>
                      ))}
                      {line.note && (
                        <p className="mt-0.5 text-sm italic leading-snug text-stone-500">
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

            <Link href="/" className="flex min-h-11 items-center justify-center font-semibold text-orange-700">
              + Adicionar mais itens
            </Link>

            <div>
              <label htmlFor="observacao-geral" className="mb-1 block font-semibold">
                Observação para o pedido todo
              </label>
              <textarea
                id="observacao-geral"
                value={cart.generalNote}
                onChange={(event) => cart.setGeneralNote(event.target.value)}
                maxLength={200}
                rows={3}
                placeholder="Ex.: trazer os pratos juntos, alergia a amendoim…"
                className="w-full resize-none rounded-xl border border-stone-300 bg-white p-3 text-base placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </main>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
            <div className="mx-auto max-w-md space-y-2 p-3">
              <div className="flex items-baseline justify-between px-1">
                <span className="text-stone-600">Subtotal</span>
                <span className="text-xl font-bold">{formatPrice(cart.total)}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  showToast("Em breve: escolha de mesa, retirada ou entrega.")
                }
                className="min-h-12 w-full rounded-full bg-orange-600 font-semibold text-white shadow-sm active:bg-orange-700"
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
