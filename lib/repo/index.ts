import { createLocalRepo } from "./local";
import { createOnlineRepo } from "./online";
import type { Repo } from "./types";

let instance: Repo | null = null;

/**
 * Escolhe o fichário: se o endereço e a chave do Supabase estiverem configurados, usa o online;
 * senão usa o de demonstração (rascunho no navegador). Só chame no navegador.
 */
export function getRepo(): Repo {
  if (!instance) {
    // Precisam ser escritos exatamente assim para o Next.js "embutir" os valores no build.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // O Supabase chama esta chave pública de "publishable" (nome novo) ou "anon" (nome antigo).
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    instance = url && key ? createOnlineRepo(url, key) : createLocalRepo();
  }
  return instance;
}

export { DEMO_EMAIL, DEMO_PASSWORD } from "./local";
export * from "./types";
