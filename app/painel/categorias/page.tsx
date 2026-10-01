"use client";

import { CategoriesAdmin } from "@/components/painel/CategoriesAdmin";
import { PanelPage } from "@/components/painel/PanelPage";

export default function CategoriesPage() {
  return <PanelPage title="Categorias">{(menu) => <CategoriesAdmin menu={menu} />}</PanelPage>;
}
