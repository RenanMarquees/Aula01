"use client";

import Link from "next/link";
import { findItem } from "@/lib/menu-helpers";
import { ItemEditor } from "./ItemEditor";
import { PanelPage } from "./PanelPage";
import { Card, primaryButton } from "./ui";

/** "novo" cria um prato; qualquer outro valor abre o prato com esse identificador. */
export function ItemEditorPage({ id }: { id: string }) {
  const isNew = id === "novo";

  return (
    <PanelPage title={isNew ? "Novo prato" : "Editar prato"}>
      {(menu) => {
        const item = isNew ? null : (findItem(menu, id) ?? null);
        if (!isNew && !item) {
          return (
            <Card className="text-center">
              <h2 className="font-display text-[19px] font-normal">Prato não encontrado</h2>
              <p className="mt-1 text-[13px] text-muted">Ele pode ter sido excluído.</p>
              <Link href="/painel" className={`${primaryButton} mx-auto mt-4 w-fit`}>
                Voltar ao cardápio
              </Link>
            </Card>
          );
        }
        // O "key" reinicia o formulário se o dono abrir outro prato.
        return <ItemEditor key={id} menu={menu} item={item} />;
      }}
    </PanelPage>
  );
}
