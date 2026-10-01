"use client";

import { Check, CircleAlert } from "lucide-react";
import { useToast } from "@/lib/toast";

export function Toaster() {
  const toast = useToast();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[calc(4.5rem+env(safe-area-inset-top))]"
    >
      {toast && (
        <p
          className={`flex max-w-md items-center gap-2 rounded-full px-4 py-2.5 text-[13px] text-white shadow-lg ${
            toast.kind === "error" ? "bg-danger" : "bg-ink"
          }`}
        >
          {toast.kind === "error" ? (
            <CircleAlert size={15} strokeWidth={2} aria-hidden className="shrink-0" />
          ) : (
            <Check size={15} strokeWidth={2} aria-hidden className="shrink-0 text-[#e9b8a3]" />
          )}
          {toast.text}
        </p>
      )}
    </div>
  );
}
