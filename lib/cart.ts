"use client";

import { useSyncExternalStore } from "react";
import { findItem } from "./menu-data";

// Por enquanto só itens simples entram no carrinho (um por linha).
// Na Etapa 2 cada linha passa a guardar também as opções e a observação.
export type CartLine = {
  itemId: string;
  qty: number;
};

const STORAGE_KEY = "cardapio:carrinho:v1";
const EMPTY: CartLine[] = [];

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (line): line is CartLine =>
      typeof line?.itemId === "string" &&
      Number.isInteger(line?.qty) &&
      line.qty > 0 &&
      findItem(line.itemId) !== undefined,
  );
}

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    cache = saved ? sanitize(JSON.parse(saved)) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(lines: CartLine[]) {
  cache = lines;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Sem armazenamento disponível: o carrinho funciona só nesta visita.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function changeQty(itemId: string, delta: number) {
  const current = read();
  const existing = current.find((line) => line.itemId === itemId);
  const qty = (existing?.qty ?? 0) + delta;
  const others = current.filter((line) => line.itemId !== itemId);
  write(qty > 0 ? [...others, { itemId, qty }] : others);
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);

  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const total = lines.reduce(
    (sum, line) => sum + (findItem(line.itemId)?.price ?? 0) * line.qty,
    0,
  );

  return {
    lines,
    count,
    total,
    qtyOf: (itemId: string) =>
      lines.find((line) => line.itemId === itemId)?.qty ?? 0,
    add: (itemId: string) => changeQty(itemId, 1),
    remove: (itemId: string) => changeQty(itemId, -1),
  };
}
