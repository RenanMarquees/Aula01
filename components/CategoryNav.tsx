import type { Category } from "@/lib/menu-data";
import { Icon } from "./Icon";

type Props = {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
};

/** Barra fixa na base da tela, ao alcance do polegar. */
export function CategoryNav({ categories, activeId, onSelect }: Props) {
  return (
    <nav
      aria-label="Categorias do cardápio"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-md">
        {categories.map((category) => {
          const active = category.id === activeId;
          return (
            <li key={category.id} className="flex-1">
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
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
