// Dados de exemplo. Na Etapa 4, o dono passa a editar tudo isso pelo painel.

export type Category = {
  id: string;
  name: string;
  emoji: string;
};

export type OptionChoice = {
  id: string;
  name: string;
  /** Valor extra em centavos (0 = sem custo adicional). */
  price: number;
};

export type OptionGroup = {
  id: string;
  title: string;
  required: boolean;
  /** "single" = escolhe uma; "multiple" = escolhe várias. */
  type: "single" | "multiple";
  choices: OptionChoice[];
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  /** Preço em centavos, para evitar erros de arredondamento. */
  price: number;
  emoji: string;
  /** Classes de cor do fundo da "foto" provisória. */
  tone: string;
  available: boolean;
  optionGroups?: OptionGroup[];
};

export const restaurant = {
  name: "Restaurante Exemplo",
  tagline: "Monte seu pedido e envie pelo WhatsApp",
  logoEmoji: "🍴",
};

export const categories: Category[] = [
  { id: "entradas", name: "Entradas", emoji: "🥖" },
  { id: "pratos", name: "Pratos", emoji: "🍽️" },
  { id: "bebidas", name: "Bebidas", emoji: "🥤" },
  { id: "sobremesas", name: "Sobremesas", emoji: "🍰" },
];

const pontoDaCarne: OptionGroup = {
  id: "ponto",
  title: "Ponto da carne",
  required: true,
  type: "single",
  choices: [
    { id: "mal", name: "Mal passado", price: 0 },
    { id: "ao-ponto", name: "Ao ponto", price: 0 },
    { id: "bem", name: "Bem passado", price: 0 },
  ],
};

