import { Icon } from "./Icon";
import { restaurant } from "@/lib/menu-data";

export function Cover() {
  return (
    <header>
      {/* Foto de capa provisória: troque pela foto real no painel (Etapa 4). */}
      <div
        aria-hidden
        className="relative h-36 overflow-hidden bg-gradient-to-br from-[#2b1f19] via-[#3b2a20] to-[#5a3a28]"
      >
        <Icon name="utensils" size={120} strokeWidth={0.8} className="absolute -right-4 -top-2 rotate-12 text-white/10" />
        <Icon name="wheat" size={90} strokeWidth={0.8} className="absolute left-6 top-10 -rotate-12 text-white/10" />
        <Icon name="cake-slice" size={72} strokeWidth={0.8} className="absolute bottom-2 left-1/2 rotate-6 text-white/10" />
      </div>

      <div className="relative px-5 pb-5">
        <div className="-mt-8 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-paper bg-surface text-accent shadow-sm ring-1 ring-line">
          <Icon name="utensils" size={26} />
          <span className="sr-only">Logo do {restaurant.name}</span>
        </div>
        <h1 className="mt-3 font-display text-[26px] font-normal leading-tight tracking-tight">
          {restaurant.name}
        </h1>
        <p className="mt-1 text-[13px] text-muted">{restaurant.tagline}</p>
      </div>
    </header>
  );
}
