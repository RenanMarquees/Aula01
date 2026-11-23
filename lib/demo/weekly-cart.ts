"use client";

import { useSyncExternalStore } from "react";
import type { CartLine } from "./weekly-menu";

// Carrinho da demonstração, guardado no navegador para sobreviver a um recarregar da página.
const STORAGE_KEY = "demo-cardapio-semana:cart";
const EMPTY: CartLine[] = [];

let current: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  if (current) return current;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    current = Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    current = [];
  }
  return current;
}

export function setCart(next: CartLine[]) {
  current = next.filter((l) => l.qty > 0);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Sem armazenamento (aba anônima, por exemplo): o carrinho vale só nesta visita.
  }
  listeners.forEach((listener) => listener());
}

export function getCart() {
  return read();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useWeeklyCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
