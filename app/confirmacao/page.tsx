import type { Metadata } from "next";
import { ConfirmView } from "@/components/ConfirmView";

export const metadata: Metadata = {
  title: "Confirmar pedido · Cardápio digital",
};

export default function ConfirmPage() {
  return <ConfirmView />;
}
