"use client";

import { Plus, X } from "lucide-react";
import { centsToInput, newId, parseMoney } from "@/lib/menu-helpers";
import type { OptionGroup } from "@/lib/types";
import { ConfirmButton, Switch, inputClass, secondaryButton } from "./ui";

/** Versão "em edição" de um grupo: os preços ficam como texto enquanto o dono digita. */
export type EditableGroup = {
  id: string;
  title: string;
  required: boolean;
  type: "single" | "multiple";
  choices: { id: string; name: string; priceText: string }[];
};

export function toEditable(groups: OptionGroup[]): EditableGroup[] {
  return groups.map((group) => ({
    id: group.id,
    title: group.title,
    required: group.required,
    type: group.type,
    choices: group.choices.map((choice) => ({
      id: choice.id,
      name: choice.name,
      priceText: choice.price > 0 ? centsToInput(choice.price) : "",
    })),
  }));
}

/** Valor extra de uma opção: vazio ou 0 = sem custo; devolve null se o texto não for um valor válido. */
export function parseExtra(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === "" || /^0+([.,]0+)?$/.test(trimmed)) return 0;
  return parseMoney(trimmed);
}

export type GroupsResult =
  | { ok: true; groups: OptionGroup[] }
  | { ok: false; errors: Record<string, string> };

/** Confere os grupos e converte para o formato salvo. Os erros vêm por id do grupo ou da opção. */
export function fromEditable(groups: EditableGroup[]): GroupsResult {
  const errors: Record<string, string> = {};
  const result: OptionGroup[] = [];

  for (const group of groups) {
    if (!group.title.trim()) errors[group.id] = "Dê um nome ao grupo, por exemplo: Ponto da carne";
    if (group.choices.length === 0) errors[group.id] ??= "Adicione pelo menos uma opção";

    const choices = group.choices.map((choice) => {
      if (!choice.name.trim()) errors[choice.id] = "Escreva o nome da opção";
      const price = parseExtra(choice.priceText);
      if (price === null) errors[`${choice.id}-preco`] = "Valor inválido";
      return { id: choice.id, name: choice.name.trim(), price: price ?? 0 };
    });

    result.push({
      id: group.id,
      title: group.title.trim(),
      required: group.required,
      type: group.type,
      choices,
    });
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, groups: result };
}

