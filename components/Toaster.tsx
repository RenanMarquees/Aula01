"use client";

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
        <p className="rounded-full bg-stone-900 px-4 py-2 text-sm text-white shadow-lg">{message}</p>
      )}
    </div>
  );
}
