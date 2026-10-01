import { restaurant } from "@/lib/menu-data";

export function Cover() {
  return (
    <header>
      {/* Foto de capa provisória: troque pela foto real no painel (Etapa 4). */}
      <div
        aria-hidden
        className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400"
      >
        <span className="absolute -left-2 top-4 rotate-[-12deg] text-6xl opacity-25">🍕</span>
        <span className="absolute left-1/3 top-16 rotate-[8deg] text-7xl opacity-20">🍔</span>
        <span className="absolute right-4 top-3 rotate-[14deg] text-6xl opacity-25">🥗</span>
        <span className="absolute -bottom-3 right-1/3 text-7xl opacity-20">🍰</span>
      </div>

      <div className="relative px-4 pb-4">
        <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--background)] bg-white text-4xl shadow-md">
          <span aria-hidden>{restaurant.logoEmoji}</span>
          <span className="sr-only">Logo do {restaurant.name}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{restaurant.name}</h1>
        <p className="mt-0.5 text-sm text-stone-600">{restaurant.tagline}</p>
      </div>
    </header>
  );
}