export function OptionGroupsEditor({
  groups,
  errors,
  onChange,
  onClearError,
}: {
  groups: EditableGroup[];
  errors: Record<string, string>;
  onChange: (groups: EditableGroup[]) => void;
  /** Chamado ao corrigir um campo, para apagar o aviso daquele campo. */
  onClearError?: (key: string) => void;
}) {
  function updateGroup(id: string, patch: Partial<EditableGroup>) {
    onChange(groups.map((group) => (group.id === id ? { ...group, ...patch } : group)));
  }

  function updateChoice(groupId: string, choiceId: string, patch: Partial<EditableGroup["choices"][number]>) {
    onChange(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              choices: group.choices.map((choice) => (choice.id === choiceId ? { ...choice, ...patch } : choice)),
            }
          : group,
      ),
    );
  }

  return (
    <div className="space-y-4">
      {groups.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line px-4 py-5 text-center text-[13px] leading-relaxed text-muted">
          Sem opções: o prato entra no carrinho com um toque. Adicione opções se o cliente precisar escolher
          algo, como o ponto da carne, o tamanho ou adicionais.
        </p>
      )}

      {groups.map((group, groupIndex) => (
        <fieldset key={group.id} className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <legend className="px-1 text-[12px] font-semibold uppercase tracking-wider text-muted">
            Grupo {groupIndex + 1}
          </legend>

          <div>
            <label htmlFor={`grupo-nome-${group.id}`} className="mb-1.5 block text-[13.5px] font-medium">
              Nome do grupo
            </label>
            <input
              id={`grupo-nome-${group.id}`}
              value={group.title}
              onChange={(event) => {
                updateGroup(group.id, { title: event.target.value });
                onClearError?.(group.id);
              }}
              maxLength={40}
              placeholder="Ex.: Ponto da carne"
              aria-invalid={Boolean(errors[group.id])}
              className={`${inputClass} ${errors[group.id] ? "border-danger" : ""}`}
            />
            {errors[group.id] && (
              <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-danger">
                {errors[group.id]}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13.5px] font-medium">Obrigatório</p>
              <p className="text-[12px] text-muted">O cliente precisa escolher para continuar</p>
            </div>
            <Switch
              checked={group.required}
              label={`Grupo obrigatório: ${group.title || `Grupo ${groupIndex + 1}`}`}
              onChange={(value) => updateGroup(group.id, { required: value })}
            />
          </div>

          <div>
            <label htmlFor={`grupo-tipo-${group.id}`} className="mb-1.5 block text-[13.5px] font-medium">
              Quantas opções o cliente pode escolher?
            </label>
            <select
              id={`grupo-tipo-${group.id}`}
              value={group.type}
              onChange={(event) => updateGroup(group.id, { type: event.target.value as "single" | "multiple" })}
              className={inputClass}
            >
              <option value="single">Só uma (ex.: tamanho)</option>
              <option value="multiple">Quantas quiser (ex.: adicionais)</option>
            </select>
          </div>

          <div>
            <p className="mb-1.5 text-[13.5px] font-medium">Opções</p>
            <ul className="space-y-2.5">
              {group.choices.map((choice, choiceIndex) => (
                <li key={choice.id}>
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <input
                        value={choice.name}
                        onChange={(event) => {
                          updateChoice(group.id, choice.id, { name: event.target.value });
                          onClearError?.(choice.id);
                        }}
                        aria-label={`Nome da opção ${choiceIndex + 1} de ${group.title || "grupo"}`}
                        maxLength={40}
                        placeholder="Ex.: Ao ponto"
                        aria-invalid={Boolean(errors[choice.id])}
                        className={`${inputClass} ${errors[choice.id] ? "border-danger" : ""}`}
                      />
                    </div>
                    <div className="w-[100px] shrink-0">
                      <input
                        value={choice.priceText}
                        onChange={(event) => {
                          updateChoice(group.id, choice.id, { priceText: event.target.value });
                          onClearError?.(`${choice.id}-preco`);
                        }}
                        aria-label={`Valor extra da opção ${choiceIndex + 1} de ${group.title || "grupo"}`}
                        inputMode="decimal"
                        maxLength={9}
                        placeholder="+ 0,00"
                        aria-invalid={Boolean(errors[`${choice.id}-preco`])}
                        className={`${inputClass} ${errors[`${choice.id}-preco`] ? "border-danger" : ""}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateGroup(group.id, { choices: group.choices.filter((other) => other.id !== choice.id) })
                      }
                      aria-label={`Remover a opção ${choice.name || choiceIndex + 1}`}
                      className="flex h-12 w-11 shrink-0 items-center justify-center rounded-full text-muted active:bg-tile"
                    >
                      <X size={18} strokeWidth={1.6} aria-hidden />
                    </button>
                  </div>
                  {(errors[choice.id] || errors[`${choice.id}-preco`]) && (
                    <p role="alert" className="mt-1 text-[12.5px] font-medium text-danger">
                      {errors[choice.id] ?? errors[`${choice.id}-preco`]}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                updateGroup(group.id, {
                  choices: [...group.choices, { id: newId(), name: "", priceText: "" }],
                });
                onClearError?.(group.id);
              }}
              className="mt-2.5 flex min-h-11 items-center gap-1.5 px-1 text-[13.5px] font-medium text-accent"
            >
              <Plus size={16} strokeWidth={1.8} aria-hidden />
              Adicionar opção
            </button>
            <p className="text-[12px] text-muted">Deixe o valor extra vazio quando a opção não custa a mais.</p>
          </div>

          <ConfirmButton
            label="Remover este grupo"
            question="Remover o grupo e suas opções?"
            onConfirm={() => onChange(groups.filter((other) => other.id !== group.id))}
          />
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange([
            ...groups,
            {
              id: newId(),
              title: "",
              required: false,
              type: "single",
              choices: [{ id: newId(), name: "", priceText: "" }],
            },
          ])
        }
        className={`${secondaryButton} w-full`}
      >
        <Plus size={16} strokeWidth={1.8} aria-hidden />
        Novo grupo de opções
      </button>
    </div>
  );
}
