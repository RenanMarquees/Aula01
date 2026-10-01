"use client";

import { Check } from "lucide-react";
import { useToastMessage } from "@/lib/toast";

export function Toaster() {
  const message = useToastMessage();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[calc(4.5rem+env(safe-area-inset-top))]"
    >
      {message && (
        <p className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] text-white shadow-lg">
          <Check size={15} strokeWidth={2} aria-hidden className="shrink-0 text-[#e9b8a3]" />
          {message}
        </p>
      )}
    </div>
  );
}
