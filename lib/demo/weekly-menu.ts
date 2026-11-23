// Dados da demonstração "Cardápio da Semana" (copiados da página atual do cliente).
// Só esta página de demonstração usa este arquivo; o cardápio principal continua no fichário.

export const SIZES = ["200g", "300g", "400g", "500g", "PERSONALIZADO"] as const;
export type Size = (typeof SIZES)[number];

export type Tone = "terracotta" | "emerald" | "teal" | "orange";
export type SectionIcon = "utensils" | "star" | "leaf" | "soup";

export type Dish = { id: string; name: string; description?: string };

export type DishSection = {
  id: string;
  title: string;
  icon: SectionIcon;
  tone: Tone;
  dishes: Dish[];
};

export type Snack = { id: string; name: string; detail: string; description?: string };

export const SNACKS: Snack[] = [
  {
    id: "coxinha",
    name: "Coxinha",
    detail: "(4 unidades)",
    description: "Massa de cabotiá com frango bem temperado e recheio de frango desfiado.",
  },
  {
    id: "bolinha-queijo",
    name: "Bolinha de queijo",
    detail: "(4 unidades)",
    description: "Massa de batata-doce com frango e especiarias, recheada com queijo mussarela.",
  },
  { id: "mix-salgados", name: "Mix salgados", detail: "(2 coxinhas e 2 bolinhas)" },
];

export const SNACK_OFFERS = [
  { label: "8 salgados", from: "R$ 64,00", to: "R$ 48,00" },
  { label: "16 salgados", from: "R$ 120,00", to: "R$ 90,00" },
];

const SIDES = "(acompanha legumes)";

export const SECTIONS: DishSection[] = [
  {
    id: "fit",
    title: "FIT",
    icon: "utensils",
    tone: "terracotta",
    dishes: [
      {
        id: "fit-1",
        name: "ARROZ BRANCO COM LENTILHA E PERNIL",
        description:
          "Arroz branco preparado com lentilha e cebola caramelizada, acompanhado de pernil desfiado.",
      },
      {
        id: "fit-2",
        name: "ARROZ INTEGRAL COM LENTILHA E PERNIL",
        description:
          "Arroz integral preparado com lentilha e cebola caramelizada, acompanhado de pernil desfiado.",
      },
      {
        id: "fit-3",
        name: "ESCONDIDINHO (BATATA INGLESA) + CARNE MOÍDA",
        description: "Purê de batata inglesa com carne moída ao molho sugo.",
      },
      {
        id: "fit-4",
        name: "MACARRONADA PARISIENSE",
        description:
          "Macarrão integral, molho branco, frango desfiado, azeitona, cenoura, palmito, ervilha e milho.",
      },
    ],
  },
  {
    id: "arroz",
    title: "ARROZ PADRÃO",
    icon: "star",
    tone: "terracotta",
    dishes: [
      { id: "arroz-1", name: "ARROZ BRANCO + CARNE MOÍDA", description: SIDES },
      { id: "arroz-2", name: "ARROZ BRANCO + FRANGO DESFIADO", description: SIDES },
      { id: "arroz-3", name: "ARROZ BRANCO + FRANGO GRELHADO", description: SIDES },
      { id: "arroz-4", name: "ARROZ BRANCO + PERNIL BARBECUE", description: SIDES },
      { id: "arroz-5", name: "ARROZ BRANCO + PERNIL TRADICIONAL", description: SIDES },
      { id: "arroz-6", name: "ARROZ INTEGRAL + CARNE MOÍDA", description: SIDES },
      { id: "arroz-7", name: "ARROZ INTEGRAL + FRANGO DESFIADO", description: SIDES },
      { id: "arroz-8", name: "ARROZ INTEGRAL + FRANGO GRELHADO", description: SIDES },
      { id: "arroz-9", name: "ARROZ INTEGRAL + PERNIL BARBECUE", description: SIDES },
      { id: "arroz-10", name: "ARROZ INTEGRAL + PERNIL TRADICIONAL", description: SIDES },
    ],
  },
  {
    id: "pure",
    title: "PURÊ PADRÃO",
    icon: "star",
    tone: "terracotta",
    dishes: [
      { id: "pure-1", name: "PURÊ (BATATA DOCE) + CARNE MOÍDA" },
      { id: "pure-2", name: "PURÊ (BATATA DOCE) + FRANGO DESFIADO" },
      { id: "pure-3", name: "PURÊ (BATATA DOCE) + FRANGO GRELHADO" },
      { id: "pure-4", name: "PURÊ (BATATA DOCE) + PERNIL BARBECUE" },
      { id: "pure-5", name: "PURÊ (BATATA DOCE) + PERNIL TRADICIONAL" },
    ],
  },
  {
    id: "lowcarb",
    title: "LOW CARB",
    icon: "leaf",
    tone: "emerald",
    dishes: [
      { id: "low-1", name: "CARNE MOÍDA + LEGUMES" },
      {
        id: "low-2",
        name: "CREPIOCA DE FRANGO + LEGUMES",
        description:
          "Massa a base de ovos e tapioca, recheada com frango desfiado. Acompanha mix de legumes.",
      },
      { id: "low-3", name: "FRANGO DESFIADO + LEGUMES" },
      { id: "low-4", name: "FRANGO GRELHADO + LEGUMES" },
      { id: "low-5", name: "PERNIL BARBECUE + LEGUMES" },
      { id: "low-6", name: "PERNIL TRADICIONAL + LEGUMES" },
      {
        id: "low-7",
        name: "PURÊ DE CABOTIÁ + CARNE MOÍDA",
        description:
          "Purê low carb preparado a base de abóbora cabotiá, com carne bovina moída refogada.",
      },
      {
        id: "low-8",
        name: "SALADA QUENTE COM PERNIL",
        description:
          "Abobrinha, cenoura, repolho, lentilha e palmito refogados no azeite com cebola e alho. Acompanha pernil desfiado.",
      },
    ],
  },
  {
    id: "veg",
    title: "VEGETARIANA",
    icon: "leaf",
    tone: "teal",
    dishes: [
      { id: "veg-1", name: "ARROZ BRANCO + LENTILHA (VEG)" },
      { id: "veg-2", name: "ARROZ BRANCO + PTS" },
      { id: "veg-3", name: "ARROZ INTEGRAL + LENTILHA (VEG)", description: SIDES },
      { id: "veg-4", name: "ARROZ INTEGRAL + PTS", description: SIDES },
      {
        id: "veg-5",
        name: "FRICASSÊ DE PALMITO + ARROZ BRANCO",
        description: "Palmito em cubos cremoso com milho. Acompanha arroz branco.",
      },
      {
        id: "veg-6",
        name: "FRICASSÊ DE PALMITO + ARROZ INTEGRAL",
        description: "Palmito em cubos cremoso com milho. Acompanha arroz integral.",
      },
      {
        id: "veg-7",
        name: "MACARRONADA VEGETARIANA",
        description: "Macarrão integral com proteína de soja texturizada ao molho bolonhesa.",
      },
      { id: "veg-8", name: "P.T.S. + LEGUMES" },
      {
        id: "veg-9",
        name: "PANQUECA DE LEGUMES",
        description: "Panqueca recheada com mix de legumes variados e molho sugo.",
      },
      { id: "veg-10", name: "PURÊ (BATATA DOCE) + PTS" },
      { id: "veg-11", name: "PURÊ + LENTILHA" },
    ],
  },
  {
    id: "sopas",
    title: "SOPAS E CALDOS",
    icon: "soup",
    tone: "orange",
    dishes: [
      { id: "sopa-1", name: "CANJA DE GALINHA" },
      { id: "sopa-2", name: "SOPA DE MANDIOCA" },
    ],
  },
];

