"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ClockAlert, Info, MessageCircle, ShoppingBag, TriangleAlert } from "lucide-react";
import { useCart } from "@/lib/cart";
import { findZone, formatPrice } from "@/lib/menu-helpers";
import {
  buildMessage,
  orderTypeLabels,
  paymentLabels,
  validateOrder,
  whatsappUrl,
} from "@/lib/order";
import { showToast } from "@/lib/toast";
import type { MenuData } from "@/lib/types";
import { BackButton } from "./BackButton";
import { MenuGate } from "./MenuGate";
import { PageShell } from "./PageShell";

/** Transforma *texto* em negrito, do mesmo jeito que o WhatsApp mostra. */
function renderWhatsAppText(message: string): ReactNode[] {
  return message.split(/(\*[^*\n]+\*)/g).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <strong key={index}>{part.slice(1, -1)}</strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function ConfirmView() {
  return <MenuGate>{(menu) => <ConfirmInner menu={menu} />}</MenuGate>;
}

function ConfirmInner({ menu }: { menu: MenuData }) {
  const router = useRouter();
  const cart = useCart();
  const [sent, setSent] = useState(false);

  const errors = validateOrder(cart.order, cart.totalWithFee, menu);
  const incomplete =
    Object.keys(errors).length > 0 || cart.unavailableCount > 0 || cart.count === 0;

  function startOver() {
    cart.clearItems();
    showToast("Pedido enviado. Obrigado!");
    router.replace("/");
  }

  return (
    <PageShell className="pb-56">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-paper/95 px-3 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur">
        <BackButton label="Voltar ao carrinho" />
        <h1 className="font-display text-[21px] font-normal tracking-tight">Confirmar pedido</h1>
      </header>

      {!cart.ready ? null : cart.lines.length === 0 ? (
        <Notice
          icon={<ShoppingBag size={28} strokeWidth={1.3} aria-hidden />}
          title="Seu carrinho está vazio"
          text="Escolha alguns pratos para começar o pedido."
          href="/"
          action="Ver cardápio"
        />
      ) : incomplete ? (
        <Notice
          icon={<TriangleAlert size={28} strokeWidth={1.3} aria-hidden />}
          title="Faltam algumas informações"
          text="Volte ao carrinho para completar o pedido."
          href="/carrinho"
          action="Voltar ao carrinho"
        />
      ) : (
        <ConfirmBody
          cart={cart}
          menu={menu}
          sent={sent}
          onSend={() => setSent(true)}
          onStartOver={startOver}
        />
      )}
    </PageShell>
  );
}

function ConfirmBody({
  cart,
  menu,
  sent,
  onSend,
  onStartOver,
}: {
  cart: ReturnType<typeof useCart>;
  menu: MenuData;
  sent: boolean;
  onSend: () => void;
  onStartOver: () => void;
}) {
  const { order } = cart;
  const message = buildMessage({ lines: cart.lines, generalNote: cart.generalNote, order, menu });
  const zone = findZone(menu, order.zoneId);
  const open = menu.settings.open;

  return (
    <>
      <main className="space-y-6 px-4 py-5">
        {!open && (
          <div
            role="alert"
            className="flex gap-3 rounded-2xl border border-line bg-accent-soft p-4 text-[13.5px] text-accent-dark"
          >
            <ClockAlert size={20} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0" />
            <p>
              <strong className="font-semibold">Estamos fechados no momento.</strong> Seu pedido fica
              guardado aqui, mas o envio só é liberado quando o restaurante abrir.
            </p>
          </div>
        )}

        <section aria-labelledby="resumo" className="rounded-2xl border border-line bg-surface p-4">
          <h2 id="resumo" className="text-[14px] font-semibold">
            Resumo
          </h2>
          <dl className="mt-2 space-y-1 text-[13.5px]">
            <Row label="Pedido">
              {order.type === "mesa" ? `Mesa ${order.table}` : orderTypeLabels[order.type ?? "retirada"]}
            </Row>
            <Row label="Nome">{order.name}</Row>
            {order.type === "entrega" && (
              <Row label="Endereço">
                {order.street}, {order.number} - {zone?.name}
                {order.complement ? ` (${order.complement})` : ""}
              </Row>
            )}
            <Row label="Pagamento">
              {order.type === "mesa" ? "No caixa" : order.payment ? paymentLabels[order.payment] : ""}
            </Row>
            <Row label="Itens">{formatPrice(cart.total)}</Row>
            {order.type === "entrega" && <Row label="Entrega">{formatPrice(cart.fee)}</Row>}
            <Row label="Total" strong>
              {formatPrice(cart.totalWithFee)}
            </Row>
          </dl>
        </section>

        <section aria-labelledby="previa">
          <h2 id="previa" className="mb-2 px-1 text-[14px] font-semibold">
            Prévia da mensagem
          </h2>
          <div className="rounded-2xl rounded-tl-sm border border-[#d6e4cf] bg-[#e9f1e4] p-4 text-[13.5px] leading-relaxed text-ink">
            <p className="whitespace-pre-wrap break-words">{renderWhatsAppText(message)}</p>
          </div>
          <p className="mt-3 flex gap-2 px-1 text-[12.5px] leading-snug text-muted">
            <Info size={15} strokeWidth={1.6} aria-hidden className="mt-px shrink-0" />
            <span>
              Ao tocar no botão, o WhatsApp abre com o pedido já escrito. Falta só tocar em{" "}
              <strong className="font-semibold text-ink">enviar</strong> lá dentro para o restaurante
              receber.
            </span>
          </p>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto max-w-md space-y-2 p-3">
          {open ? (
            <a
              href={whatsappUrl(message, menu.settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onSend}
              className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#1f7a4a] text-[15px] font-semibold tracking-wide text-white active:bg-[#17623b]"
            >
              <MessageCircle size={21} strokeWidth={1.6} aria-hidden />
              Enviar pedido pelo WhatsApp
            </a>
          ) : (
            <button
              type="button"
              aria-disabled="true"
              className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-muted/60 text-[15px] font-semibold text-white"
            >
              <ClockAlert size={20} strokeWidth={1.6} aria-hidden />
              Estamos fechados agora
            </button>
          )}

          {sent ? (
            <div className="space-y-1 text-center">
              <p className="text-[12.5px] text-muted">
                O WhatsApp não abriu? Toque de novo no botão acima.
              </p>
              <button
                type="button"
                onClick={onStartOver}
                className="min-h-11 text-[13.5px] font-medium text-accent"
              >
                Já enviei, começar novo pedido
              </button>
            </div>
          ) : (
            <Link href="/carrinho" className="flex min-h-11 items-center justify-center text-[13.5px] font-medium text-accent">
              Voltar e alterar o pedido
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, strong, children }: { label: string; strong?: boolean; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={`text-right ${strong ? "font-semibold" : ""}`}>{children}</dd>
    </div>
  );
}

function Notice({
  icon,
  title,
  text,
  href,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="flex flex-col items-center px-8 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tile text-accent">{icon}</span>
      <h2 className="mt-5 font-display text-[21px] font-normal">{title}</h2>
      <p className="mt-1 text-[13.5px] text-muted">{text}</p>
      <Link
        href={href}
        className="mt-7 flex min-h-12 items-center rounded-full bg-accent px-7 text-[14px] font-medium tracking-wide text-white active:bg-accent-dark"
      >
        {action}
      </Link>
    </div>
  );
}
