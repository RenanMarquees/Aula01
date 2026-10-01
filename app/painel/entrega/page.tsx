"use client";

import { PanelPage } from "@/components/painel/PanelPage";
import { ZonesAdmin } from "@/components/painel/ZonesAdmin";

export default function DeliveryPage() {
  return <PanelPage title="Entrega">{(menu) => <ZonesAdmin menu={menu} />}</PanelPage>;
}
