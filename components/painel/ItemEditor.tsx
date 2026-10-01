"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { byPosition, centsToInput, newId, parseMoney } from "@/lib/menu-helpers";
import { runAction } from "@/lib/panel";
import { getRepo } from "@/lib/repo";
import { showError } from "@/lib/toast";
import type { IconName, MenuData, MenuItem } from "@/lib/types";
import { Icon } from "../Icon";
import {
  OptionGroupsEditor,
  fromEditable,
  toEditable,
  type EditableGroup,
} from "./OptionGroupsEditor";
import { Card, ConfirmButton, Field, IconPicker, ImageField, Switch, inputClass, primaryButton } from "./ui";

type FormErrors = { name?: string; price?: string; category?: string; groups: Record<string, string> };

export function ItemEditor({ menu, item }: { menu: MenuData; item: MenuItem | null }) {
  const router = useRouter();
  const categories = byPosition(menu.categories);

  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [priceText, setPriceText] = useState(item ? centsToInput(item.price) : "");
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? categories[0]?.id ?? "");
  const [icon, setIcon] = useState<IconName>(item?.icon ?? "utensils");
  const [photoUrl, setPhotoUrl] = useState<string | null>(item?.photoUrl ?? null);
  const [available, setAvailable] = useState(item?.available ?? true);
  const [groups, setGroups] = useState<EditableGroup[]>(() => toEditable(item?.optionGroups ?? []));
  const [errors, setErrors] = useState<FormErrors>({ groups: {} });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const next: FormErrors = { groups: {} };
    if (!name.trim()) next.name = "Escreva o nome do prato";
    const price = parseMoney(priceText);
    if (price === null) next.price = "Informe o preço, por exemplo 38,00";
    if (!categoryId) next.category = "Escolha uma categoria";
    const parsedGroups = fromEditable(groups);
    if (!parsedGroups.ok) next.groups = parsedGroups.errors;

    const hasErrors = Boolean(next.name || next.price || next.category) || Object.keys(next.groups).length > 0;
    setErrors(next);
    if (hasErrors || price === null || !parsedGroups.ok) {
      showError("Confira os campos em vermelho.");
      // Espera a tela mostrar os avisos e rola até o primeiro.
      setTimeout(() => {
        document
          .querySelector("[role=alert]:not([aria-live])")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    // Prato novo, ou que mudou de categoria, vai para o fim da lista da categoria.
    const sameCategory = item && item.categoryId === categoryId;
    const inCategory = menu.items.filter((other) => other.categoryId === categoryId && other.id !== item?.id);
    const position = sameCategory
      ? item.position
      : inCategory.reduce((max, other) => Math.max(max, other.position), -1) + 1;

    const saved: MenuItem = {
      id: item?.id ?? newId(),
      categoryId,
      name: name.trim(),
      description: description.trim(),
      price,
      icon,
      photoUrl,
      available,
      position,
      optionGroups: parsedGroups.groups,
    };

    setSaving(true);
    const ok = await runAction(() => getRepo().saveItem(saved), "Prato salvo");
    setSaving(false);
    if (ok) router.push("/painel");
  }

  async function handleDelete() {
    if (!item) return;
    const ok = await runAction(() => getRepo().deleteItem(item.id), "Prato excluído");
    if (ok) router.push("/painel");
  }

  if (categories.length === 0) {
    return (
      <Card className="text-center">
        <h2 className="font-display text-[19px] font-normal">Crie uma categoria primeiro</h2>
        <p className="mt-1 text-[13px] text-muted">Todo prato precisa estar em uma categoria.</p>
        <Link href="/painel/categorias" className={`${primaryButton} mx-auto mt-4 w-fit`}>
          Criar categorias
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <Link href="/painel" className="-mt-2 flex min-h-11 w-fit items-center gap-2 text-[13.5px] font-medium text-accent">
        <ArrowLeft size={16} strokeWidth={1.6} aria-hidden />
        Voltar ao cardápio
      </Link>

      <Card className="space-y-5">
        <ImageField
          label="Foto do prato"
          value={photoUrl}
          kind="item"
          maxSize={1000}
          onChange={setPhotoUrl}
          fallback={<Icon name={icon} size={30} />}
        />
        <div>
          <p className="mb-1.5 text-[13.5px] font-medium">Ícone</p>
          <p className="mb-2 text-[12px] text-muted">Aparece no lugar da foto, enquanto o prato não tiver uma.</p>
          <IconPicker value={icon} onChange={setIcon} label="Ícone do prato" />
        </div>
      </Card>

      <Card className="space-y-4">
        <Field label="Nome do prato" htmlFor="prato-nome" error={errors.name}>
          <input
            id="prato-nome"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            maxLength={60}
            placeholder="Ex.: Hambúrguer clássico"
            aria-invalid={Boolean(errors.name)}
            className={`${inputClass} ${errors.name ? "border-danger" : ""}`}
          />
        </Field>

        <Field label="Descrição" htmlFor="prato-descricao" hint="Uma frase curta, com os principais ingredientes.">
          <textarea
            id="prato-descricao"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={160}
            rows={3}
            className={`${inputClass} resize-none py-3`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Preço (R$)" htmlFor="prato-preco" error={errors.price}>
            <input
              id="prato-preco"
              value={priceText}
              onChange={(event) => {
                setPriceText(event.target.value);
                setErrors((current) => ({ ...current, price: undefined }));
              }}
              inputMode="decimal"
              maxLength={9}
              placeholder="38,00"
              aria-invalid={Boolean(errors.price)}
              className={`${inputClass} ${errors.price ? "border-danger" : ""}`}
            />
          </Field>
          <Field label="Categoria" htmlFor="prato-categoria" error={errors.category}>
            <select
              id="prato-categoria"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[13.5px] font-medium">Disponível</p>
            <p className="text-[12px] text-muted">Desligue para pausar o prato (aparece como esgotado).</p>
          </div>
          <Switch checked={available} label="Prato disponível" onChange={setAvailable} />
        </div>
      </Card>

      <section aria-labelledby="titulo-opcoes">
        <h2 id="titulo-opcoes" className="mb-1 px-1 font-display text-[19px] font-normal tracking-tight">
          Opções do prato
        </h2>
        <p className="mb-3 px-1 text-[12.5px] leading-snug text-muted">
          Use para ponto da carne, tamanho, adicionais e outras escolhas do cliente.
        </p>
        <OptionGroupsEditor
          groups={groups}
          errors={errors.groups}
          onChange={setGroups}
          onClearError={(key) =>
            setErrors((current) => {
              const { [key]: _removed, ...rest } = current.groups;
              void _removed;
              return { ...current, groups: rest };
            })
          }
        />
      </section>

      {item && (
        <div className="pt-2">
          <ConfirmButton
            label="Excluir este prato"
            question="Excluir o prato de vez?"
            onConfirm={handleDelete}
            className="w-full justify-center"
          />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-16 z-20 px-4 pb-3 pt-3 [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))] print:hidden">
        <div className="mx-auto max-w-2xl">
          <button type="button" onClick={handleSave} disabled={saving} className={`${primaryButton} w-full shadow-lg`}>
            {saving ? "Salvando…" : item ? "Salvar alterações" : "Adicionar ao cardápio"}
          </button>
        </div>
      </div>
    </div>
  );
}
