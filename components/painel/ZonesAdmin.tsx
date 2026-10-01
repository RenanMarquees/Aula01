"use client";

import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { byPosition, centsToInput, formatPrice, newId } from "@/lib/menu-helpers";
import { moveInList, runAction } from "@/lib/panel";
import { getRepo } from "@/lib/repo";
import type { DeliveryZone, MenuData } from "@/lib/types";
import { parseExtra } from "./OptionGroupsEditor";
import { Card, ConfirmButton, Field, inputClass, primaryButton, secondaryButton } from "./ui";

type ZoneErrors = { name?: string; fee?: string };

/** Valida o formulário de um bairro. A taxa pode ser zero (entrega grátis). */
function checkZone(name: string, feeText: string): { errors: ZoneErrors; fee: number | null } {
  const errors: ZoneErrors = {};
  if (!name.trim()) errors.name = "Escreva o nome do bairro";
  const fee = parseExtra(feeText);
  if (feeText.trim() === "" || fee === null) errors.fee = "Informe a taxa, por exemplo 7,00 (ou 0 se for grátis)";
  return { errors, fee };
}

export function ZonesAdmin({ menu }: { menu: MenuData }) {
  const zones = byPosition(menu.zones);
  const [name, setName] = useState("");
  const [feeText, setFeeText] = useState("");
  const [errors, setErrors] = useState<ZoneErrors>({});

  async function handleAdd() {
    const check = checkZone(name, feeText);
    setErrors(check.errors);
    if (check.errors.name || check.errors.fee || check.fee === null) return;
    const position = zones.reduce((max, zone) => Math.max(max, zone.position), -1) + 1;
    const ok = await runAction(
      () => getRepo().saveZone({ id: newId(), name: name.trim(), fee: check.fee as number, position }),
      "Bairro adicionado",
    );
    if (ok) {
      setName("");
      setFeeText("");
    }
  }

  return (
    <div className="space-y-6">
      <p className="px-1 text-[13px] leading-snug text-muted">
        Cadastre os bairros que você atende e a taxa de cada um. O cliente escolhe o bairro e já vê o total com a
        entrega.
      </p>

      {zones.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-muted">
          Nenhum bairro cadastrado. Sem bairros, os clientes não conseguem pedir entrega.
        </p>
      ) : (
        <ul className="space-y-2">
          {zones.map((zone, index) => (
            <ZoneRow
              key={zone.id}
              zone={zone}
              isFirst={index === 0}
              isLast={index === zones.length - 1}
              onMove={(direction) =>
                runAction(async () => {
                  for (const changed of moveInList(zones, zone.id, direction)) {
                    await getRepo().saveZone(changed);
                  }
                })
              }
            />
          ))}
        </ul>
      )}

      <Card className="space-y-4">
        <h2 className="font-display text-[19px] font-normal tracking-tight">Novo bairro</h2>
        <Field label="Nome do bairro" htmlFor="bairro-novo" error={errors.name}>
          <input
            id="bairro-novo"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            maxLength={40}
            placeholder="Ex.: Jardim Europa"
            aria-invalid={Boolean(errors.name)}
            className={`${inputClass} ${errors.name ? "border-danger" : ""}`}
          />
        </Field>
        <Field label="Taxa de entrega (R$)" htmlFor="bairro-taxa" error={errors.fee}>
          <input
            id="bairro-taxa"
            value={feeText}
            onChange={(event) => {
              setFeeText(event.target.value);
              setErrors((current) => ({ ...current, fee: undefined }));
            }}
            inputMode="decimal"
            maxLength={9}
            placeholder="7,00"
            aria-invalid={Boolean(errors.fee)}
            className={`${inputClass} ${errors.fee ? "border-danger" : ""}`}
          />
        </Field>
        <button type="button" onClick={handleAdd} className={`${primaryButton} w-full`}>
          <Plus size={18} strokeWidth={1.8} aria-hidden />
          Adicionar bairro
        </button>
      </Card>
    </div>
  );
}

function ZoneRow({
  zone,
  isFirst,
  isLast,
  onMove,
}: {
  zone: DeliveryZone;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(zone.name);
  const [feeText, setFeeText] = useState(centsToInput(zone.fee));
  const [errors, setErrors] = useState<ZoneErrors>({});

  async function handleSave() {
    const check = checkZone(name, feeText);
    setErrors(check.errors);
    if (check.errors.name || check.errors.fee || check.fee === null) return;
    const ok = await runAction(
      () => getRepo().saveZone({ ...zone, name: name.trim(), fee: check.fee as number }),
      "Bairro salvo",
    );
    if (ok) setEditing(false);
  }

  if (editing) {
    return (
      <li className="space-y-4 rounded-2xl border border-accent bg-surface p-4">
        <Field label="Nome do bairro" htmlFor={`bairro-${zone.id}`} error={errors.name}>
          <input
            id={`bairro-${zone.id}`}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            maxLength={40}
            aria-invalid={Boolean(errors.name)}
            className={`${inputClass} ${errors.name ? "border-danger" : ""}`}
          />
        </Field>
        <Field label="Taxa de entrega (R$)" htmlFor={`taxa-${zone.id}`} error={errors.fee}>
          <input
            id={`taxa-${zone.id}`}
            value={feeText}
            onChange={(event) => {
              setFeeText(event.target.value);
              setErrors((current) => ({ ...current, fee: undefined }));
            }}
            inputMode="decimal"
            maxLength={9}
            aria-invalid={Boolean(errors.fee)}
            className={`${inputClass} ${errors.fee ? "border-danger" : ""}`}
          />
        </Field>
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} className={`${primaryButton} flex-1`}>
            Salvar
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setName(zone.name);
              setFeeText(centsToInput(zone.fee));
              setErrors({});
            }}
            className={secondaryButton}
          >
            Cancelar
          </button>
        </div>
        <ConfirmButton
          label="Excluir bairro"
          question="Excluir este bairro?"
          onConfirm={async () => {
            await runAction(() => getRepo().deleteZone(zone.id), "Bairro excluído");
          }}
          className="w-full justify-center"
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-1 rounded-2xl border border-line bg-surface p-2.5 pl-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-semibold">{zone.name}</p>
        <p className="text-[12.5px] tabular-nums text-muted">
          {zone.fee > 0 ? `Taxa ${formatPrice(zone.fee)}` : "Entrega grátis"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={isFirst}
        aria-label={`Mover ${zone.name} para cima`}
        className="flex h-11 w-10 items-center justify-center rounded-full active:bg-tile disabled:opacity-25"
      >
        <ArrowUp size={18} strokeWidth={1.6} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={isLast}
        aria-label={`Mover ${zone.name} para baixo`}
        className="flex h-11 w-10 items-center justify-center rounded-full active:bg-tile disabled:opacity-25"
      >
        <ArrowDown size={18} strokeWidth={1.6} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Editar ${zone.name}`}
        className="flex h-11 w-11 items-center justify-center rounded-full active:bg-tile"
      >
        <Pencil size={17} strokeWidth={1.6} aria-hidden />
      </button>
    </li>
  );
}
