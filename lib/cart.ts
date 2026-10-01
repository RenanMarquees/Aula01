"use client";

import { useSyncExternalStore } from "react";
import { findItem, unitPrice } from "./menu-helpers";
import { useMenu } from "./menu-store";
import { deliveryFee, emptyOrder, type OrderInfo } from "./order";
import type { Choices } from "./types";

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
  /** Mesa/retirada/entrega, nome, endereço e pagamento. */
  order: OrderInfo;
};

// v2: a partir da Etapa 2 as linhas guardam opções e observação.
// (A Etapa 3 acrescentou o campo "order", lido com valores padrão quando falta.)
const STORAGE_KEY = "cardapio:carrinho:v2";
const EMPTY: CartState = { lines: [], generalNote: "", order: emptyOrder };

let cache: CartState | null = null;
const listeners = new Set<() => void>();

function makeKey(itemId: string, choices: Choices, note: string): string {
  const sorted = Object.keys(choices)
    .sort()
    .map((groupId) => [groupId, [...choices[groupId]].sort()]);
  return JSON.stringify([itemId, sorted, note.trim()]);
}

// O carrinho só guarda "o que foi escolhido". Preços e disponibilidade vêm sempre do cardápio atual.
function sanitizeLine(raw: unknown): CartLine | null {
  const line = raw as Partial<CartLine> | null;
  if (!line || typeof line.itemId !== "string") return null;
  if (!Number.isInteger(line.qty) || (line.qty as number) < 1) return null;

  const choices: Choices = {};
  if (line.choices && typeof line.choices === "object") {
    for (const [groupId, picked] of Object.entries(line.choices)) {
      if (Array.isArray(picked)) {
        choices[groupId] = picked.filter((id): id is string => typeof id === "string");
      }
    }
  }
  const note = typeof line.note === "string" ? line.note : "";
  return {
    key: makeKey(line.itemId, choices, note),
    itemId: line.itemId,
    qty: line.qty as number,
    choices,
    note,
  };
}

function sanitizeOrder(raw: unknown): OrderInfo {
  const saved = (raw ?? {}) as Partial<OrderInfo>;
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  return {
    type:
      saved.type === "mesa" || saved.type === "retirada" || saved.type === "entrega"
        ? saved.type
        : null,
    name: text(saved.name),
    table: text(saved.table),
    zoneId: text(saved.zoneId),
    street: text(saved.street),
    number: text(saved.number),
    complement: text(saved.complement),
    payment:
      saved.payment === "pix" || saved.payment === "cartao" || saved.payment === "dinheiro"
        ? saved.payment
        : null,
    changeFor: text(saved.changeFor),
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
      order: sanitizeOrder(parsed?.order),
    };
  } catch {
    cache = { lines: [], generalNote: "", order: emptyOrder };
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

/** Atualiza só os campos informados (ex.: { name: "Maria" }). */
export function updateOrder(patch: Partial<OrderInfo>) {
  const state = read();
  write({ ...state, order: { ...state.order, ...patch } });
}

/** Depois de enviar: esvazia os itens e a observação, mas lembra nome, mesa e endereço. */
function clearItems() {
  const state = read();
  write({ ...state, lines: [], generalNote: "", order: { ...state.order, payment: null, changeFor: "" } });
}

// "Pronto" fica falso no servidor e verdadeiro no celular: evita mostrar
// "carrinho vazio" por um instante antes de ler o que está guardado.
const noopSubscribe = () => () => {};

export function useCart() {
  const state = useSyncExternalStore(subscribe, read, () => EMPTY);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const menuState = useMenu();
  const menu = menuState.data;

  // Só entram no carrinho os pratos que ainda existem no cardápio.
  // Os pausados ficam na lista (para o cliente remover), mas não contam no total.
  const lines = menu ? state.lines.filter((line) => findItem(menu, line.itemId)) : [];
  const orderable = menu
    ? lines.filter((line) => findItem(menu, line.itemId)?.available)
    : [];

  const count = orderable.reduce((sum, line) => sum + line.qty, 0);
  const total = orderable.reduce((sum, line) => {
    const item = menu ? findItem(menu, line.itemId) : undefined;
    return sum + (item ? unitPrice(item, line.choices) * line.qty : 0);
  }, 0);
  const fee = menu ? deliveryFee(state.order, menu) : 0;

  return {
    /** Falso até o celular ler o carrinho guardado e o cardápio chegar. */
    ready: hydrated && menu !== null,
    lines,
    /** Linhas cujo prato está pausado no momento. */
    unavailableCount: lines.length - orderable.length,
    generalNote: state.generalNote,
    order: state.order,
    /** Unidades de pratos disponíveis. */
    count,
    /** Soma dos itens disponíveis (sem taxa de entrega). */
    total,
    /** Taxa de entrega do bairro escolhido (0 se não for entrega). */
    fee,
    totalWithFee: total + fee,
    /** Unidades do item "puro" (sem opções e sem observação), usadas pelo botão da lista. */
    plainQtyOf: (itemId: string) =>
      state.lines.find((line) => line.key === makeKey(itemId, {}, ""))?.qty ?? 0,
    changePlainQty: (itemId: string, delta: number) =>
      delta > 0 ? addLine(itemId, delta) : changeQty(makeKey(itemId, {}, ""), delta),
    addLine,
    changeQty,
    setGeneralNote,
    updateOrder,
    clearItems,
  };
}
