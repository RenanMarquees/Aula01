"use client";

import { useEffect } from "react";
import { updateOrder } from "@/lib/cart";

/**
 * O QR Code de cada mesa abre o cardápio com "?mesa=5".
 * Aqui guardamos esse número para o cliente não precisar digitar.
 */
export function TableFromUrl() {
  useEffect(() => {
    const table = new URLSearchParams(window.location.search).get("mesa");
    if (table && /^\d{1,3}$/.test(table)) {
      updateOrder({ type: "mesa", table });
    }
  }, []);

  return null;
}
