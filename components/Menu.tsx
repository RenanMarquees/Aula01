"use client";

import { useEffect, useRef, useState } from "react";
import { categories, items } from "@/lib/menu-data";
import { useCart } from "@/lib/cart";
import { Cover } from "./Cover";
import { CategoryNav } from "./CategoryNav";
import { ItemCard } from "./ItemCard";
import { CartBar } from "./CartBar";

export function Menu() {
  const cart = useCart();
  const [activeId, setActiveId] = useState(categories[0].id);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Destaca na barra a categoria que está aparecendo na tela.
  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(category.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function goTo(categoryId: string) {
    setActiveId(categoryId);
    document.getElementById(categoryId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showToast(message: string) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-[var(--background)] pb-44">
      <Cover />

      <main className="space-y-8 px-4">
        {categories.map((category) => (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-titulo`} className="scroll-mt-4">
            <h2 id={`${category.id}-titulo`} className="mb-3 flex items-center gap-2 text-xl font-bold">
              <span aria-hidden>{category.emoji}</span>
              {category.name}
            </h2>
            <ul className="space-y-3">
              {items
                .filter((item) => item.categoryId === category.id)
                .map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    qty={cart.qtyOf(item.id)}
                    onAdd={() => cart.add(item.id)}
                    onRemove={() => cart.remove(item.id)}
                    onChoose={() =>
                      showToast("Em breve: a tela de opções chega na próxima etapa.")
                    }
                  />
                ))}
            </ul>
          </section>
        ))}
      </main>

      {toast && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-[calc(8.5rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4"
        >
          <p className="rounded-full bg-stone-900 px-4 py-2 text-sm text-white shadow-lg">{toast}</p>
        </div>
      )}

      <CartBar
        count={cart.count}
        total={cart.total}
        onOpen={() => showToast("Em breve: a tela do carrinho chega na próxima etapa.")}
      />
      <CategoryNav categories={categories} activeId={activeId} onSelect={goTo} />
    </div>
  );
}
