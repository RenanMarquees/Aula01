"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useId, useState, useSyncExternalStore, type ReactNode } from "react";
import { shrinkImage } from "@/lib/panel";
import { getRepo, RepoError, type PhotoKind } from "@/lib/repo";
import { showError } from "@/lib/toast";
import { iconNames, type IconName } from "@/lib/types";
import { Icon, iconLabels } from "../Icon";

const noopSubscribe = () => () => {};

/** Verdadeiro quando o painel usa o fichário de rascunho (modo demonstração). Seguro para a primeira exibição. */
export function useDemoMode(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => getRepo().mode === "demo",
    () => false,
  );
}

// Campos com letra de 16px: evita o "zoom" automático do iPhone ao digitar.
export const inputClass =
  "w-full min-h-12 rounded-xl border border-line bg-surface px-3.5 text-[16px] placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

export const primaryButton =
  "flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[14px] font-medium tracking-wide text-white active:bg-accent-dark disabled:opacity-50";

export const secondaryButton =
  "flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-[13.5px] font-medium text-ink active:bg-tile disabled:opacity-50";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13.5px] font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[12px] text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-4 ${className}`}>{children}</section>
  );
}

/** Chave liga/desliga. A área de toque tem 44 px de altura. */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  /** Lido por leitores de tela, ex.: "Disponível: Suco de laranja". */
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex h-11 w-14 shrink-0 items-center justify-center disabled:opacity-50"
    >
      <span
        aria-hidden
        className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-accent" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

/** Botão de excluir que pede confirmação no próprio lugar, sem janelas. */
export function ConfirmButton({
  label,
  question = "Tem certeza?",
  onConfirm,
  className = "",
}: {
  label: string;
  question?: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
}) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        className={`flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-[13.5px] font-medium text-danger active:bg-tile ${className}`}
      >
        <Trash2 size={16} strokeWidth={1.6} aria-hidden />
        {label}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Confirmar: ${label}`}
      className={`flex flex-wrap items-center gap-2 rounded-2xl bg-accent-soft p-2 pl-4 ${className}`}
    >
      <span className="mr-auto text-[13px] font-medium text-accent-dark">{question}</span>
      <button
        type="button"
        onClick={() => setAsking(false)}
        className="min-h-11 rounded-full px-4 text-[13px] font-medium text-ink active:bg-surface"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={async () => {
          await onConfirm();
          setAsking(false);
        }}
        className="min-h-11 rounded-full bg-danger px-4 text-[13px] font-medium text-white"
      >
        Sim, excluir
      </button>
    </div>
  );
}

/** Escolha de ícone (mostrado quando o prato ou a categoria não tem foto). */
export function IconPicker({
  value,
  onChange,
  label,
}: {
  value: IconName;
  onChange: (icon: IconName) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {iconNames.map((name) => {
        const selected = value === name;
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={iconLabels[name]}
            title={iconLabels[name]}
            onClick={() => onChange(name)}
            className={`flex h-12 items-center justify-center rounded-xl border transition-colors ${
              selected ? "border-accent bg-accent-soft text-accent-dark" : "border-line bg-surface text-muted active:bg-tile"
            }`}
          >
            <Icon name={name} size={22} />
          </button>
        );
      })}
    </div>
  );
}

/** Envio de foto: escolhe, reduz, envia e devolve o endereço da imagem. */
export function ImageField({
  label,
  value,
  kind,
  maxSize,
  onChange,
  shape = "square",
  fallback,
}: {
  label: string;
  value: string | null;
  kind: PhotoKind;
  /** Maior lado da foto, em pixels, depois de reduzida. */
  maxSize: number;
  onChange: (url: string | null) => void;
  shape?: "square" | "wide" | "round";
  /** O que mostrar quando não há foto. */
  fallback: ReactNode;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const small = await shrinkImage(file, maxSize);
      const url = await getRepo().uploadPhoto(small, kind);
      onChange(url);
    } catch (error) {
      showError(
        error instanceof RepoError || error instanceof Error
          ? error.message
          : "Não foi possível enviar a foto.",
      );
    } finally {
      setUploading(false);
    }
  }

  const frame =
    shape === "round"
      ? "h-20 w-20 rounded-full"
      : shape === "wide"
        ? "h-20 w-32 rounded-xl"
        : "h-24 w-24 rounded-xl";

  return (
    <div>
      <p className="mb-1.5 text-[13.5px] font-medium">{label}</p>
      <div className="flex items-center gap-4">
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-line bg-tile text-accent/70 ${frame}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- foto enviada pelo dono, já reduzida
            <img src={value} alt={`Foto atual: ${label}`} className="h-full w-full object-cover" />
          ) : (
            fallback
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <label
            htmlFor={inputId}
            className={`${secondaryButton} cursor-pointer whitespace-nowrap focus-within:ring-2 focus-within:ring-accent/30 ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <ImagePlus size={16} strokeWidth={1.6} aria-hidden />
            {uploading ? "Enviando…" : value ? "Trocar foto" : "Escolher foto"}
            <input
              id={inputId}
              type="file"
              accept="image/*"
              disabled={uploading}
              className="sr-only"
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="min-h-11 px-1 text-[13px] font-medium text-danger"
            >
              Remover foto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
