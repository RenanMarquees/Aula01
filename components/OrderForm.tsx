"use client";

import { Armchair, Banknote, Bike, ChevronDown, CreditCard, QrCode, Store } from "lucide-react";
import type { ReactNode } from "react";
import { deliveryZones, formatPrice } from "@/lib/menu-data";
import {
  type OrderErrors,
  type OrderInfo,
  type OrderType,
  type PaymentMethod,
  orderTypeLabels,
  paymentLabels,
} from "@/lib/order";

type Props = {
  order: OrderInfo;
  /** Erros que devem aparecer na tela (vazio até o cliente tentar continuar). */
  errors: OrderErrors;
  onChange: (patch: Partial<OrderInfo>) => void;
};

const typeOptions: { id: OrderType; icon: typeof Armchair; hint: string }[] = [
  { id: "mesa", icon: Armchair, hint: "Estou no salão" },
  { id: "retirada", icon: Store, hint: "Busco no balcão" },
  { id: "entrega", icon: Bike, hint: "Receber em casa" },
];

const paymentOptions: { id: PaymentMethod; icon: typeof QrCode }[] = [
  { id: "pix", icon: QrCode },
  { id: "cartao", icon: CreditCard },
  { id: "dinheiro", icon: Banknote },
];

// 16px nos campos evita o "zoom" automático do iPhone ao tocar para digitar.
const inputClass =
  "w-full rounded-xl border bg-surface px-3.5 text-[16px] placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 min-h-12";

export function OrderForm({ order, errors, onChange }: Props) {
  return (
    <div className="space-y-6">
      <Section id="campo-type" title="Como você quer receber?" error={errors.type}>
        <div role="radiogroup" aria-label="Como você quer receber o pedido" className="grid grid-cols-3 gap-2">
          {typeOptions.map(({ id, icon: IconComponent, hint }) => {
            const selected = order.type === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange({ type: id })}
                className={`flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-2xl border px-1 text-center transition-colors ${
                  selected
                    ? "border-accent bg-accent-soft text-accent-dark"
                    : "border-line bg-surface text-ink active:bg-tile"
                }`}
              >
                <IconComponent size={22} strokeWidth={1.4} aria-hidden />
                <span className="text-[13.5px] font-semibold">{orderTypeLabels[id]}</span>
                <span className="text-[11px] leading-tight text-muted">{hint}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {order.type === "mesa" && (
        <Field id="campo-table" label="Número da mesa" error={errors.table}>
          <input
            id="campo-table"
            value={order.table}
            onChange={(event) => onChange({ table: event.target.value.replace(/\D/g, "").slice(0, 3) })}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ex.: 12"
            aria-invalid={Boolean(errors.table)}
            className={`${inputClass} ${errors.table ? "border-danger" : "border-line"}`}
          />
        </Field>
      )}

      {order.type && (
        <Field id="campo-name" label="Seu nome" error={errors.name}>
          <input
            id="campo-name"
            value={order.name}
            onChange={(event) => onChange({ name: event.target.value })}
            autoComplete="given-name"
            maxLength={60}
            placeholder="Como podemos te chamar?"
            aria-invalid={Boolean(errors.name)}
            className={`${inputClass} ${errors.name ? "border-danger" : "border-line"}`}
          />
        </Field>
      )}

      {order.type === "entrega" && (
        <fieldset className="space-y-4 rounded-2xl border border-line bg-surface p-4">
          <legend className="px-1 text-[14px] font-semibold">Endereço de entrega</legend>

          <div className="grid grid-cols-[1fr_96px] gap-3">
            <Field id="campo-street" label="Rua" error={errors.street}>
              <input
                id="campo-street"
                value={order.street}
                onChange={(event) => onChange({ street: event.target.value })}
                autoComplete="address-line1"
                maxLength={80}
                aria-invalid={Boolean(errors.street)}
                className={`${inputClass} ${errors.street ? "border-danger" : "border-line"}`}
              />
            </Field>
            <Field id="campo-number" label="Número" error={errors.number}>
              <input
                id="campo-number"
                value={order.number}
                onChange={(event) => onChange({ number: event.target.value })}
                inputMode="numeric"
                maxLength={10}
                aria-invalid={Boolean(errors.number)}
                className={`${inputClass} ${errors.number ? "border-danger" : "border-line"}`}
              />
            </Field>
          </div>

          <Field id="campo-zone" label="Bairro" error={errors.zone}>
            <div className="relative">
              <select
                id="campo-zone"
                value={order.zoneId}
                onChange={(event) => onChange({ zoneId: event.target.value })}
                aria-invalid={Boolean(errors.zone)}
                className={`${inputClass} appearance-none pr-9 ${errors.zone ? "border-danger" : "border-line"} ${
                  order.zoneId ? "" : "text-muted"
                }`}
              >
                <option value="">Selecione o bairro</option>
                {deliveryZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} · taxa {formatPrice(zone.fee)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                strokeWidth={1.5}
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </Field>

          <Field id="campo-complement" label="Complemento ou ponto de referência (opcional)">
            <input
              id="campo-complement"
              value={order.complement}
              onChange={(event) => onChange({ complement: event.target.value })}
              maxLength={80}
              placeholder="Ex.: apto 32, portão azul"
              className={`${inputClass} border-line`}
            />
          </Field>
        </fieldset>
      )}

      {order.type && (
        <Section id="campo-payment" title="Como você vai pagar?" error={errors.payment}>
          <p className="-mt-1 mb-2.5 text-[12px] text-muted">
            O pagamento é feito no restaurante ou na entrega.
          </p>
          <div role="radiogroup" aria-label="Forma de pagamento" className="grid grid-cols-3 gap-2">
            {paymentOptions.map(({ id, icon: IconComponent }) => {
              const selected = order.payment === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange({ payment: id })}
                  className={`flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-2xl border text-center transition-colors ${
                    selected
                      ? "border-accent bg-accent-soft text-accent-dark"
                      : "border-line bg-surface text-ink active:bg-tile"
                  }`}
                >
                  <IconComponent size={21} strokeWidth={1.4} aria-hidden />
                  <span className="text-[13.5px] font-semibold">{paymentLabels[id]}</span>
                </button>
              );
            })}
          </div>

          {order.payment === "dinheiro" && (
            <div className="mt-3">
              <Field id="campo-changeFor" label="Troco para quanto? (opcional)" error={errors.changeFor}>
                <input
                  id="campo-changeFor"
                  value={order.changeFor}
                  onChange={(event) => onChange({ changeFor: event.target.value })}
                  inputMode="decimal"
                  maxLength={10}
                  placeholder="Ex.: 100 (deixe vazio se não precisa)"
                  aria-invalid={Boolean(errors.changeFor)}
                  className={`${inputClass} ${errors.changeFor ? "border-danger" : "border-line"}`}
                />
              </Field>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

function Section({
  id,
  title,
  error,
  children,
}: {
  id: string;
  title: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-2.5 text-[14px] font-semibold">{title}</h2>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-[12.5px] font-medium text-danger">
          {error}
        </p>
      )}
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="scroll-mt-20">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
