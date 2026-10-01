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
      <div
        aria-hidden
        className={`relative flex h-64 items-center justify-center bg-gradient-to-br text-8xl ${item.tone}`}
      >
        {item.emoji}
      </div>
      <BackButton className="fixed left-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-20" />

      <main className="space-y-6 px-4 py-5">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
          <p className="mt-1 text-stone-600">{item.description}</p>
          <p className="mt-2 text-lg font-bold text-orange-700">
            {item.optionGroups?.length ? "a partir de " : ""}
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
              className={`scroll-mt-20 rounded-2xl bg-white p-3 ring-1 ${
                isMissing ? "ring-2 ring-red-500" : "ring-stone-200"
              }`}
            >
              <legend className="sr-only">{group.title}</legend>
              <div className="mb-1 flex items-center justify-between px-1">
                <h2 className="font-semibold" aria-hidden>
                  {group.title}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    group.required ? "bg-orange-100 text-orange-800" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {group.required ? "Obrigatório" : "Opcional"}
                </span>
              </div>
              <p className="px-1 text-xs text-stone-500">
                {group.type === "single" ? "Escolha 1 opção" : "Escolha quantas quiser"}
              </p>
              {isMissing && (
                <p role="alert" className="mt-2 px-1 text-sm font-medium text-red-600">
                  Escolha: {group.title.toLowerCase()}
                </p>
              )}

              <ul className="mt-1">
                {group.choices.map((choice) => (
                  <li key={choice.id}>
                    <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl px-1 active:bg-stone-50">
                      <input
                        type={group.type === "single" ? "radio" : "checkbox"}
                        name={group.id}
                        checked={picked.includes(choice.id)}
                        onChange={() => pick(group, choice.id)}
                        className="h-5 w-5 shrink-0 accent-orange-600"
                      />
                      <span className="flex-1">{choice.name}</span>
                      {choice.price > 0 && (
                        <span className="text-sm text-stone-600">+ {formatPrice(choice.price)}</span>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          );
        })}

        <div>
          <label htmlFor="observacao" className="mb-1 block font-semibold">
            Alguma observação?
          </label>
          <textarea
            id="observacao"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={140}
            rows={2}
            placeholder="Ex.: sem cebola, molho à parte…"
            className="w-full resize-none rounded-xl border border-stone-300 bg-white p-3 text-base placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <p className="mt-1 text-right text-xs text-stone-500">{note.length}/140</p>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
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
            className={`min-h-12 flex-1 rounded-full px-4 font-semibold text-white shadow-sm ${
              missing.length > 0 ? "bg-stone-400" : "bg-orange-600 active:bg-orange-700"
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
