"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  CircleCheck,
  ClipboardList,
  Leaf,
  MessageCircle,
  Minus,
  Plus,
  Send,
  ShoppingBasket,
  ShoppingCart,
  Soup,
  Sprout,
  Star,
  Trash2,
  User,
  Utensils,
  X,
} from "lucide-react";
import { showError, showToast } from "@/lib/toast";
import { setCart, useWeeklyCart } from "@/lib/demo/weekly-cart";
import {
  SECTIONS,
  SIZES,
  SNACKS,
  SNACK_OFFERS,
  buildWhatsAppMessage,
  countDishes,
  countSnackPacks,
  findDish,
  findSnack,
  formatPhone,
  groupBySize,
  lineKey,
  mergeLines,
  type CartLine,
  type DishSection,
  type SectionIcon,
  type Size,
  type Tone,
} from "@/lib/demo/weekly-menu";

type Picks = Record<string, number>;

const SECTION_ICONS: Record<SectionIcon, typeof Utensils> = {
  utensils: Utensils,
  star: Star,
  leaf: Leaf,
  soup: Soup,
};

const TONES: Record<Tone, { card: string; head: string; title: string }> = {
  terracotta: { card: "border-[#f1d7c8]", head: "bg-[#fff7f2] border-[#f1d7c8]", title: "text-[#b85b36]" },
  emerald: { card: "border-emerald-100", head: "bg-emerald-50 border-emerald-100", title: "text-emerald-700" },
  teal: { card: "border-teal-100", head: "bg-teal-50 border-teal-100", title: "text-teal-700" },
  orange: { card: "border-orange-100", head: "bg-orange-50 border-orange-100", title: "text-orange-700" },
};

const sizeLabel = (size: Size) => (size === "PERSONALIZADO" ? "Personalizado" : size);
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const sum = (picks: Picks) => Object.values(picks).reduce((a, b) => a + b, 0);

