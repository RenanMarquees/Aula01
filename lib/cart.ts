"use client";

import { useSyncExternalStore } from "react";
import { findItem, unitPrice, type Choices } from "./menu-data";

export type CartLine = {
  /** Identifica "o mesmo pedido": mesmo item, mesmas opções e mesma observação. */
  key: string;
  itemId: string;
  qty: number;
  choices: Choices;
  note: string;
};

type CartState = {
  lines: CartLine[];
  /** Observação geral do pedido (aparece no carrinho). */
  generalNote: string;
};

// v2: a partir da Etapa 2 as linhas guardam opções e observação.
const STORAGE_KEY = "cardapio:carrinho:v2";
const EMPTY: CartState = { lines: [], generalNote: "" };

let cache: CartState | null = null;
const listeners = new Set<() => void>();

function makeKey(itemId: string, choices: Choices, note: string): string {
  const sorted = Object.keys(choices)
    .sort()
    .map((groupId) => [groupId, [...choices[groupId]].sort()]);
  return JSON.stringify([itemId, sorted, note.trim()]);
}

function sanitizeLine(raw: unknown): CartLine | null {
  const line = raw as Partial<CartLine> | null;
  if (!line || typeof line.itemId !== "string") return null;
  const item = findItem(line.itemId);
  if (!item || !Number.isInteger(line.qty) || (line.qty as number) < 1) return null;

  // Mantém só as escolhas que ainda existem no cardápio.
  const choices: Choices = {};
  for (const group of item.optionGroups ?? []) {
    const saved = line.choices?.[group.id];
    if (!Array.isArray(saved)) continue;
    const valid = group.choices
      .map((choice) => choice.id)
      .filter((id) => saved.includes(id));
    if (valid.length > 0) choices[group.id] = valid;
  }
  const note = typeof line.note === "string" ? line.note : "";
  return {
    key: makeKey(item.id, choices, note),
    itemId: item.id,
    qty: line.qty as number,
    choices,
    note,
  };
}

function read(): CartState {
  if (cache) return cache;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    const lines = Array.isArray(parsed?.lines)
      ? parsed.lines.map(sanitizeLine).filter((line: CartLine | null): line is CartLine => line !== null)
      : [];
    cache = {
      lines,
      generalNote: typeof parsed?.generalNote === "string" ? parsed.generalNote : "",
    };
  } catch {
    cache = { lines: [], generalNote: "" };
  }
  return cache;
}

function write(next: CartState) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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

function addLine(itemId: string, qty: number, choices: Choices = {}, note = "") {
  const state = read();
  const key = makeKey(itemId, choices, note);
  const existing = state.lines.find((line) => line.key === key);
  const lines = existing
    ? state.lines.map((line) => (line.key === key ? { ...line, qty: line.qty + qty } : line))
    : [...state.lines, { key, itemId, qty, choices, note: note.trim() }];
  write({ ...state, lines });
}

function changeQty(key: string, delta: number) {
  const state = read();
  const lines = state.lines
    .map((line) => (line.key === key ? { ...line, qty: line.qty + delta } : line))
    .filter((line) => line.qty > 0);
  write({ ...state, lines });
}

function setGeneralNote(generalNote: string) {
  write({ ...read(), generalNote });
}

// "Pronto" fica falso no servidor e verdadeiro no celular: evita mostrar
// "carrinho vazio" por um instante antes de ler o que está guardado.
const noopSubscribe = () => () => {};

export function useCart() {
  const state = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const count = state.lines.reduce((sum, line) => sum + line.qty, 0);
  const total = state.lines.reduce((sum, line) => {
    const item = findItem(line.itemId);
    return sum + (item ? unitPrice(item, line.choices) * line.qty : 0);
  }, 0);

  return {
    ready,
    lines: state.lines,
    generalNote: state.generalNote,
    count,
    total,
    /** Unidades do item "puro" (sem opções e sem observação), usadas pelo botão da lista. */
    plainQtyOf: (itemId: string) =>
      state.lines.find((line) => line.key === makeKey(itemId, {}, ""))?.qty ?? 0,
    changePlainQty: (itemId: string, delta: number) =>
      delta > 0 ? addLine(itemId, delta) : changeQty(makeKey(itemId, {}, ""), delta),
    addLine,
    changeQty,
    setGeneralNote,
  };
}
