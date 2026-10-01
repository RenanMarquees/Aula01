import { createSampleMenu } from "../sample-menu";
import type { MenuData } from "../types";
import { RepoError, type Repo, type Session } from "./types";

// Modo demonstração: o "fichário" fica no próprio navegador (só aparece para quem mexeu).
const DATA_KEY = "cardapio:demo:v1";
const SESSION_KEY = "cardapio:demo-sessao:v1";

export const DEMO_EMAIL = "dono@exemplo.com";
export const DEMO_PASSWORD = "demo1234";

function readData(): MenuData {
  try {
    const saved = window.localStorage.getItem(DATA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as MenuData;
      if (parsed?.settings && Array.isArray(parsed.items) && Array.isArray(parsed.categories)) {
        return { ...parsed, zones: Array.isArray(parsed.zones) ? parsed.zones : [] };
      }
    }
  } catch {
    // Dados corrompidos: volta ao cardápio de exemplo.
  }
  const sample = createSampleMenu();
  writeData(sample);
  return sample;
}

function writeData(data: MenuData) {
  try {
    window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch {
    throw new RepoError(
      "Não foi possível guardar a alteração (o espaço do navegador está cheio). Tente uma foto menor.",
    );
  }
}

function update(change: (data: MenuData) => MenuData) {
  writeData(change(readData()));
}

function upsert<T extends { id: string }>(list: T[], entry: T): T[] {
  return list.some((current) => current.id === entry.id)
    ? list.map((current) => (current.id === entry.id ? entry : current))
    : [...list, entry];
}

export function createLocalRepo(): Repo {
  return {
    mode: "demo",

    async load() {
      return readData();
    },

    async getSession(): Promise<Session | null> {
      try {
        const email = window.localStorage.getItem(SESSION_KEY);
        return email ? { email } : null;
      } catch {
        return null;
      }
    },

    async signIn(email, password) {
      if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        throw new RepoError("E-mail ou senha incorretos.");
      }
      window.localStorage.setItem(SESSION_KEY, DEMO_EMAIL);
    },

    async signOut() {
      window.localStorage.removeItem(SESSION_KEY);
    },

    async saveSettings(patch) {
      update((data) => ({ ...data, settings: { ...data.settings, ...patch } }));
    },

    async saveCategory(category) {
      update((data) => ({ ...data, categories: upsert(data.categories, category) }));
    },

    async deleteCategory(id) {
      const data = readData();
      if (data.items.some((item) => item.categoryId === id)) {
        throw new RepoError("Esta categoria ainda tem pratos. Mude ou exclua os pratos primeiro.");
      }
      writeData({ ...data, categories: data.categories.filter((category) => category.id !== id) });
    },

    async saveItem(item) {
      update((data) => ({ ...data, items: upsert(data.items, item) }));
    },

    async deleteItem(id) {
      update((data) => ({ ...data, items: data.items.filter((item) => item.id !== id) }));
    },

    async saveZone(zone) {
      update((data) => ({ ...data, zones: upsert(data.zones, zone) }));
    },

    async deleteZone(id) {
      update((data) => ({ ...data, zones: data.zones.filter((zone) => zone.id !== id) }));
    },

    async uploadPhoto(file) {
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new RepoError("Não foi possível ler a foto."));
        reader.readAsDataURL(file);
      });
    },
  };
}
