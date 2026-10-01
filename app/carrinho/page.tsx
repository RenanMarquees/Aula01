import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Seu pedido · Cardápio digital",
};

export default function CartPage() {
  return <CartView />;
}
