// Dados de exemplo. Na Etapa 4, o dono passa a editar tudo isso pelo painel.

/** Nomes dos ícones de traço fino (veja components/Icon.tsx). */
export type IconName =
  | "utensils"
  | "salad"
  | "sandwich"
  | "soup"
  | "beef"
  | "fish"
  | "hamburger"
  | "cookie"
  | "citrus"
  | "cup-soda"
  | "glass-water"
  | "beer"
  | "cake-slice"
  | "dessert"
  | "ice-cream-bowl"
  | "wheat";

export type Category = {
  id: string;
  name: string;
  icon: IconName;
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
  /** Ícone mostrado no lugar da foto, até o dono enviar a foto real. */
  icon: IconName;
  available: boolean;
  optionGroups?: OptionGroup[];
};

export const restaurant = {
  name: "Restaurante Exemplo",
  tagline: "Monte seu pedido e envie pelo WhatsApp",
  /** Número que recebe os pedidos (código do país 55 + DDD + número). NÚMERO DE TESTE: trocar pelo do restaurante. */
  whatsapp: "5543999288173",
  /** Quando false, o cardápio aparece mas o envio do pedido fica bloqueado. O dono controla isso no painel (Etapa 4). */
  open: true,
};

export type DeliveryZone = {
  id: string;
  name: string;
  /** Taxa de entrega em centavos. */
  fee: number;
};

/** Bairros atendidos e taxa de cada um. O dono edita no painel (Etapa 4). */
export const deliveryZones: DeliveryZone[] = [
  { id: "centro", name: "Centro", fee: 500 },
  { id: "jardim-america", name: "Jardim América", fee: 700 },
  { id: "vila-nova", name: "Vila Nova", fee: 800 },
  { id: "bela-vista", name: "Bela Vista", fee: 1000 },
];

export const categories: Category[] = [
  { id: "entradas", name: "Entradas", icon: "salad" },
  { id: "pratos", name: "Pratos", icon: "utensils" },
  { id: "bebidas", name: "Bebidas", icon: "cup-soda" },
  { id: "sobremesas", name: "Sobremesas", icon: "cake-slice" },
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
    icon: "sandwich",
    available: true,
  },
  {
    id: "bolinho-bacalhau",
    categoryId: "entradas",
    name: "Bolinho de bacalhau",
    description: "6 unidades crocantes, acompanham molho de limão.",
    price: 3200,
    icon: "fish",
    available: true,
  },
  {
    id: "batata-rustica",
    categoryId: "entradas",
    name: "Batata rústica",
    description: "Porção grande, temperada com alecrim e sal grosso.",
    price: 2800,
    icon: "wheat",
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
    icon: "hamburger",
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
    icon: "soup",
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
    icon: "beef",
    available: true,
  },
  {
    id: "salada-caesar",
    categoryId: "pratos",
    name: "Salada Caesar com frango",
    description: "Alface americana, frango grelhado, croutons e molho Caesar.",
    price: 3600,
    icon: "salad",
    available: true,
  },

  // Bebidas
  {
    id: "suco-laranja",
    categoryId: "bebidas",
    name: "Suco de laranja",
    description: "Natural, espremido na hora. 400 ml.",
    price: 800,
    icon: "citrus",
    available: true,
  },
  {
    id: "refrigerante",
    categoryId: "bebidas",
    name: "Refrigerante lata",
    description: "Cola, guaraná ou limão. 350 ml.",
    price: 600,
    icon: "cup-soda",
    available: true,
  },
  {
    id: "agua",
    categoryId: "bebidas",
    name: "Água mineral",
    description: "Com ou sem gás. 500 ml.",
    price: 400,
    icon: "glass-water",
    available: true,
  },
  {
    id: "cerveja",
    categoryId: "bebidas",
    name: "Cerveja long neck",
    description: "Bem gelada. 355 ml.",
    price: 1200,
    icon: "beer",
    available: true,
  },

  // Sobremesas
  {
    id: "petit-gateau",
    categoryId: "sobremesas",
    name: "Petit gâteau",
    description: "Bolinho de chocolate com centro cremoso e sorvete de creme.",
    price: 2600,
    icon: "cookie",
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
    icon: "dessert",
    available: true,
  },
  {
    id: "brownie",
    categoryId: "sobremesas",
    name: "Brownie com sorvete",
    description: "Brownie de chocolate meio amargo com bola de sorvete de baunilha.",
    price: 2200,
    icon: "ice-cream-bowl",
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
