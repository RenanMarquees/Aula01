"use client";

import { useEffect, useState } from "react";
import { categories, items } from "@/lib/menu-data";
import { useCart } from "@/lib/cart";
import { Cover } from "./Cover";
import { CategoryNav } from "./CategoryNav";
import { ItemCard } from "./ItemCard";
import { CartBar } from "./CartBar";
import { PageShell } from "./PageShell";
import { Icon } from "./Icon";

export function Menu() {
  const cart = useCart();
  const [activeId, setActiveId] = useState(categories[0].id);

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

  return (
    <PageShell className="pb-44">
      <Cover />

      <main className="space-y-9 px-4">
        {categories.map((category) => (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-titulo`} className="scroll-mt-4">
            <h2
              id={`${category.id}-titulo`}
              className="mb-3.5 flex items-center gap-2.5 px-1 font-display text-[21px] font-normal tracking-tight"
            >
              <Icon name={category.icon} size={20} className="text-accent" />
              {category.name}
              <span aria-hidden className="ml-1 h-px flex-1 bg-line" />
            </h2>
            <ul className="space-y-2.5">
              {items
                .filter((item) => item.categoryId === category.id)
                .map((item) => (
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

      <CartBar count={cart.count} total={cart.total} />
      <CategoryNav categories={categories} activeId={activeId} onSelect={goTo} />
    </PageShell>
  );
}
