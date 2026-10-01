"use client";

import { useEffect } from "react";
import { refreshMenu } from "@/lib/menu-store";

const REFRESH_EVERY_MS = 60_000;

/**
 * Mantém o cardápio em dia: carrega ao abrir, ao voltar para a aba e a cada minuto.
 * Assim, um prato pausado pelo dono some da tela do cliente em instantes.
 */
export function MenuBootstrap() {
  useEffect(() => {
    refreshMenu();

    const onVisible = () => {
      if (document.visibilityState === "visible") refreshMenu();
    };
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(onVisible, REFRESH_EVERY_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
