import type { Category, DeliveryZone, MenuData, MenuItem, OptionGroup, Settings } from "./types";

// Cardápio de exemplo. Serve de "fichário de rascunho" (modo demonstração) e de ponto de partida
// do fichário online (veja supabase/seed.sql, gerado a partir deste arquivo).

type RawItem = Omit<MenuItem, "photoUrl" | "position" | "optionGroups"> & {
  optionGroups?: OptionGroup[];
};

const settings: Settings = {
  name: "Restaurante Exemplo",
  tagline: "Monte seu pedido e envie pelo WhatsApp",
  // Número de TESTE (código do país 55 + DDD + número). O dono troca pelo real no painel.
  whatsapp: "5543999288173",
  open: true,
  logoUrl: null,
  coverUrl: null,
};

const zones: DeliveryZone[] = [
  { id: "centro", name: "Centro", fee: 500, position: 0 },
  { id: "jardim-america", name: "Jardim América", fee: 700, position: 1 },
  { id: "vila-nova", name: "Vila Nova", fee: 800, position: 2 },
  { id: "bela-vista", name: "Bela Vista", fee: 1000, position: 3 },
];

const categories: Category[] = [
  { id: "entradas", name: "Entradas", icon: "salad", position: 0 },
  { id: "pratos", name: "Pratos", icon: "utensils", position: 1 },
  { id: "bebidas", name: "Bebidas", icon: "cup-soda", position: 2 },
  { id: "sobremesas", name: "Sobremesas", icon: "cake-slice", position: 3 },
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

const rawItems: RawItem[] = [
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

export function createSampleMenu(): MenuData {
  return {
    settings: { ...settings },
    categories: categories.map((category) => ({ ...category })),
    items: rawItems.map((item, index) => ({
      photoUrl: null,
      optionGroups: [],
      position: index,
      ...item,
    })),
    zones: zones.map((zone) => ({ ...zone })),
  };
}
