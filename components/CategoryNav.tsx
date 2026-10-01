"use client";

import { useEffect, useRef } from "react";
import type { Category } from "@/lib/types";
import { Icon } from "./Icon";

type Props = {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
};

/** Barra fixa na base da tela, ao alcance do polegar. Com muitas categorias, desliza para o lado. */
export function CategoryNav({ categories, activeId, onSelect }: Props) {
  const listRef = useRef<HTMLUListElement>(null);

  // Mantém a categoria ativa visível quando a barra desliza.
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !active) return;
    list.scrollTo({
      left: active.offsetLeft - (list.clientWidth - active.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  return (
    <nav
      aria-label="Categorias do cardápio"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul ref={listRef} className="mx-auto flex max-w-md overflow-x-auto [scrollbar-width:none]">
        {categories.map((category) => {
          const active = category.id === activeId;
          return (
            <li key={category.id} className="min-w-[84px] flex-1">
              <button
                type="button"
                onClick={() => onSelect(category.id)}
                aria-current={active ? "true" : undefined}
                className={`relative flex min-h-16 w-full flex-col items-center justify-center gap-1 px-1 text-[11.5px] font-medium tracking-wide transition-colors ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute top-0 h-0.5 w-8 rounded-full transition-colors ${
                    active ? "bg-accent" : "bg-transparent"
                  }`}
                />
                <Icon name={category.icon} size={22} strokeWidth={active ? 1.7 : 1.4} />
                <span className="max-w-full truncate">{category.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
