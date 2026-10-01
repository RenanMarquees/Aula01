import type { Metadata } from "next";
import type { ReactNode } from "react";

// O painel não deve aparecer em buscadores.
export const metadata: Metadata = {
  title: "Painel · Cardápio digital",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: ReactNode }) {
  return children;
}
