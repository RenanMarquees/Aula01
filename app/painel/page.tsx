"use client";

import { MenuAdmin } from "@/components/painel/MenuAdmin";
import { PanelPage } from "@/components/painel/PanelPage";

export default function PanelHome() {
  return <PanelPage title="Cardápio">{(menu) => <MenuAdmin menu={menu} />}</PanelPage>;
}
