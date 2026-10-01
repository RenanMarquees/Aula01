"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import {
  formatPrice,
  missingGroups,
  unitPrice,
  type Choices,
  type MenuItem,
  type OptionGroup,
} from "@/lib/menu-data";
import { showToast } from "@/lib/toast";
import { BackButton } from "./BackButton";
import { PhotoPlaceholder } from "./Icon";
import { PageShell } from "./PageShell";
import { QtyStepper } from "./QtyStepper";

export function ItemDetail({ item }: { item: MenuItem }) {
  const router = useRouter();
  const cart = useCart();
  const [choices, setChoices] = useState<Choices>({});
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const [triedToAdd, setTriedToAdd] = useState(false);

  const missing = missingGroups(item, choices);
  const total = unitPrice(item, choices) * qty;

  function pick(group: OptionGroup, choiceId: string) {
    setChoices((current) => {
      const picked = current[group.id] ?? [];
      if (group.type === "single") return { ...current, [group.id]: [choiceId] };
      return {
        ...current,
        [group.id]: picked.includes(choiceId)
          ? picked.filter((id) => id !== choiceId)
          : [...picked, choiceId],
      };
    });
  }

  function handleAdd() {
    if (missing.length > 0) {
      setTriedToAdd(true);
      document
        .getElementById(`grupo-${missing[0].id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    cart.addLine(item.id, qty, choices, note);
    showToast(`${qty}× ${item.name} no carrinho`);
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <PageShell className="pb-32">
      <PhotoPlaceholder name={item.icon} size={72} className="h-56 w-full" />
      <BackButton className="fixed left-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-20" />

      <main className="space-y-5 px-5 py-6">
        <header>
          <h1 className="font-display text-[26px] font-normal leading-tight tracking-tight">
            {item.name}
          </h1>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{item.description}</p>
          <p className="mt-3 text-[15px] font-semibold tabular-nums">
            {item.optionGroups?.length ? (
              <span className="mr-1 text-[12px] font-normal text-muted">a partir de</span>
            ) : null}
            {formatPrice(item.price)}
          </p>
        </header>

        {item.optionGroups?.map((group) => {
          const picked = choices[group.id] ?? [];
          const isMissing = triedToAdd && group.required && picked.length === 0;
          return (
            <fieldset
              key={group.id}
              id={`grupo-${group.id}`}
              className={`scroll-mt-20 rounded-2xl border bg-surface px-4 py-3 ${
                isMissing ? "border-danger ring-1 ring-danger" : "border-line"
              }`}
            >
              <legend className="sr-only">{group.title}</legend>
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold" aria-hidden>
                  {group.title}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider ${
                    group.required ? "bg-accent-soft text-accent-dark" : "bg-tile text-muted"
                  }`}
                >
                  {group.required ? "Obrigatório" : "Opcional"}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-muted">
                {group.type === "single" ? "Escolha 1 opção" : "Escolha quantas quiser"}
              </p>
              {isMissing && (
                <p role="alert" className="mt-2 text-[13px] font-medium text-danger">
                  Escolha: {group.title.toLowerCase()}
                </p>
              )}

              <ul className="mt-1 divide-y divide-line">
                {group.choices.map((choice) => (
                  <li key={choice.id}>
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 text-[14px]">
                      <input
                        type={group.type === "single" ? "radio" : "checkbox"}
                        name={group.id}
                        checked={picked.includes(choice.id)}
                        onChange={() => pick(group, choice.id)}
                        className="h-[18px] w-[18px] shrink-0 accent-accent"
                      />
                      <span className="flex-1">{choice.name}</span>
                      {choice.price > 0 && (
                        <span className="text-[12.5px] tabular-nums text-muted">
                          + {formatPrice(choice.price)}
                        </span>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          );
        })}

        <div>
          <label htmlFor="observacao" className="mb-1.5 block text-[14px] font-semibold">
            Alguma observação?
          </label>
          <textarea
            id="observacao"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={140}
            rows={2}
            placeholder="Ex.: sem cebola, molho à parte…"
            className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-[16px] placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
          <p className="mt-1 text-right text-[11px] tabular-nums text-muted">{note.length}/140</p>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3 p-3">
          <QtyStepper
            qty={qty}
            label={item.name}
            onMinus={() => setQty((current) => Math.max(1, current - 1))}
            onPlus={() => setQty((current) => Math.min(99, current + 1))}
            minusDisabled={qty <= 1}
          />
          <button
            type="button"
            onClick={handleAdd}
            aria-disabled={missing.length > 0}
            className={`min-h-12 flex-1 rounded-full px-4 text-[14px] font-medium leading-tight tracking-wide text-white ${
              missing.length > 0 ? "bg-muted/60" : "bg-accent active:bg-accent-dark"
            }`}
          >
            {missing.length > 0
              ? `Escolha: ${missing[0].title.toLowerCase()}`
              : `Adicionar · ${formatPrice(total)}`}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
