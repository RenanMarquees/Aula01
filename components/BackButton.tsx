"use client";

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
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-md ring-1 ring-stone-200 active:bg-stone-100 ${className}`}
    >
      <span aria-hidden>←</span>
    </button>
  );
}
