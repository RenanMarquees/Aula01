"use client";

import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { byPosition, newId } from "@/lib/menu-helpers";
import { moveInList, runAction } from "@/lib/panel";
import { getRepo } from "@/lib/repo";
import type { Category, IconName, MenuData } from "@/lib/types";
import { Icon } from "../Icon";
import { Card, ConfirmButton, Field, IconPicker, inputClass, primaryButton, secondaryButton } from "./ui";

export function CategoriesAdmin({ menu }: { menu: MenuData }) {
  const categories = byPosition(menu.categories);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState<IconName>("utensils");
  const [nameError, setNameError] = useState<string>();

  async function handleAdd() {
    if (!newName.trim()) {
      setNameError("Escreva o nome da categoria");
      return;
    }
    setNameError(undefined);
    const position = categories.reduce((max, category) => Math.max(max, category.position), -1) + 1;
    const ok = await runAction(
      () => getRepo().saveCategory({ id: newId(), name: newName.trim(), icon: newIcon, position }),
      "Categoria criada",
    );
    if (ok) setNewName("");
  }

  return (
    <div className="space-y-6">
      <p className="px-1 text-[13px] leading-snug text-muted">
        As categorias aparecem na barra de baixo do cardápio. Categorias sem pratos ficam escondidas dos clientes.
      </p>

      <ul className="space-y-2">
        {categories.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            count={menu.items.filter((item) => item.categoryId === category.id).length}
            isFirst={index === 0}
            isLast={index === categories.length - 1}
            onMove={(direction) =>
              runAction(async () => {
                for (const changed of moveInList(categories, category.id, direction)) {
                  await getRepo().saveCategory(changed);
                }
              })
            }
          />
        ))}
      </ul>

      <Card className="space-y-4">
        <h2 className="font-display text-[19px] font-normal tracking-tight">Nova categoria</h2>
        <Field label="Nome" htmlFor="categoria-nova" error={nameError}>
          <input
            id="categoria-nova"
            value={newName}
            onChange={(event) => {
              setNewName(event.target.value);
              setNameError(undefined);
            }}
            maxLength={24}
            placeholder="Ex.: Pizzas"
            aria-invalid={Boolean(nameError)}
            className={`${inputClass} ${nameError ? "border-danger" : ""}`}
          />
        </Field>
        <div>
          <p className="mb-2 text-[13.5px] font-medium">Ícone</p>
          <IconPicker value={newIcon} onChange={setNewIcon} label="Ícone da nova categoria" />
        </div>
        <button type="button" onClick={handleAdd} className={`${primaryButton} w-full`}>
          <Plus size={18} strokeWidth={1.8} aria-hidden />
          Adicionar categoria
        </button>
      </Card>
    </div>
  );
}

function CategoryRow({
  category,
  count,
  isFirst,
  isLast,
  onMove,
}: {
  category: Category;
  count: number;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState<IconName>(category.icon);
  const [error, setError] = useState<string>();

  async function handleSave() {
    if (!name.trim()) {
      setError("Escreva o nome da categoria");
      return;
    }
    setError(undefined);
    const ok = await runAction(
      () => getRepo().saveCategory({ ...category, name: name.trim(), icon }),
      "Categoria salva",
    );
    if (ok) setEditing(false);
  }

  if (editing) {
    return (
      <li className="space-y-4 rounded-2xl border border-accent bg-surface p-4">
        <Field label="Nome da categoria" htmlFor={`categoria-${category.id}`} error={error}>
          <input
            id={`categoria-${category.id}`}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(undefined);
            }}
            maxLength={24}
            aria-invalid={Boolean(error)}
            className={`${inputClass} ${error ? "border-danger" : ""}`}
          />
        </Field>
        <IconPicker value={icon} onChange={setIcon} label={`Ícone de ${category.name}`} />
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} className={`${primaryButton} flex-1`}>
            Salvar
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setName(category.name);
              setIcon(category.icon);
              setError(undefined);
            }}
            className={secondaryButton}
          >
            Cancelar
          </button>
        </div>
        <ConfirmButton
          label="Excluir categoria"
          question="Excluir esta categoria?"
          onConfirm={async () => {
            await runAction(() => getRepo().deleteCategory(category.id), "Categoria excluída");
          }}
          className="w-full justify-center"
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-1 rounded-2xl border border-line bg-surface p-2.5 pl-3.5">
      <Icon name={category.icon} size={22} className="shrink-0 text-accent" />
      <div className="ml-2.5 min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-semibold">{category.name}</p>
        <p className="text-[12.5px] text-muted">
          {count} {count === 1 ? "prato" : "pratos"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={isFirst}
        aria-label={`Mover ${category.name} para cima`}
        className="flex h-11 w-10 items-center justify-center rounded-full active:bg-tile disabled:opacity-25"
      >
        <ArrowUp size={18} strokeWidth={1.6} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={isLast}
        aria-label={`Mover ${category.name} para baixo`}
        className="flex h-11 w-10 items-center justify-center rounded-full active:bg-tile disabled:opacity-25"
      >
        <ArrowDown size={18} strokeWidth={1.6} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Editar ${category.name}`}
        className="flex h-11 w-11 items-center justify-center rounded-full active:bg-tile"
      >
        <Pencil size={17} strokeWidth={1.6} aria-hidden />
      </button>
    </li>
  );
}
