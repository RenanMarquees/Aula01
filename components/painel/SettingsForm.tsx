"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatWhatsapp, isValidWhatsapp, normalizeWhatsapp, runAction } from "@/lib/panel";
import { getRepo, type Session } from "@/lib/repo";
import type { MenuData } from "@/lib/types";
import { Icon } from "../Icon";
import { Card, Field, ImageField, inputClass, primaryButton, secondaryButton } from "./ui";

type Errors = { name?: string; whatsapp?: string };

export function SettingsForm({ menu, session }: { menu: MenuData; session: Session }) {
  const router = useRouter();
  const { settings } = menu;
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [whatsapp, setWhatsapp] = useState(formatWhatsapp(settings.whatsapp) || settings.whatsapp);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [coverUrl, setCoverUrl] = useState(settings.coverUrl);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const normalized = normalizeWhatsapp(whatsapp);

  async function handleSave() {
    const next: Errors = {};
    if (!name.trim()) next.name = "Escreva o nome do restaurante";
    if (!isValidWhatsapp(whatsapp)) next.whatsapp = "Informe o número com DDD, por exemplo (43) 99999-9999";
    setErrors(next);
    if (next.name || next.whatsapp) return;

    setSaving(true);
    await runAction(
      () =>
        getRepo().saveSettings({
          name: name.trim(),
          tagline: tagline.trim(),
          whatsapp: normalized,
          logoUrl,
          coverUrl,
        }),
      "Ajustes salvos",
    );
    setSaving(false);
  }

  async function handleSignOut() {
    await getRepo().signOut();
    router.replace("/painel/entrar");
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <h2 className="font-display text-[19px] font-normal tracking-tight">Seu restaurante</h2>
        <Field label="Nome do restaurante" htmlFor="ajuste-nome" error={errors.name}>
          <input
            id="ajuste-nome"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            maxLength={50}
            aria-invalid={Boolean(errors.name)}
            className={`${inputClass} ${errors.name ? "border-danger" : ""}`}
          />
        </Field>
        <Field label="Frase de apresentação" htmlFor="ajuste-frase" hint="Aparece abaixo do nome, na capa do cardápio.">
          <input
            id="ajuste-frase"
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            maxLength={80}
            className={inputClass}
          />
        </Field>
        <ImageField
          label="Logo"
          value={logoUrl}
          kind="brand"
          maxSize={400}
          shape="round"
          onChange={setLogoUrl}
          fallback={<Icon name="utensils" size={28} />}
        />
        <ImageField
          label="Foto de capa"
          value={coverUrl}
          kind="brand"
          maxSize={1400}
          shape="wide"
          onChange={setCoverUrl}
          fallback={<Icon name="utensils" size={32} />}
        />
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-[19px] font-normal tracking-tight">Pedidos pelo WhatsApp</h2>
        <Field
          label="Número do WhatsApp que recebe os pedidos"
          htmlFor="ajuste-whatsapp"
          error={errors.whatsapp}
          hint={
            isValidWhatsapp(whatsapp)
              ? `Os pedidos chegam em ${formatWhatsapp(normalized) || `+${normalized}`}`
              : "Com DDD. Ex.: (43) 99999-9999"
          }
        >
          <input
            id="ajuste-whatsapp"
            value={whatsapp}
            onChange={(event) => {
              setWhatsapp(event.target.value);
              setErrors((current) => ({ ...current, whatsapp: undefined }));
            }}
            inputMode="tel"
            autoComplete="off"
            aria-invalid={Boolean(errors.whatsapp)}
            className={`${inputClass} ${errors.whatsapp ? "border-danger" : ""}`}
          />
        </Field>
      </Card>

      <button type="button" onClick={handleSave} disabled={saving} className={`${primaryButton} w-full`}>
        {saving ? "Salvando…" : "Salvar ajustes"}
      </button>

      <Card className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] text-muted">Você entrou como</p>
          <p className="truncate text-[14px] font-medium">{session.email}</p>
        </div>
        <button type="button" onClick={handleSignOut} className={secondaryButton}>
          <LogOut size={16} strokeWidth={1.6} aria-hidden />
          Sair
        </button>
      </Card>
    </div>
  );
}