const DISH_BY_ID = new Map(SECTIONS.flatMap((s) => s.dishes.map((d) => [d.id, d] as const)));
const SNACK_BY_ID = new Map(SNACKS.map((s) => [s.id, s] as const));

export function findDish(id: string) {
  return DISH_BY_ID.get(id);
}

export function findSnack(id: string) {
  return SNACK_BY_ID.get(id);
}

// ---------- Carrinho ----------

/** Uma linha do carrinho: marmita em um tamanho, ou pacote de salgados (sem tamanho). */
export type CartLine =
  | { kind: "dish"; id: string; size: Size; qty: number; note?: string }
  | { kind: "snack"; id: string; qty: number };

export function lineKey(line: CartLine) {
  return line.kind === "dish" ? `dish:${line.size}:${line.note ?? ""}:${line.id}` : `snack:${line.id}`;
}

/** Junta linhas iguais (mesmo prato, tamanho e observação) somando as quantidades. */
export function mergeLines(cart: CartLine[], incoming: CartLine[]): CartLine[] {
  const next = cart.map((l) => ({ ...l }));
  for (const line of incoming) {
    const existing = next.find((l) => lineKey(l) === lineKey(line));
    if (existing) existing.qty += line.qty;
    else next.push({ ...line });
  }
  return next;
}

export function countDishes(lines: CartLine[]) {
  return lines.reduce((sum, l) => (l.kind === "dish" ? sum + l.qty : sum), 0);
}

export function countSnackPacks(lines: CartLine[]) {
  return lines.reduce((sum, l) => (l.kind === "snack" ? sum + l.qty : sum), 0);
}

/** Grupos para mostrar o carrinho e montar a mensagem: um por tamanho, na ordem da tabela. */
export function groupBySize(lines: CartLine[]) {
  const groups: { size: Size; note?: string; lines: Extract<CartLine, { kind: "dish" }>[] }[] = [];
  for (const size of SIZES) {
    const ofSize = lines.filter(
      (l): l is Extract<CartLine, { kind: "dish" }> => l.kind === "dish" && l.size === size,
    );
    const notes = [...new Set(ofSize.map((l) => l.note ?? ""))];
    for (const note of notes) {
      const group = ofSize.filter((l) => (l.note ?? "") === note);
      if (group.length) groups.push({ size, note: note || undefined, lines: group });
    }
  }
  return groups;
}

export function buildWhatsAppMessage(lines: CartLine[], name: string, phone: string) {
  const out: string[] = ["*Pedido - Cardápio da Semana*", ""];

  for (const group of groupBySize(lines)) {
    const total = group.lines.reduce((s, l) => s + l.qty, 0);
    const label = group.size === "PERSONALIZADO" ? "Personalizado" : group.size;
    out.push(`*${label}* (${total} marmita${total > 1 ? "s" : ""})`);
    if (group.note) out.push(`_Como quero: ${group.note}_`);
    for (const l of group.lines) out.push(`${l.qty}x ${findDish(l.id)?.name ?? l.id}`);
    out.push("");
  }

  const snacks = lines.filter((l) => l.kind === "snack");
  if (snacks.length) {
    const packs = countSnackPacks(lines);
    out.push(`*Salgados* (${packs} pacote${packs > 1 ? "s" : ""} = ${packs * 4} unidades)`);
    for (const l of snacks) out.push(`${l.qty}x ${findSnack(l.id)?.name ?? l.id}`);
    out.push("");
  }

  const dishes = countDishes(lines);
  out.push(`Total: ${dishes} marmita${dishes === 1 ? "" : "s"}`);
  out.push("");
  out.push(`Nome: ${name.trim()}`);
  out.push(`Telefone: ${phone.trim()}`);
  return out.join("\n");
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
