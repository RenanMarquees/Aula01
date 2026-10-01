/** Nomes dos ícones de traço fino (veja components/Icon.tsx). */
export const iconNames = [
  "utensils",
  "salad",
  "sandwich",
  "soup",
  "beef",
  "fish",
  "hamburger",
  "cookie",
  "citrus",
  "cup-soda",
  "glass-water",
  "beer",
  "cake-slice",
  "dessert",
  "ice-cream-bowl",
  "wheat",
] as const;

export type IconName = (typeof iconNames)[number];

export type Category = {
  id: string;
  name: string;
  icon: IconName;
  /** Ordem de exibição (menor aparece primeiro). */
  position: number;
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
  /** Ícone mostrado quando o prato não tem foto. */
  icon: IconName;
  photoUrl: string | null;
  /** false = "pausado": aparece como esgotado e não pode ser pedido. */
  available: boolean;
  position: number;
  optionGroups: OptionGroup[];
};

export type DeliveryZone = {
  id: string;
  name: string;
  /** Taxa de entrega em centavos. */
  fee: number;
  position: number;
};

export type Settings = {
  name: string;
  tagline: string;
  /** Número que recebe os pedidos: código do país + DDD + número, só dígitos (ex.: 5543999999999). */
  whatsapp: string;
  /** Quando false, o cardápio aparece mas o envio do pedido fica bloqueado. */
  open: boolean;
  logoUrl: string | null;
  coverUrl: string | null;
};

/** Tudo o que o cardápio precisa para funcionar. */
export type MenuData = {
  settings: Settings;
  categories: Category[];
  items: MenuItem[];
  zones: DeliveryZone[];
};

/** Escolhas do cliente: id do grupo de opções -> ids das escolhas marcadas. */
export type Choices = Record<string, string[]>;
