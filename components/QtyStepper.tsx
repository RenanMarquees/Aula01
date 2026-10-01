import { Minus, Plus, Trash2 } from "lucide-react";

type Props = {
  qty: number;
  /** Nome usado nos rótulos de acessibilidade, ex.: "Suco de laranja". */
  label: string;
  onMinus: () => void;
  onPlus: () => void;
  /** Mostra uma lixeira em vez do "−" (quando tirar uma unidade remove a linha). */
  minusAsTrash?: boolean;
  minusDisabled?: boolean;
};

export function QtyStepper({ qty, label, onMinus, onPlus, minusAsTrash, minusDisabled }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-surface">
      <button
        type="button"
        onClick={onMinus}
        disabled={minusDisabled}
        aria-label={minusAsTrash ? `Remover ${label}` : `Tirar uma unidade de ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-accent-soft disabled:opacity-30"
      >
        {minusAsTrash ? (
          <Trash2 size={17} strokeWidth={1.6} aria-hidden />
        ) : (
          <Minus size={17} strokeWidth={1.6} aria-hidden />
        )}
      </button>
      <span aria-live="polite" className="w-6 text-center text-[14px] font-medium tabular-nums">
        {qty}
      </span>
      <button
        type="button"
        onClick={onPlus}
        aria-label={`Adicionar mais uma unidade de ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-accent-soft"
      >
        <Plus size={17} strokeWidth={1.6} aria-hidden />
      </button>
    </div>
  );
}
