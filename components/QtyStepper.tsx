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
    <div className="inline-flex items-center rounded-full bg-orange-50 ring-1 ring-orange-200">
      <button
        type="button"
        onClick={onMinus}
        disabled={minusDisabled}
        aria-label={minusAsTrash ? `Remover ${label}` : `Tirar uma unidade de ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-semibold text-orange-700 active:bg-orange-100 disabled:opacity-35"
      >
        <span aria-hidden>{minusAsTrash ? "🗑" : "−"}</span>
      </button>
      <span aria-live="polite" className="w-7 text-center font-semibold">
        {qty}
      </span>
      <button
        type="button"
        onClick={onPlus}
        aria-label={`Adicionar mais uma unidade de ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-semibold text-orange-700 active:bg-orange-100"
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
