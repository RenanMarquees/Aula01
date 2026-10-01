"use client";

import { BookOpen, Info, Bike, QrCode, Settings, Tags, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMenu } from "@/lib/menu-store";
import type { Session } from "@/lib/repo";
import { useDemoMode } from "./ui";

const tabs = [
  { href: "/painel", label: "Cardápio", icon: BookOpen },
  { href: "/painel/categorias", label: "Categorias", icon: Tags },
  { href: "/painel/entrega", label: "Entrega", icon: Bike },
  { href: "/painel/mesas", label: "Mesas", icon: QrCode },
  { href: "/painel/ajustes", label: "Ajustes", icon: Settings },
] as const;

/** Moldura do painel: título no topo e barra de abas na base, ao alcance do polegar. */
export function PanelShell({
  session,
  title,
  children,
}: {
  session: Session;
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const menu = useMenu();
  const demo = useDemoMode();

  return (
    <div className="mx-auto min-h-dvh w-full max-w-2xl bg-paper pb-28">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur print:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11.5px] font-medium uppercase tracking-wider text-muted">
              Painel · {menu.data?.settings.name ?? "Restaurante"}
            </p>
            <h1 className="font-display text-[24px] font-normal leading-tight tracking-tight">{title}</h1>
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-[12.5px] font-medium active:bg-tile"
          >
            Ver cardápio
            <ExternalLink size={14} strokeWidth={1.6} aria-hidden />
          </Link>
        </div>
        <p className="sr-only">Você entrou como {session.email}</p>
      </header>

      {demo && (
        <p className="mx-4 mt-4 flex items-start gap-2.5 rounded-xl bg-tile p-3 text-[12.5px] leading-snug text-muted print:hidden">
          <Info size={16} strokeWidth={1.5} aria-hidden className="mt-px shrink-0 text-accent" />
          <span>
            <strong className="font-semibold text-ink">Modo demonstração.</strong> As alterações ficam só
            neste navegador, para você testar à vontade.
          </span>
        </p>
      )}

      <div className="px-4 py-5">{children}</div>

      <nav
        aria-label="Seções do painel"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur print:hidden"
      >
        <ul className="mx-auto flex max-w-2xl">
          {tabs.map(({ href, label, icon: IconComponent }) => {
            const active =
              href === "/painel"
                ? pathname === "/painel" || pathname.startsWith("/painel/prato")
                : pathname.startsWith(href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11.5px] font-medium tracking-wide ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute top-0 h-0.5 w-8 rounded-full ${active ? "bg-accent" : "bg-transparent"}`}
                  />
                  <IconComponent size={21} strokeWidth={active ? 1.7 : 1.4} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
