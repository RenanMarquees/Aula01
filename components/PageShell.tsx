import type { ReactNode } from "react";

/** Moldura de "celular" usada por todas as telas (centralizada em telas grandes). */
export function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto min-h-dvh w-full max-w-md bg-[var(--background)] ${className}`}>
      {children}
    </div>
  );
}