export const items: MenuItem[] = [
  // Entradas
  {
    id: "bruschetta",
    categoryId: "entradas",
    name: "Bruschetta de tomate",
    description: "Pão italiano tostado, tomate fresco, manjericão e azeite.",
    price: 2200,
    emoji: "🍅",
    tone: "from-red-200 to-orange-100",
    available: true,
  },
  {
    id: "bolinho-bacalhau",
    categoryId: "entradas",
    name: "Bolinho de bacalhau",
    description: "6 unidades crocantes, acompanham molho de limão.",
    price: 3200,
    emoji: "🧆",
    tone: "from-amber-200 to-yellow-100",
    available: true,
  },
  {
    id: "batata-rustica",
    categoryId: "entradas",
    name: "Batata rústica",
    description: "Porção grande, temperada com alecrim e sal grosso.",
    price: 2800,
    emoji: "🥔",
    tone: "from-yellow-200 to-amber-100",
    available: true,
    optionGroups: [
      {
        id: "adicionais",
        title: "Adicionais",
        required: false,
        type: "multiple",
        choices: [
          { id: "cheddar", name: "Cheddar e bacon", price: 800 },
          { id: "maionese", name: "Maionese da casa", price: 300 },
        ],
      },
    ],
  },

  // Pratos
  {
    id: "hamburguer-classico",
    categoryId: "pratos",
    name: "Hambúrguer clássico",
    description: "Blend 180 g, queijo, alface, tomate e molho especial no pão brioche.",
    price: 3800,
    emoji: "🍔",
    tone: "from-orange-200 to-amber-100",
    available: true,
    optionGroups: [
      pontoDaCarne,
      {
        id: "adicionais",
        title: "Adicionais",
        required: false,
        type: "multiple",
        choices: [
          { id: "bacon", name: "Bacon", price: 500 },
          { id: "ovo", name: "Ovo", price: 300 },
          { id: "queijo-extra", name: "Queijo extra", price: 400 },
        ],
      },
    ],
  },
  {
    id: "risoto-cogumelos",
    categoryId: "pratos",
    name: "Risoto de cogumelos",
    description: "Arroz arbóreo cremoso com mix de cogumelos e parmesão.",
    price: 4600,
    emoji: "🍄",
    tone: "from-stone-200 to-amber-100",
    available: true,
    optionGroups: [
      {
        id: "tamanho",
        title: "Tamanho",
        required: true,
        type: "single",
        choices: [
          { id: "individual", name: "Individual", price: 0 },
          { id: "para-dois", name: "Para dividir (2 pessoas)", price: 3800 },
        ],
      },
    ],
  },
  {
    id: "file-parmegiana",
    categoryId: "pratos",
    name: "Filé à parmegiana",
    description: "Filé empanado com molho de tomate e queijo gratinado, arroz e batata frita.",
    price: 5200,
    emoji: "🥩",
    tone: "from-red-200 to-orange-100",
    available: true,
  },
  {
    id: "salada-caesar",
    categoryId: "pratos",
    name: "Salada Caesar com frango",
    description: "Alface americana, frango grelhado, croutons e molho Caesar.",
    price: 3600,
    emoji: "🥗",
    tone: "from-green-200 to-lime-100",
    available: true,
  },

  // Bebidas
  {
    id: "suco-laranja",
    categoryId: "bebidas",
    name: "Suco de laranja",
    description: "Natural, espremido na hora. 400 ml.",
    price: 800,
    emoji: "🍊",
    tone: "from-orange-200 to-yellow-100",
    available: true,
  },
  {
    id: "refrigerante",
    categoryId: "bebidas",
    name: "Refrigerante lata",
    description: "Cola, guaraná ou limão. 350 ml.",
    price: 600,
    emoji: "🥤",
    tone: "from-red-200 to-rose-100",
    available: true,
  },
  {
    id: "agua",
    categoryId: "bebidas",
    name: "Água mineral",
    description: "Com ou sem gás. 500 ml.",
    price: 400,
    emoji: "💧",
    tone: "from-sky-200 to-cyan-100",
    available: true,
  },
  {
    id: "cerveja",
    categoryId: "bebidas",
    name: "Cerveja long neck",
    description: "Bem gelada. 355 ml.",
    price: 1200,
    emoji: "🍺",
    tone: "from-yellow-200 to-amber-100",
    available: true,
  },

  // Sobremesas
  {
    id: "petit-gateau",
    categoryId: "sobremesas",
    name: "Petit gâteau",
    description: "Bolinho de chocolate com centro cremoso e sorvete de creme.",
    price: 2600,
    emoji: "🍫",
    tone: "from-amber-300 to-orange-100",
    available: true,
    optionGroups: [
      {
        id: "cobertura",
        title: "Cobertura",
        required: false,
        type: "multiple",
        choices: [{ id: "calda-frutas", name: "Calda de frutas vermelhas", price: 300 }],
      },
    ],
  },
  {
    id: "pudim",
    categoryId: "sobremesas",
    name: "Pudim de leite",
    description: "Receita da casa, com calda de caramelo.",
    price: 1600,
    emoji: "🍮",
    tone: "from-yellow-200 to-orange-100",
    available: true,
  },
  {
    id: "brownie",
    categoryId: "sobremesas",
    name: "Brownie com sorvete",
    description: "Brownie de chocolate meio amargo com bola de sorvete de baunilha.",
    price: 2200,
    emoji: "🍨",
    tone: "from-stone-300 to-amber-100",
    available: false,
  },
];

export function findItem(id: string): MenuItem | undefined {
  return items.find((item) => item.id === id);
}

/** Um item "simples" não tem opções e entra no carrinho com um toque. */
export function isSimple(item: MenuItem): boolean {
  return !item.optionGroups || item.optionGroups.length === 0;
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Escolhas do cliente: id do grupo de opções -> ids das escolhas marcadas. */
export type Choices = Record<string, string[]>;

/** Preço de uma unidade: preço do item + extras das opções marcadas. */
export function unitPrice(item: MenuItem, choices: Choices): number {
  const extras = (item.optionGroups ?? []).reduce((sum, group) => {
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
  return (item.optionGroups ?? []).filter(
    (group) => group.required && (choices[group.id] ?? []).length === 0,
  );
}

/** Texto das opções marcadas, ex.: ["Ponto da carne: Ao ponto", "Adicionais: Bacon, Ovo"]. */
export function describeChoices(item: MenuItem, choices: Choices): string[] {
  return (item.optionGroups ?? []).flatMap((group) => {
    const names = group.choices
      .filter((choice) => (choices[group.id] ?? []).includes(choice.id))
      .map((choice) => choice.name);
    return names.length > 0 ? [`${group.title}: ${names.join(", ")}`] : [];
  });
}
