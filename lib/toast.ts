"use client";

import { useSyncExternalStore } from "react";

export type ToastState = { text: string; kind: "ok" | "error" } | null;

// Aviso rápido que continua na tela mesmo quando o cliente troca de página.
let current: ToastState = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function show(text: string, kind: "ok" | "error", durationMs: number) {
  current = { text, kind };
  clearTimeout(timer);
  timer = setTimeout(() => {
    current = null;
    emit();
  }, durationMs);
  emit();
}

export function showToast(text: string) {
  show(text, "ok", 2600);
}

/** Aviso de problema: fica um pouco mais na tela para dar tempo de ler. */
export function showError(text: string) {
  show(text, "error", 5000);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useToast(): ToastState {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
