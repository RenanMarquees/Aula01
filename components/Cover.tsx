import Image from "next/image";
import { ClockAlert } from "lucide-react";
import type { Settings } from "@/lib/types";
import { Icon } from "./Icon";
import { TableBadge } from "./TableBadge";

export function Cover({ settings }: { settings: Settings }) {
  return (
    <header>
      <div
        aria-hidden
        className="relative h-36 overflow-hidden bg-gradient-to-br from-[#2b1f19] via-[#3b2a20] to-[#5a3a28]"
      >
        {settings.coverUrl ? (
          <Image src={settings.coverUrl} alt="" fill sizes="(max-width: 448px) 100vw, 448px" unoptimized priority className="object-cover" />
        ) : (
          <>
            <Icon name="utensils" size={120} strokeWidth={0.8} className="absolute -right-4 -top-2 rotate-12 text-white/10" />
            <Icon name="wheat" size={90} strokeWidth={0.8} className="absolute left-6 top-10 -rotate-12 text-white/10" />
            <Icon name="cake-slice" size={72} strokeWidth={0.8} className="absolute bottom-2 left-1/2 rotate-6 text-white/10" />
          </>
        )}
      </div>

      <div className="relative px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-[3px] border-paper bg-surface text-accent shadow-sm ring-1 ring-line">
            {settings.logoUrl ? (
              <Image src={settings.logoUrl} alt="" fill sizes="64px" unoptimized className="object-cover" />
            ) : (
              <Icon name="utensils" size={26} />
            )}
            <span className="sr-only">Logo do {settings.name}</span>
          </div>
          <TableBadge />
        </div>
        <h1 className="mt-3 font-display text-[26px] font-normal leading-tight tracking-tight">
          {settings.name}
        </h1>
        {settings.tagline && <p className="mt-1 text-[13px] text-muted">{settings.tagline}</p>}
        {!settings.open && (
          <p className="mt-3 flex items-start gap-2.5 rounded-xl bg-accent-soft p-3 text-[13px] leading-snug text-accent-dark">
            <ClockAlert size={17} strokeWidth={1.5} aria-hidden className="mt-px shrink-0" />
            Estamos fechados no momento. Você pode ver o cardápio, mas o envio de pedidos volta quando
            abrirmos.
          </p>
        )}
      </div>
    </header>
  );
}
