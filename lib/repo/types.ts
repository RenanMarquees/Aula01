import type { Category, DeliveryZone, MenuData, MenuItem, Settings } from "../types";

export type Session = { email: string };

export type PhotoKind = "item" | "brand";

/**
 * O "fichário": tudo o que o cardápio e o painel leem e gravam.
 * Há duas versões: a de demonstração (guarda no navegador) e a online (Supabase).
 */
export interface Repo {
  /** "demo" = fichário de rascunho no navegador; "online" = fichário de verdade. */
  mode: "demo" | "online";

  load(): Promise<MenuData>;

  getSession(): Promise<Session | null>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;

  saveSettings(patch: Partial<Settings>): Promise<void>;
  saveCategory(category: Category): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  saveItem(item: MenuItem): Promise<void>;
  deleteItem(id: string): Promise<void>;
  saveZone(zone: DeliveryZone): Promise<void>;
  deleteZone(id: string): Promise<void>;

  /** Envia uma foto (já reduzida) e devolve o endereço público dela. */
  uploadPhoto(file: Blob, kind: PhotoKind): Promise<string>;
}

/** Erro com mensagem pronta para mostrar ao dono, em português simples. */
export class RepoError extends Error {}
