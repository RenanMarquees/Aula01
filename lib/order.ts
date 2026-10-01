import type { CartLine } from "./cart";
import {
  deliveryZones,
  describeChoices,
  findItem,
  formatPrice,
  restaurant,
  unitPrice,
} from "./menu-data";

export type OrderType = "mesa" | "retirada" | "entrega";
export type PaymentMethod = "pix" | "cartao" | "dinheiro";

/** Dados que o cliente preenche no carrinho. */
export type OrderInfo = {
  type: OrderType | null;
  name: string;
  table: string;
  zoneId: string;
  street: string;
  number: string;
  complement: string;
  payment: PaymentMethod | null;
  /** Valor da nota para troco (texto digitado), só para pagamento em dinheiro. */
  changeFor: string;
};

export const emptyOrder: OrderInfo = {
  type: null,
  name: "",
  table: "",
  zoneId: "",
  street: "",
  number: "",
  complement: "",
  payment: null,
  changeFor: "",
};

export const orderTypeLabels: Record<OrderType, string> = {
  mesa: "Mesa",
  retirada: "Retirada",
  entrega: "Entrega",
};

export const paymentLabels: Record<PaymentMethod, string> = {
  pix: "Pix",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
};

/** Campos na ordem em que aparecem na tela (o primeiro com erro recebe o foco). */
export const fieldOrder = [
  "type",
  "table",
  "name",
  "street",
  "number",
  "zone",
  "payment",
  "changeFor",
] as const;

export type FieldKey = (typeof fieldOrder)[number];
export type OrderErrors = Partial<Record<FieldKey, string>>;

export function findZone(zoneId: string) {
  return deliveryZones.find((zone) => zone.id === zoneId);
}

export function deliveryFee(order: OrderInfo): number {
  return order.type === "entrega" ? (findZone(order.zoneId)?.fee ?? 0) : 0;
}

/** "150", "150,50", "R$ 1.050,00" → centavos. Devolve null se não for um valor válido. */
export function parseMoney(text: string): number | null {
  const cleaned = text.replace(/[^\d.,]/g, "");
  if (!cleaned) return null;
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) : null;
}

/** Confere o que falta no pedido. `totalWithFee` é o total em centavos, usado no troco. */
export function validateOrder(order: OrderInfo, totalWithFee: number): OrderErrors {
  const errors: OrderErrors = {};

  if (!order.type) errors.type = "Escolha como quer receber o pedido";
  if (order.name.trim().length < 2) errors.name = "Informe seu nome";

  if (order.type === "mesa" && !/^\d{1,3}$/.test(order.table.trim())) {
    errors.table = "Informe o número da mesa";
  }

  if (order.type === "entrega") {
    if (order.street.trim().length < 3) errors.street = "Informe a rua";
    if (!order.number.trim()) errors.number = "Informe o número";
    if (!findZone(order.zoneId)) errors.zone = "Escolha o bairro";
  }

  // Na mesa o pagamento é feito no caixa, então não há o que escolher.
  if (order.type === "mesa") return errors;

  if (!order.payment) {
    errors.payment = "Escolha a forma de pagamento";
  } else if (order.payment === "dinheiro" && order.changeFor.trim()) {
    const change = parseMoney(order.changeFor);
    if (change === null) errors.changeFor = "Digite um valor válido, por exemplo 100";
    else if (change < totalWithFee) {
      errors.changeFor = `O valor precisa ser pelo menos ${formatPrice(totalWithFee)}`;
    }
  }

  return errors;
}

export function firstError(errors: OrderErrors): FieldKey | null {
  return fieldOrder.find((field) => errors[field]) ?? null;
}

/** Nome do campo, usado no botão: "Complete: seu nome". */
export const fieldLabels: Record<FieldKey, string> = {
  type: "mesa, retirada ou entrega",
  table: "número da mesa",
  name: "seu nome",
  street: "rua",
  number: "número",
  zone: "bairro",
  payment: "forma de pagamento",
  changeFor: "valor do troco",
};

const clean = (text: string) => text.replace(/ /g, " ");

type MessageInput = {
  lines: CartLine[];
  generalNote: string;
  order: OrderInfo;
};

/** Texto do pedido que vai pronto no WhatsApp (*asteriscos* viram negrito lá). */
export function buildMessage({ lines, generalNote, order }: MessageInput): string {
  const subtotal = lines.reduce((sum, line) => {
    const item = findItem(line.itemId);
    return sum + (item ? unitPrice(item, line.choices) * line.qty : 0);
  }, 0);
  const fee = deliveryFee(order);
  const total = subtotal + fee;

  const out: string[] = [];
  out.push(`*NOVO PEDIDO - ${restaurant.name}*`);

  if (order.type === "mesa") out.push(`*Mesa ${order.table.trim()}*`);
  if (order.type === "retirada") out.push("*Retirada no balcão*");
  if (order.type === "entrega") out.push("*Entrega*");
  out.push(`Cliente: ${order.name.trim()}`);

  if (order.type === "entrega") {
    const zone = findZone(order.zoneId);
    const address = `${order.street.trim()}, ${order.number.trim()} - ${zone?.name ?? ""}`;
    out.push(`Endereço: ${address}`);
    if (order.complement.trim()) out.push(`Complemento: ${order.complement.trim()}`);
  }

  out.push("", "*Itens*");
  for (const line of lines) {
    const item = findItem(line.itemId);
    if (!item) continue;
    out.push(`${line.qty}x ${item.name} - ${formatPrice(unitPrice(item, line.choices) * line.qty)}`);
    for (const detail of describeChoices(item, line.choices)) out.push(`   ${detail}`);
    if (line.note) out.push(`   Obs.: ${line.note}`);
  }

  if (generalNote.trim()) out.push("", `*Observação do pedido:* ${generalNote.trim()}`);

  out.push("", `Subtotal: ${formatPrice(subtotal)}`);
  if (order.type === "entrega") {
    out.push(`Taxa de entrega (${findZone(order.zoneId)?.name ?? ""}): ${formatPrice(fee)}`);
  }
  out.push(`*Total: ${formatPrice(total)}*`);

  if (order.type !== "mesa" && order.payment) {
    let payment = `Pagamento: ${paymentLabels[order.payment]}`;
    if (order.payment === "dinheiro") {
      const change = parseMoney(order.changeFor);
      payment += change ? ` (troco para ${formatPrice(change)})` : " (não precisa de troco)";
    }
    out.push(payment);
  }

  return clean(out.join("\n"));
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(message)}`;
}