export function WeeklyMenu() {
  const cart = useWeeklyCart();
  const [size, setSize] = useState<Size | null>(null);
  const [custom, setCustom] = useState("");
  const [picks, setPicks] = useState<Picks>({});
  const [snackPicks, setSnackPicks] = useState<Picks>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [howOpen, setHowOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const cartRef = useRef<HTMLElement>(null);
  const checkoutRef = useRef<HTMLElement>(null);

  const pendingDishes = sum(picks);
  const pendingSnacks = sum(snackPicks);
  const pending = pendingDishes + pendingSnacks;
  const cartDishes = countDishes(cart);
  const cartPacks = countSnackPacks(cart);
  const cartCount = cartDishes + cartPacks;
  const phoneOk = phone.replace(/\D/g, "").length >= 10;
  const canSend = cartCount > 0 && name.trim().length >= 2 && phoneOk;

  function changePick(setter: typeof setPicks, id: string, delta: number) {
    setter((prev) => {
      const qty = Math.max(0, (prev[id] ?? 0) + delta);
      const next = { ...prev };
      if (qty) next[id] = qty;
      else delete next[id];
      return next;
    });
  }

  function addToCart() {
    if (pendingDishes > 0 && !size) {
      showError("Escolha o tamanho das marmitas antes de colocar no carrinho.");
      return;
    }
    const note = size === "PERSONALIZADO" ? custom.trim() : "";
    if (pendingDishes > 0 && size === "PERSONALIZADO" && !note) {
      showError("Conte como quer a marmita personalizada.");
      return;
    }
    const incoming: CartLine[] = [
      ...Object.entries(picks).map(
        ([id, qty]): CartLine => ({ kind: "dish", id, size: size as Size, qty, note: note || undefined }),
      ),
      ...Object.entries(snackPicks).map(([id, qty]): CartLine => ({ kind: "snack", id, qty })),
    ];
    setCart(mergeLines(cart, incoming));
    setPicks({});
    setSnackPicks({});
    setBump((b) => b + 1);

    const parts = [];
    if (pendingDishes) parts.push(`${plural(pendingDishes, "marmita", "marmitas")} de ${sizeLabel(size as Size)}`);
    if (pendingSnacks) parts.push(plural(pendingSnacks, "pacote de salgados", "pacotes de salgados"));
    showToast(`${parts.join(" e ")} no carrinho`);
  }

  function updateLine(line: CartLine, delta: number) {
    setCart(cart.map((l) => (lineKey(l) === lineKey(line) ? { ...l, qty: l.qty + delta } : l)));
  }

  function removeLine(line: CartLine) {
    setCart(cart.filter((l) => lineKey(l) !== lineKey(line)));
  }

  function sendOrder() {
    const text = buildWhatsAppMessage(cart, name, phone);
    // Demonstração: sem número fixo, o WhatsApp pergunta para quem enviar.
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  const scrollTo = (el: HTMLElement | null) => el?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="min-h-screen bg-[#f5f1e9] px-3 py-4 text-[#15332f] sm:px-6 sm:py-8">
      <p className="mx-auto mb-3 w-fit rounded-full bg-[#14332f] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white">
        Demonstração · pedido com carrinho
      </p>

      <div className="mx-auto max-w-5xl rounded-[28px] border border-[#e3d8c8] bg-[#fffdf8] p-4 shadow-2xl shadow-black/10 sm:p-8">
        <header className="grid gap-5 sm:grid-cols-[280px_1fr] sm:items-center">
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-[#1b413c] px-4 py-6 text-[#f5f1e9] shadow-sm sm:aspect-[16/7] sm:py-4">
            <Sprout className="h-9 w-9 text-[#ff952e]" aria-hidden />
            <p className="text-3xl font-black leading-none tracking-tight">Fit Garden</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b85b36]">Marmitas saudáveis</p>
            <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#14332f] sm:text-5xl">
              Cardápio da Semana
            </h1>
            <p className="mt-2 text-sm font-medium text-[#47625d] sm:text-base">
              Monte seu carrinho: escolha um tamanho, as marmitas e toque em <strong>Colocar no carrinho</strong>.
              Quer outro tamanho? É só repetir.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <button
                type="button"
                onClick={() => setHowOpen(true)}
                className="h-10 rounded-xl border border-[#d8cbbd] bg-white px-4 text-sm font-bold transition hover:bg-[#f7faf8] active:scale-95"
              >
                Como funciona o pedido
              </button>
              <button
                type="button"
                onClick={() => scrollTo(cartRef.current)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d8cbbd] bg-white px-4 text-sm font-bold transition hover:bg-[#f7faf8] active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden />
                Ver carrinho
                {cartCount > 0 && (
                  <span className="rounded-full bg-[#c24f2f] px-2 py-0.5 text-xs text-white">{cartCount}</span>
                )}
              </button>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-2xl border-4 border-[#14332f] bg-white p-3 shadow-sm">
          <div className="mb-2 text-xs font-black uppercase tracking-widest text-[#14332f]">É muito fácil pedir:</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Step n={1} icon={<CircleCheck className="h-7 w-7 shrink-0" aria-hidden />}>
              Escolha um tamanho e as quantidades.
            </Step>
            <Step n={2} icon={<ShoppingCart className="h-7 w-7 shrink-0" aria-hidden />}>
              Coloque no carrinho. Pode repetir com outro tamanho.
            </Step>
            <Step n={3} icon={<Send className="h-7 w-7 shrink-0" aria-hidden />}>
              Revise o carrinho, digite nome e telefone e envie.
            </Step>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-base font-black uppercase text-[#14332f]" id="size-label">
            Tamanho das marmitas
          </p>
          <div role="radiogroup" aria-labelledby="size-label" className="mt-2 flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => setSize(s)}
                className={`h-11 rounded-xl border px-4 text-sm font-black transition active:scale-95 ${
                  size === s
                    ? "border-[#14332f] bg-[#14332f] text-white shadow"
                    : "border-[#d8cbbd] bg-[#fffdf8] text-[#14332f] hover:bg-[#f7faf8]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {size === "PERSONALIZADO" && (
            <label className="mt-3 block">
              <span className="text-xs font-bold uppercase text-[#47625d]">Como você quer a marmita?</span>
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Ex.: 150g de carboidrato e 200g de proteína"
                className="mt-1 h-11 w-full rounded-xl border border-[#d8cbbd] bg-[#fffdf8] px-3 text-sm"
              />
            </label>
          )}
          <p className="mt-2 text-xs font-bold text-[#b85b36]">
            {size
              ? `As quantidades que você escolher abaixo vão como ${sizeLabel(size)}.`
              : "Selecione o tamanho para liberar as quantidades."}
            {cartDishes > 0 && " As marmitas que já estão no carrinho continuam com o tamanho escolhido antes."}
          </p>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <SnackCard picks={snackPicks} onChange={(id, d) => changePick(setSnackPicks, id, d)} />
          {SECTIONS.map((section) => (
            <DishCard
              key={section.id}
              section={section}
              picks={picks}
              disabled={!size}
              onChange={(id, d) => changePick(setPicks, id, d)}
            />
          ))}
        </section>

        {/* Barra fixa: mostra o que está sendo escolhido e leva ao carrinho. */}
        <section className="sticky bottom-2 z-20 mt-6 rounded-2xl border-2 border-[#14332f] bg-white/95 p-3 shadow-2xl backdrop-blur sm:bottom-3 sm:p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo(cartRef.current)}
              aria-label={`Ver carrinho: ${plural(cartCount, "item", "itens")}`}
              className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-[#14332f] text-[#14332f] transition hover:bg-[#f7faf8] active:scale-95"
            >
              <ShoppingCart className="h-6 w-6" aria-hidden />
              {cartCount > 0 && (
                <span
                  key={bump}
                  className="absolute -right-2 -top-2 grid h-6 min-w-6 animate-[cart-pop_.45s_ease-out] place-items-center rounded-full bg-[#c24f2f] px-1.5 text-xs font-black text-white"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <div className="min-w-0 flex-1 leading-tight text-[#14332f]">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#60746f]">
                {pending > 0 ? "Escolhendo agora" : "Seu carrinho"}
              </p>
              <p className="truncate whitespace-nowrap text-sm font-black sm:text-base">
                {pending > 0 ? (
                  <>
                    {pendingDishes > 0 && (
                      <>
                        <span className="text-lg text-[#b85b36]">{pendingDishes}</span> × {size ? sizeLabel(size) : "?"}
                      </>
                    )}
                    {pendingDishes > 0 && pendingSnacks > 0 && " + "}
                    {pendingSnacks > 0 && (
                      <>
                        <span className="text-lg text-[#b85b36]">{pendingSnacks}</span> pct
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-lg text-[#b85b36]">{cartDishes}</span>{" "}
                    {cartDishes === 1 ? "marmita" : "marmitas"}
                    {cartPacks > 0 && ` + ${cartPacks} pct`}
                  </>
                )}
              </p>
            </div>
            {pending > 0 ? (
              <button
                type="button"
                onClick={addToCart}
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#c24f2f] px-4 text-sm font-black uppercase text-white shadow-lg shadow-[#c24f2f]/25 transition hover:bg-[#a94329] active:scale-95 sm:px-7 sm:text-base"
              >
                <Plus className="h-4 w-4" aria-hidden />
                <span>
                  Colocar<span className="hidden sm:inline"> no carrinho</span>
                </span>
              </button>
            ) : (
              <button
                type="button"
                disabled={cartCount === 0}
                onClick={() => scrollTo(checkoutRef.current)}
                className="h-12 shrink-0 rounded-xl bg-[#c24f2f] px-4 text-sm font-black uppercase text-white shadow-lg shadow-[#c24f2f]/25 transition hover:bg-[#a94329] active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:px-7 sm:text-base"
              >
                {cartCount === 0 ? "Escolha os itens" : "Finalizar"}
              </button>
            )}
          </div>
        </section>

        <CartSection
          ref={cartRef}
          cart={cart}
          onUpdate={updateLine}
          onRemove={removeLine}
          onClear={() => setCart([])}
        />

        <section ref={checkoutRef} className="mt-5 scroll-mt-4 rounded-2xl border-2 border-[#14332f] bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-lg font-black uppercase text-[#14332f]">
            <User className="h-5 w-5" aria-hidden />
            Último passo: enviar pedido
          </div>
          <div className="mb-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold leading-snug text-emerald-900">
            <MessageCircle className="h-6 w-6 shrink-0" aria-hidden />
            <p>
              Preencha seus dados e toque no botão abaixo. Não precisa tirar print: o carrinho inteiro abre pronto no
              WhatsApp.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">Nome completo</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                autoComplete="name"
                className="h-10 w-full rounded-md border border-[#d8cbbd] bg-white px-3 text-base md:text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Telefone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                inputMode="tel"
                autoComplete="tel"
                placeholder="(43) 99999-9999"
                className="h-10 w-full rounded-md border border-[#d8cbbd] bg-white px-3 text-base md:text-sm"
              />
            </label>
          </div>

          {cartCount > 0 && (
            <details className="group mt-4 rounded-xl border border-[#e3d8c8] bg-[#fffdf8] p-3 text-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-[#14332f]">
                Ver a mensagem que será enviada
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden />
              </summary>
              <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-[#253f3a]">
                {buildWhatsAppMessage(cart, name || "(seu nome)", phone || "(seu telefone)")}
              </pre>
            </details>
          )}

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              disabled={!canSend}
              onClick={sendOrder}
              className="inline-flex h-14 w-full max-w-xl items-center justify-center gap-3 rounded-xl bg-[#c24f2f] px-8 text-base font-black uppercase tracking-wide text-white shadow-lg shadow-[#c24f2f]/25 transition hover:bg-[#a94329] active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:text-xl"
            >
              <Send className="h-5 w-5" aria-hidden />
              Abrir WhatsApp e enviar pedido
            </button>
          </div>
          {!canSend && (
            <p className="mt-2 text-center text-xs font-bold text-[#b85b36]">
              {cartCount === 0
                ? "Coloque ao menos uma marmita no carrinho."
                : "Preencha nome e telefone para enviar."}
            </p>
          )}
          <p className="mt-4 text-center text-xs font-medium text-[#60746f]">
            Seus dados estão seguros e seu pedido será enviado para nossa equipe pelo WhatsApp.
          </p>
        </section>
      </div>

      {howOpen && <HowItWorks onClose={() => setHowOpen(false)} />}
    </main>
  );
}

function Step({ n, icon, children }: { n: number; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#f7faf8] p-3 text-[#14332f]">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#14332f] text-sm font-black text-white">
        {n}
      </div>
      {icon}
      <p className="text-sm font-bold leading-snug">{children}</p>
    </div>
  );
}

function Stepper({
  value,
  label,
  disabled,
  onChange,
}: {
  value: number;
  label: string;
  disabled?: boolean;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="grid grid-cols-[38px_38px_38px] justify-end overflow-hidden rounded-lg border bg-white">
      <output className="grid place-items-center text-sm font-black tabular-nums text-[#14332f]" aria-label={label}>
        {value}
      </output>
      <button
        type="button"
        aria-label={`Remover ${label}`}
        disabled={disabled || value === 0}
        onClick={() => onChange(-1)}
        className="grid h-10 place-items-center border-l text-[#14332f] transition hover:bg-[#f6e4d8] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-label={`Adicionar ${label}`}
        disabled={disabled}
        onClick={() => onChange(1)}
        className="grid h-10 place-items-center border-l text-[#14332f] transition hover:bg-[#dceee5] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function SnackCard({ picks, onChange }: { picks: Picks; onChange: (id: string, delta: number) => void }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#003b2d] bg-white shadow-sm lg:col-span-2 xl:col-span-1">
      <div className="flex items-center gap-4 bg-[#003b2d] px-4 py-4 text-white">
        <ShoppingBasket className="h-9 w-9 shrink-0 text-[#ff952e]" aria-hidden />
        <div>
          <h2 className="text-xl font-black uppercase leading-tight">Black da Fit Garden</h2>
          <p className="mt-1 inline-block rounded-full bg-[#b94305] px-3 py-1 text-sm font-bold">Descontos nos pacotes</p>
        </div>
      </div>
      <div className="divide-y px-3 sm:px-4">
        {SNACKS.map((snack, i) => (
          <div key={snack.id} className="flex flex-wrap items-center gap-2 py-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-100 font-black text-orange-900">
              {i + 1}
            </span>
            <div className="min-w-[9rem] flex-1 text-[#14332f]">
              <p className="text-sm font-black uppercase">{snack.name}</p>
              <p className="text-xs font-bold">{snack.detail}</p>
              {snack.description && <p className="mt-1 text-xs">{snack.description}</p>}
            </div>
            <div className="ml-auto">
              <Stepper
                value={picks[snack.id] ?? 0}
                label={`pacote de ${snack.name}`}
                onChange={(d) => onChange(snack.id, d)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="m-3 space-y-2 rounded-xl bg-[#fff0d9] p-3 text-sm text-[#14332f]">
        {SNACK_OFFERS.map((o) => (
          <p key={o.label}>
            <strong>{o.label}</strong> · de <del>{o.from}</del> por <strong className="text-red-800">{o.to}</strong>
          </p>
        ))}
        <p className="text-xs">Cada pacote vem com 4 salgados. Combine os sabores como preferir.</p>
      </div>
    </div>
  );
}

function DishCard({
  section,
  picks,
  disabled,
  onChange,
}: {
  section: DishSection;
  picks: Picks;
  disabled: boolean;
  onChange: (id: string, delta: number) => void;
}) {
  const tone = TONES[section.tone];
  const Icon = SECTION_ICONS[section.icon];
  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${tone.card}`}>
      <div className={`flex items-center gap-3 border-b px-4 py-3 ${tone.head}`}>
        <Icon className={`h-6 w-6 ${tone.title}`} aria-hidden />
        <h2 className={`text-lg font-black uppercase tracking-tight ${tone.title}`}>{section.title}</h2>
      </div>
      <div className="divide-y">
        {section.dishes.map((dish, i) => {
          const qty = picks[dish.id] ?? 0;
          return (
            <div
              key={dish.id}
              className={`grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 transition sm:px-4 ${
                qty ? "bg-[#fdf3ec]" : ""
              }`}
            >
              <span className="grid h-7 place-items-center rounded-lg bg-[#f6e4d8] text-xs font-black text-[#b85b36]">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug text-[#253f3a]">{dish.name}</p>
                {dish.description && (
                  <p className="mt-1 text-xs font-medium leading-snug text-[#60746f]">{dish.description}</p>
                )}
              </div>
              <Stepper value={qty} label={dish.name} disabled={disabled} onChange={(d) => onChange(dish.id, d)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CartSection({
  ref,
  cart,
  onUpdate,
  onRemove,
  onClear,
}: {
  ref: React.Ref<HTMLElement>;
  cart: CartLine[];
  onUpdate: (line: CartLine, delta: number) => void;
  onRemove: (line: CartLine) => void;
  onClear: () => void;
}) {
  const groups = groupBySize(cart);
  const snacks = cart.filter((l) => l.kind === "snack");
  const dishes = countDishes(cart);
  const packs = countSnackPacks(cart);

  return (
    <section ref={ref} className="mt-5 scroll-mt-4 rounded-2xl border-2 border-[#14332f] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-black uppercase text-[#14332f]">
          <ShoppingCart className="h-5 w-5" aria-hidden />
          Seu carrinho
        </h2>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-bold text-[#b85b36] underline-offset-2 hover:underline"
          >
            Esvaziar
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl bg-[#f7faf8] p-4 text-sm font-bold text-[#47625d]">
          <ClipboardList className="h-6 w-6 shrink-0" aria-hidden />
          Seu carrinho está vazio. Escolha o tamanho, as marmitas e toque em “Colocar no carrinho”.
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            const total = group.lines.reduce((s, l) => s + l.qty, 0);
            return (
              <div key={`${group.size}:${group.note ?? ""}`} className="overflow-hidden rounded-xl border border-[#e3d8c8]">
                <div className="flex items-center justify-between bg-[#14332f] px-3 py-2 text-white">
                  <span className="text-sm font-black uppercase">{sizeLabel(group.size)}</span>
                  <span className="text-xs font-bold">{plural(total, "marmita", "marmitas")}</span>
                </div>
                {group.note && (
                  <p className="border-b border-[#e3d8c8] bg-[#fffdf8] px-3 py-1.5 text-xs italic text-[#47625d]">
                    {group.note}
                  </p>
                )}
                <ul className="divide-y">
                  {group.lines.map((line) => (
                    <CartRow
                      key={lineKey(line)}
                      name={findDish(line.id)?.name ?? line.id}
                      line={line}
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ))}
                </ul>
              </div>
            );
          })}

          {snacks.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-[#e3d8c8]">
              <div className="flex items-center justify-between bg-[#003b2d] px-3 py-2 text-white">
                <span className="text-sm font-black uppercase">Salgados</span>
                <span className="text-xs font-bold">
                  {plural(packs, "pacote", "pacotes")} · {packs * 4} un.
                </span>
              </div>
              <ul className="divide-y">
                {snacks.map((line) => (
                  <CartRow
                    key={lineKey(line)}
                    name={findSnack(line.id)?.name ?? line.id}
                    line={line}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                  />
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-[#fff0d9] px-3 py-2.5 text-[#14332f]">
            <span className="text-sm font-bold uppercase">Total</span>
            <span className="text-base font-black">
              {plural(dishes, "marmita", "marmitas")}
              {packs > 0 && ` + ${plural(packs, "pacote", "pacotes")} de salgados`}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

function CartRow({
  name,
  line,
  onUpdate,
  onRemove,
}: {
  name: string;
  line: CartLine;
  onUpdate: (line: CartLine, delta: number) => void;
  onRemove: (line: CartLine) => void;
}) {
  return (
    <li className="flex items-center gap-2 px-3 py-2">
      <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-[#253f3a]">{name}</p>
      <div className="flex items-center overflow-hidden rounded-lg border">
        <button
          type="button"
          aria-label={`Tirar um: ${name}`}
          onClick={() => onUpdate(line, -1)}
          className="grid h-9 w-9 place-items-center text-[#14332f] hover:bg-[#f6e4d8]"
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
        <span className="min-w-7 text-center text-sm font-black tabular-nums">{line.qty}</span>
        <button
          type="button"
          aria-label={`Mais um: ${name}`}
          onClick={() => onUpdate(line, 1)}
          className="grid h-9 w-9 place-items-center text-[#14332f] hover:bg-[#dceee5]"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <button
        type="button"
        aria-label={`Remover do carrinho: ${name}`}
        onClick={() => onRemove(line)}
        className="grid h-9 w-9 place-items-center rounded-lg text-[#b85b36] hover:bg-[#fdf3ec]"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </li>
  );
}

function HowItWorks({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-title"
      className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 text-[#14332f] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="how-title" className="text-lg font-black uppercase">
            Como funciona o pedido
          </h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[#f7faf8]">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          <li>Escolha o tamanho (200g, 300g, 400g, 500g ou personalizado).</li>
          <li>Use o <strong>+</strong> nas marmitas que quiser e toque em <strong>Colocar no carrinho</strong>.</li>
          <li>Quer marmitas de outro tamanho? Troque o tamanho e repita. Tudo fica junto no carrinho.</li>
          <li>No carrinho dá para aumentar, diminuir ou remover qualquer item.</li>
          <li>Digite nome e telefone e toque em <strong>Abrir WhatsApp</strong>: o pedido vai pronto.</li>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-11 w-full rounded-xl bg-[#14332f] text-sm font-black uppercase text-white"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
