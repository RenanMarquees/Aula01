import type { Choices, DeliveryZone, MenuData, MenuItem, OptionGroup } from "./types";

export function findItem(menu: MenuData, id: string): MenuItem | undefined {
  return menu.items.find((item) => item.id === id);
}

export function findZone(menu: MenuData, id: string): DeliveryZone | undefined {
  return menu.zones.find((zone) => zone.id === id);
}

/** Um item "simples" não tem opções e entra no carrinho com um toque. */
export function isSimple(item: MenuItem): boolean {
  return item.optionGroups.length === 0;
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** "38", "38,50", "R$ 1.050,00" → centavos. Devolve null se não for um valor válido (maior que zero). */
export function parseMoney(text: string): number | null {
  const cleaned = text.replace(/[^\d.,]/g, "");
  if (!cleaned) return null;
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) : null;
}

/** Centavos → texto para campo de digitação: 3800 → "38,00". */
export function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

/** Preço de uma unidade: preço do item + extras das opções marcadas. */
export function unitPrice(item: MenuItem, choices: Choices): number {
  const extras = item.optionGroups.reduce((sum, group) => {
    const picked = choices[group.id] ?? [];
    return (
      sum +
      group.choices
        .filter((choice) => picked.includes(choice.id))
        .reduce((groupSum, choice) => groupSum + choice.price, 0)
    );
  }, 0);
  return item.price + extras;
}

/** Grupos obrigatórios que ainda não têm nenhuma escolha. */
export function missingGroups(item: MenuItem, choices: Choices): OptionGroup[] {
  return item.optionGroups.filter(
    (group) => group.required && (choices[group.id] ?? []).length === 0,
  );
}

/** Texto das opções marcadas, ex.: ["Ponto da carne: Ao ponto", "Adicionais: Bacon, Ovo"]. */
export function describeChoices(item: MenuItem, choices: Choices): string[] {
  return item.optionGroups.flatMap((group) => {
    const names = group.choices
      .filter((choice) => (choices[group.id] ?? []).includes(choice.id))
      .map((choice) => choice.name);
    return names.length > 0 ? [`${group.title}: ${names.join(", ")}`] : [];
  });
}

/** Ordena por posição sem alterar a lista original. */
export function byPosition<T extends { position: number }>(list: T[]): T[] {
  return [...list].sort((a, b) => a.position - b.position);
}

/** Gera um identificador único para novos pratos, categorias, bairros e opções. */
export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
