"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  label?: string;
};

/** Volta para onde o cliente estava (mantém o ponto da rolagem do cardápio). */
export function BackButton({ className = "", label = "Voltar" }: Props) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/95 text-ink backdrop-blur active:bg-tile ${className}`}
    >
      <ArrowLeft size={19} strokeWidth={1.6} aria-hidden />
    </button>
  );
}
