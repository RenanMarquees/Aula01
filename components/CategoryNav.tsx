import type { Category } from "@/lib/menu-data";

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
      className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
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
                className={`flex min-h-16 w-full flex-col items-center justify-center gap-0.5 px-1 text-xs font-medium transition-colors ${
                  active ? "text-orange-700" : "text-stone-500"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-8 w-12 items-center justify-center rounded-full text-xl transition-colors ${
                    active ? "bg-orange-100" : ""
                  }`}
                >
                  {category.emoji}
                </span>
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
