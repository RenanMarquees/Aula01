"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { byPosition, formatPrice } from "@/lib/menu-helpers";
import { moveInList, runAction } from "@/lib/panel";
import { getRepo } from "@/lib/repo";
import type { MenuData, MenuItem } from "@/lib/types";
import { Icon, ItemPhoto } from "../Icon";
import { Card, Switch, primaryButton, secondaryButton } from "./ui";

export function MenuAdmin({ menu }: { menu: MenuData }) {
  const [reordering, setReordering] = useState(false);
  const categories = byPosition(menu.categories);
  const { open } = menu.settings;

  return (
    <div className="space-y-6">
      <Card className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold">{open ? "Estamos abertos" : "Estamos fechados"}</h2>
          <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
            {open
              ? "Os clientes podem enviar pedidos."
              : "Os clientes veem o cardápio, mas não conseguem enviar pedidos."}
          </p>
        </div>
        <Switch
          checked={open}
          label="Restaurante aberto para pedidos"
          onChange={(value) =>
            runAction(
              () => getRepo().saveSettings({ open: value }),
              value ? "Restaurante aberto para pedidos" : "Restaurante marcado como fechado",
            )
          }
        />
      </Card>

      <div className="flex flex-wrap gap-2.5">
        <Link href="/painel/prato/novo" className={`${primaryButton} flex-1`}>
          <Plus size={18} strokeWidth={1.8} aria-hidden />
          Novo prato
        </Link>
        <button
          type="button"
          aria-pressed={reordering}
          onClick={() => setReordering((current) => !current)}
          className={`${secondaryButton} ${reordering ? "border-accent bg-accent-soft text-accent-dark" : ""}`}
        >
          <ArrowUpDown size={16} strokeWidth={1.6} aria-hidden />
          {reordering ? "Concluir ordem" : "Reordenar"}
        </button>
      </div>

      {categories.length === 0 ? (
        <Card className="text-center">
          <h2 className="font-display text-[19px] font-normal">Comece criando uma categoria</h2>
          <p className="mt-1 text-[13px] text-muted">
            As categorias organizam o cardápio, como Entradas, Pratos e Bebidas.
          </p>
          <Link href="/painel/categorias" className={`${primaryButton} mx-auto mt-4 w-fit`}>
            Criar categorias
          </Link>
        </Card>
      ) : (
        categories.map((category) => {
          const items = byPosition(menu.items.filter((item) => item.categoryId === category.id));
          return (
            <section key={category.id} aria-labelledby={`cat-${category.id}`}>
              <h2
                id={`cat-${category.id}`}
                className="mb-2.5 flex items-center gap-2.5 px-1 font-display text-[19px] font-normal tracking-tight"
              >
                <Icon name={category.icon} size={19} className="text-accent" />
                {category.name}
                <span className="text-[12.5px] font-normal text-muted">
                  {items.length} {items.length === 1 ? "prato" : "pratos"}
                </span>
              </h2>
              {items.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-line px-4 py-5 text-center text-[13px] text-muted">
                  Nenhum prato nesta categoria ainda.
                </p>
              ) : (
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      reordering={reordering}
                      isFirst={index === 0}
                      isLast={index === items.length - 1}
                      onMove={(direction) =>
                        runAction(async () => {
                          for (const changed of moveInList(items, item.id, direction)) {
                            await getRepo().saveItem(changed);
                          }
                        })
                      }
                    />
                  ))}
                </ul>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}

function ItemRow({
  item,
  reordering,
  isFirst,
  isLast,
  onMove,
}: {
  item: MenuItem;
  reordering: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <li className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2.5 pr-1.5">
      <Link
        href={`/painel/prato/${item.id}`}
        aria-label={`Editar ${item.name}`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl active:bg-tile"
      >
        <ItemPhoto item={item} iconSize={22} className={`h-14 w-14 shrink-0 rounded-lg ${item.available ? "" : "opacity-50"}`} />
        <span className="min-w-0 flex-1">
          <span className={`line-clamp-2 text-[14.5px] font-semibold leading-snug ${item.available ? "" : "text-muted"}`}>
            {item.name}
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-[12.5px] text-muted">
            <span className="tabular-nums">{formatPrice(item.price)}</span>
            {item.optionGroups.length > 0 && <span>· com opções</span>}
            {!item.available && (
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-accent-dark">
                Pausado
              </span>
            )}
          </span>
        </span>
        {!reordering && <ChevronRight size={18} strokeWidth={1.4} aria-hidden className="shrink-0 text-muted" />}
      </Link>

      {reordering ? (
        <div className="flex shrink-0">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={isFirst}
            aria-label={`Mover ${item.name} para cima`}
            className="flex h-11 w-11 items-center justify-center rounded-full active:bg-tile disabled:opacity-25"
          >
            <ArrowUp size={18} strokeWidth={1.6} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={isLast}
            aria-label={`Mover ${item.name} para baixo`}
            className="flex h-11 w-11 items-center justify-center rounded-full active:bg-tile disabled:opacity-25"
          >
            <ArrowDown size={18} strokeWidth={1.6} aria-hidden />
          </button>
        </div>
      ) : (
        <Switch
          checked={item.available}
          label={`Disponível: ${item.name}`}
          onChange={(value) =>
            runAction(
              () => getRepo().saveItem({ ...item, available: value }),
              value ? `${item.name} voltou ao cardápio` : `${item.name} pausado`,
            )
          }
        />
      )}
    </li>
  );
}
