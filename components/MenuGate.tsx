"use client";

import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { refreshMenu, useMenu } from "@/lib/menu-store";
import type { MenuData } from "@/lib/types";
import { PageShell } from "./PageShell";

/** Mostra "carregando" ou o erro até o cardápio chegar; depois entrega o cardápio a quem precisa. */
export function MenuGate({ children }: { children: (menu: MenuData) => ReactNode }) {
  const menu = useMenu();

  if (menu.status === "ready") return <>{children(menu.data)}</>;

  if (menu.status === "error") {
    return (
      <PageShell>
        <div className="flex flex-col items-center px-8 py-32 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tile text-accent">
            <TriangleAlert size={28} strokeWidth={1.3} aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-[21px] font-normal">Não foi possível abrir o cardápio</h1>
          <p className="mt-1 text-[13.5px] text-muted">{menu.error}</p>
          <button
            type="button"
            onClick={() => refreshMenu()}
            className="mt-7 min-h-12 rounded-full bg-accent px-7 text-[14px] font-medium tracking-wide text-white active:bg-accent-dark"
          >
            Tentar de novo
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div role="status" aria-label="Carregando o cardápio" className="animate-pulse">
        <div className="h-36 bg-tile" />
        <div className="space-y-3 px-5 pt-8">
          <div className="-mt-16 h-16 w-16 rounded-full bg-line" />
          <div className="h-7 w-56 rounded bg-tile" />
          <div className="h-4 w-72 rounded bg-tile" />
          <div className="space-y-2.5 pt-6">
            {[0, 1, 2].map((key) => (
              <div key={key} className="h-[108px] rounded-2xl bg-tile" />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
