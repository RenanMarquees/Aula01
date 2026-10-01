"use client";

import { PanelPage } from "@/components/painel/PanelPage";
import { SettingsForm } from "@/components/painel/SettingsForm";

export default function SettingsPage() {
  return <PanelPage title="Ajustes">{(menu, session) => <SettingsForm menu={menu} session={session} />}</PanelPage>;
}
