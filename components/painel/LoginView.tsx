"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { DEMO_EMAIL, DEMO_PASSWORD, getRepo, RepoError } from "@/lib/repo";
import { Field, inputClass, primaryButton, useDemoMode } from "./ui";

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const demo = useDemoMode();

  // Quem já entrou vai direto para o painel.
  useEffect(() => {
    let cancelled = false;
    getRepo()
      .getSession()
      .then((session) => {
        if (session && !cancelled) router.replace("/painel");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await getRepo().signIn(email, password);
      router.replace("/painel");
    } catch (caught) {
      setError(caught instanceof RepoError ? caught.message : "Não foi possível entrar. Tente de novo.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center bg-paper px-6 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-accent ring-1 ring-line">
          <Lock size={26} strokeWidth={1.4} aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-[28px] font-normal tracking-tight">Painel do restaurante</h1>
        <p className="mt-1 text-[13.5px] text-muted">Entre para cuidar do seu cardápio.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="E-mail" htmlFor="login-email">
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            required
            className={inputClass}
          />
        </Field>
        <Field label="Senha" htmlFor="login-senha" error={error ?? undefined}>
          <input
            id="login-senha"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </Field>
        <button type="submit" disabled={busy || !email || !password} className={`${primaryButton} w-full`}>
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>

      {demo && (
        <div className="mt-6 rounded-xl bg-tile p-4 text-[12.5px] leading-relaxed text-muted">
          <p className="font-semibold text-ink">Modo demonstração</p>
          <p className="mt-1">
            Para testar, use o e-mail <strong className="text-ink">{DEMO_EMAIL}</strong> e a senha{" "}
            <strong className="text-ink">{DEMO_PASSWORD}</strong>.
          </p>
        </div>
      )}

      <Link href="/" className="mt-8 flex min-h-11 items-center justify-center text-[13.5px] font-medium text-accent">
        Voltar ao cardápio
      </Link>
    </div>
  );
}
