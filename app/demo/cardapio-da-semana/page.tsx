import type { Metadata } from "next";
import { WeeklyMenu } from "@/components/demo/WeeklyMenu";

export const metadata: Metadata = {
  title: "Cardápio da Semana · demonstração do carrinho",
  description: "Demonstração: monte o pedido com marmitas de tamanhos diferentes no carrinho e envie pelo WhatsApp.",
  robots: { index: false, follow: false },
};

export default function WeeklyMenuDemoPage() {
  return <WeeklyMenu />;
}
