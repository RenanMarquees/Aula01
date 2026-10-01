"use client";

import type { ReactNode } from "react";
import { MenuGate } from "../MenuGate";
import type { MenuData } from "@/lib/types";
import type { Session } from "@/lib/repo";
import { PanelGuard } from "./PanelGuard";
import { PanelShell } from "./PanelShell";

/**
 * Junta o porteiro (login), a moldura e o carregamento do cardápio.
 * Cada página do painel só informa o título e o conteúdo.
 */
export function PanelPage({
  title,
  children,
}: {
  title: string;
  children: (menu: MenuData, session: Session) => ReactNode;
}) {
  return (
    <PanelGuard>
      {(session) => (
        <MenuGate>
          {(menu) => (
            <PanelShell session={session} title={title}>
              {children(menu, session)}
            </PanelShell>
          )}
        </MenuGate>
      )}
    </PanelGuard>
  );
}
