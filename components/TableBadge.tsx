"use client";

import { Armchair } from "lucide-react";
import { useCart } from "@/lib/cart";

/** Etiqueta "Mesa 5", mostrada quando o cliente chegou pelo QR Code da mesa. */
export function TableBadge() {
  const { order, ready } = useCart();
  if (!ready || order.type !== "mesa" || !order.table) return null;

  return (
    <span className="mb-1 flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium">
      <Armchair size={15} strokeWidth={1.5} aria-hidden className="text-accent" />
      Mesa {order.table}
    </span>
  );
}
