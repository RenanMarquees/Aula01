"use client";

import { useSyncExternalStore } from "react";
import { getRepo } from "./repo";
import type { MenuData } from "./types";

// Guarda o cardápio carregado e uma cópia no celular, para abrir rápido mesmo com internet fraca.
// Todas as telas (cliente e painel) leem daqui.

type MenuState =
  | { status: "loading"; data: null; error: null }
  | { status: "ready"; data: MenuData; error: null }
  | { status: "error"; data: null; error: string };

const CACHE_KEY = "cardapio:cardapio-copia:v1";
const LOADING: MenuState = { status: "loading", data: null, error: null };

let state: MenuState = LOADING;
let initialized = false;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function looksValid(value: unknown): value is MenuData {
  const data = value as Partial<MenuData> | null;
  return Boolean(
    data &&
      data.settings &&
      Array.isArray(data.categories) &&
      Array.isArray(data.items) &&
      Array.isArray(data.zones),
  );
}

function init() {
  if (initialized) return;
  initialized = true;
  try {
    const saved = window.localStorage.getItem(CACHE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (looksValid(parsed)) state = { status: "ready", data: parsed, error: null };
  } catch {
    // Sem cópia guardada: espera o carregamento normal.
  }
}

function getSnapshot(): MenuState {
  init();
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Busca o cardápio mais recente no fichário. Chamadas simultâneas viram uma só. */
export function refreshMenu(): Promise<void> {
  init();
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const data = await getRepo().load();
      state = { status: "ready", data, error: null };
      try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {
        // Sem espaço para a cópia: segue sem ela.
      }
    } catch (error) {
      // Se já há um cardápio na tela, mantém e tenta de novo mais tarde.
      if (state.status !== "ready") {
        state = {
          status: "error",
          data: null,
          error: error instanceof Error ? error.message : "Não foi possível carregar o cardápio.",
        };
      }
    } finally {
      inFlight = null;
      emit();
    }
  })();
  return inFlight;
}

export function useMenu(): MenuState {
  return useSyncExternalStore(subscribe, getSnapshot, () => LOADING);
}
