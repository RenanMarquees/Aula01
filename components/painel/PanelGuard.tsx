"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getRepo, type Session } from "@/lib/repo";

type GuardState = { status: "checking" } | { status: "in"; session: Session } | { status: "out" };

/** O "porteiro": só mostra o painel a quem já entrou; os outros vão para a tela de login. */
export function PanelGuard({ children }: { children: (session: Session) => ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<GuardState>({ status: "checking" });

  useEffect(() => {
    let cancelled = false;
    getRepo()
      .getSession()
      .catch(() => null)
      .then((session) => {
        if (cancelled) return;
        if (session) {
          setState({ status: "in", session });
        } else {
          setState({ status: "out" });
          router.replace("/painel/entrar");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (state.status !== "in") {
    return (
      <div role="status" aria-label="Verificando acesso" className="flex min-h-dvh items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
      </div>
    );
  }

  return <>{children(state.session)}</>;
}
