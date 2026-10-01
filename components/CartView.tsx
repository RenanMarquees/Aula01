"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { byPosition, describeChoices, findItem, formatPrice, unitPrice } from "@/lib/menu-helpers";
import { fieldLabels, firstError, validateOrder } from "@/lib/order";
import type { MenuData } from "@/lib/types";
import { BackButton } from "./BackButton";
import { ItemPhoto } from "./Icon";
import { MenuGate } from "./MenuGate";
import { OrderForm } from "./OrderForm";
import { PageShell } from "./PageShell";
import { QtyStepper } from "./QtyStepper";

export function CartView() {
  return <MenuGate>{(menu) => <CartBody menu={menu} />}</MenuGate>;
}

function CartBody({ menu }: { menu: MenuData }) {
  const router = useRouter();
  const cart = useCart();
  const [showErrors, setShowErrors] = useState(false);

  const allErrors = validateOrder(cart.order, cart.totalWithFee, menu);
  const missing = firstError(allErrors);
  const blockedByPausedItems = cart.unavailableCount > 0 || cart.count === 0;

  function handleContinue() {
    if (blockedByPausedItems) {
      document
        .querySelector("[data-indisponivel]")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (missing) {
      setShowErrors(true);
      document
        .getElementById(`campo-${missing}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    router.push("/confirmacao");
  }

  const buttonLabel = blockedByPausedItems
    ? "Remova os itens indisponíveis"
    : missing
      ? `Complete: ${fieldLabels[missing]}`
      : "Revisar pedido";

  return (
    <PageShell className="pb-52">
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
                const item = findItem(menu, line.itemId);
                if (!item) return null;
                const details = describeChoices(item, line.choices);
                const paused = !item.available;
                return (
                  <li
                    key={line.key}
                    {...(paused ? { "data-indisponivel": "" } : {})}
                    className={`flex gap-3.5 rounded-2xl border bg-surface p-3 ${
                      paused ? "border-danger/50" : "border-line"
                    }`}
                  >
                    <ItemPhoto
                      item={item}
                      iconSize={24}
                      className={`h-16 w-16 shrink-0 rounded-xl ${paused ? "opacity-50" : ""}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-[14.5px] font-semibold leading-snug">{item.name}</h2>
                        {!paused && (
                          <span className="shrink-0 text-[14px] font-semibold tabular-nums">
                            {formatPrice(unitPrice(item, line.choices) * line.qty)}
                          </span>
                        )}
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
                        {paused ? (
                          <div className="flex items-center justify-between gap-2">
                            <p role="alert" className="text-[12.5px] font-medium text-danger">
                              Acabou por hoje
                            </p>
                            <button
                              type="button"
                              onClick={() => cart.changeQty(line.key, -line.qty)}
                              className="flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-[13px] font-medium text-ink active:bg-tile"
                            >
                              <Trash2 size={15} strokeWidth={1.6} aria-hidden />
                              Remover
                            </button>
                          </div>
                        ) : (
                          <QtyStepper
                            qty={line.qty}
                            label={item.name}
                            onMinus={() => cart.changeQty(line.key, -1)}
                            onPlus={() => cart.changeQty(line.key, 1)}
                            minusAsTrash={line.qty === 1}
                          />
                        )}
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
                className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-[16px] placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
            </div>

            <OrderForm
              order={cart.order}
              zones={byPosition(menu.zones)}
              errors={showErrors ? allErrors : {}}
              onChange={cart.updateOrder}
            />
          </main>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
            <div className="mx-auto max-w-md space-y-2 p-3">
              <div className="space-y-0.5 px-1">
                <div className="flex items-baseline justify-between text-[13px] text-muted">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatPrice(cart.total)}</span>
                </div>
                {cart.order.type === "entrega" && (
                  <div className="flex items-baseline justify-between text-[13px] text-muted">
                    <span>Taxa de entrega</span>
                    <span className="tabular-nums">
                      {cart.fee > 0 ? formatPrice(cart.fee) : "escolha o bairro"}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="text-[13px] font-medium">Total</span>
                  <span className="font-display text-[22px] tabular-nums">
                    {formatPrice(cart.totalWithFee)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleContinue}
                aria-disabled={blockedByPausedItems || missing !== null}
                className={`min-h-12 w-full rounded-full text-[14px] font-medium tracking-wide text-white ${
                  blockedByPausedItems || missing ? "bg-muted/60" : "bg-accent active:bg-accent-dark"
                }`}
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}
