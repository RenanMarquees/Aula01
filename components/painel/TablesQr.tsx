"use client";

import { Printer, TriangleAlert } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Card, Field, inputClass, primaryButton } from "./ui";

const ADDRESS_KEY = "cardapio:painel-endereco:v1";
const COUNT_KEY = "cardapio:painel-mesas:v1";
const noopSubscribe = () => () => {};

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storeValue(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Sem armazenamento: o valor vale só nesta visita.
  }
}

/** "meucardapio.com.br/" → "https://meucardapio.com.br". */
export function cleanAddress(text: string): string {
  const trimmed = text.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function TablesQr() {
  // Só desenha no celular/computador (usa o endereço real da página e o espaço guardado).
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  return mounted ? <TablesQrBody /> : null;
}

function TablesQrBody() {
  const [address, setAddress] = useState(() => readStored(ADDRESS_KEY) ?? window.location.origin);
  const [count, setCount] = useState(() => {
    const saved = Number.parseInt(readStored(COUNT_KEY) ?? "", 10);
    return Number.isInteger(saved) && saved >= 1 && saved <= 99 ? saved : 10;
  });
  const [svgs, setSvgs] = useState<string[]>([]);

  const base = cleanAddress(address);
  const isLocal = /^https?:\/\/(localhost|127\.|0\.0\.0\.0|\[::1\])/i.test(base);

  useEffect(() => {
    if (!base) return;
    let cancelled = false;
    Promise.all(
      Array.from({ length: count }, (_, index) =>
        QRCode.toString(`${base}/?mesa=${index + 1}`, { type: "svg", margin: 0, errorCorrectionLevel: "M" }),
      ),
    )
      .then((result) => {
        if (!cancelled) setSvgs(result);
      })
      .catch(() => {
        if (!cancelled) setSvgs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [base, count]);

  return (
    <div className="space-y-6">
      <Card className="space-y-4 print:hidden">
        <p className="text-[13px] leading-snug text-muted">
          Cada mesa recebe um QR Code. O cliente aponta a câmera do celular, o cardápio abre já na mesa certa e ele
          não precisa digitar nada.
        </p>

        <Field
          label="Endereço do cardápio"
          htmlFor="qr-endereco"
          hint="É o endereço que abre ao ler o QR Code. Use o endereço definitivo do seu cardápio."
        >
          <input
            id="qr-endereco"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              storeValue(ADDRESS_KEY, event.target.value);
            }}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            className={inputClass}
          />
        </Field>

        {isLocal && (
          <p role="note" className="flex items-start gap-2.5 rounded-xl bg-accent-soft p-3 text-[12.5px] leading-snug text-accent-dark">
            <TriangleAlert size={16} strokeWidth={1.5} aria-hidden className="mt-px shrink-0" />
            <span>
              Este endereço só funciona aqui no seu aparelho. Antes de imprimir, troque pelo endereço definitivo do
              cardápio na internet.
            </span>
          </p>
        )}

        <Field label="Quantas mesas?" htmlFor="qr-mesas">
          <input
            id="qr-mesas"
            value={count}
            onChange={(event) => {
              const value = Number.parseInt(event.target.value.replace(/\D/g, ""), 10);
              if (Number.isNaN(value)) return;
              const clamped = Math.min(99, Math.max(1, value));
              setCount(clamped);
              storeValue(COUNT_KEY, String(clamped));
            }}
            inputMode="numeric"
            className={`${inputClass} max-w-32`}
          />
        </Field>

        <button type="button" onClick={() => window.print()} className={`${primaryButton} w-full`}>
          <Printer size={18} strokeWidth={1.6} aria-hidden />
          Imprimir QR Codes
        </button>
        <p className="text-[12px] leading-snug text-muted">
          Na tela de impressão você também pode escolher “Salvar como PDF”.
        </p>
      </Card>

      <ul className="grid grid-cols-2 gap-3 print:grid-cols-3 print:gap-4">
        {svgs.map((svg, index) => (
          <li
            key={index}
            className="flex break-inside-avoid flex-col items-center rounded-2xl border border-line bg-surface p-4 text-center print:rounded-lg print:border-black/30"
          >
            <p className="mb-2.5 font-display text-[20px] leading-none">Mesa {index + 1}</p>
            <div
              role="img"
              aria-label={`QR Code da mesa ${index + 1}`}
              className="aspect-square w-full max-w-[180px] [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <p className="mt-2.5 text-[11.5px] leading-tight text-muted print:text-black">
              Aponte a câmera para fazer seu pedido
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
