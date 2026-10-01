"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { useCart } from "@/lib/cart";
import { byPosition } from "@/lib/menu-helpers";
import type { MenuData } from "@/lib/types";
import { CartBar } from "./CartBar";
import { CategoryNav } from "./CategoryNav";
import { Cover } from "./Cover";
import { Icon } from "./Icon";
import { ItemCard } from "./ItemCard";
import { MenuGate } from "./MenuGate";
import { PageShell } from "./PageShell";

export function Menu() {
  return <MenuGate>{(menu) => <MenuView menu={menu} />}</MenuGate>;
}

function MenuView({ menu }: { menu: MenuData }) {
  const cart = useCart();

  // Só mostra categorias que têm pelo menos um prato.
  const sections = byPosition(menu.categories)
    .map((category) => ({
      category,
      items: byPosition(menu.items.filter((item) => item.categoryId === category.id)),
    }))
    .filter((section) => section.items.length > 0);
  const categories = sections.map((section) => section.category);
  const categoryKey = categories.map((category) => category.id).join("|");

  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  // Destaca na barra a categoria que está aparecendo na tela.
  useEffect(() => {
    const ids = categoryKey ? categoryKey.split("|") : [];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -60% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [categoryKey]);

  function goTo(categoryId: string) {
    setActiveId(categoryId);
    document.getElementById(categoryId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <PageShell className="pb-44">
      <Cover settings={menu.settings} />

      {sections.length === 0 ? (
        <div className="flex flex-col items-center px-8 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tile text-accent">
            <UtensilsCrossed size={28} strokeWidth={1.3} aria-hidden />
          </span>
          <h2 className="mt-5 font-display text-[21px] font-normal">Cardápio em preparação</h2>
          <p className="mt-1 text-[13.5px] text-muted">Em breve os pratos aparecem por aqui.</p>
        </div>
      ) : (
        <main className="space-y-9 px-4">
          {sections.map(({ category, items }) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-titulo`}
              className="scroll-mt-4"
            >
              <h2
                id={`${category.id}-titulo`}
                className="mb-3.5 flex items-center gap-2.5 px-1 font-display text-[21px] font-normal tracking-tight"
              >
                <Icon name={category.icon} size={20} className="text-accent" />
                {category.name}
                <span aria-hidden className="ml-1 h-px flex-1 bg-line" />
              </h2>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    qty={cart.plainQtyOf(item.id)}
                    onChangeQty={(delta) => cart.changePlainQty(item.id, delta)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </main>
      )}

      <CartBar count={cart.count} total={cart.total} />
      {categories.length > 0 && (
        <CategoryNav categories={categories} activeId={activeId} onSelect={goTo} />
      )}
    </PageShell>
  );
}
