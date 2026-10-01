"use client";

import { PanelPage } from "@/components/painel/PanelPage";
import { TablesQr } from "@/components/painel/TablesQr";

export default function TablesPage() {
  return <PanelPage title="QR Codes das mesas">{() => <TablesQr />}</PanelPage>;
}
