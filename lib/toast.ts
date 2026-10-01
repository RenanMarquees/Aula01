"use client";

import { useSyncExternalStore } from "react";

// Aviso rápido que continua na tela mesmo quando o cliente troca de página.
let message: string | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function showToast(text: string) {
  message = text;
  clearTimeout(timer);
  timer = setTimeout(() => {
    message = null;
    emit();
  }, 2600);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useToastMessage() {
  return useSyncExternalStore(
    subscribe,
    () => message,
    () => null,
  );
}
