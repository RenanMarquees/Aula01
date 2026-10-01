import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { newId } from "../menu-helpers";
import type { Category, DeliveryZone, MenuData, MenuItem, OptionGroup, Settings } from "../types";
import { iconNames, type IconName } from "../types";
import { RepoError, type PhotoKind, type Repo } from "./types";

// Fichário online (Supabase). As tabelas e as regras de acesso estão em supabase/schema.sql.

const BUCKET = "fotos";

type SettingsRow = {
  name: string;
  tagline: string;
  whatsapp: string;
  is_open: boolean;
  logo_url: string | null;
  cover_url: string | null;
};
type CategoryRow = { id: string; name: string; icon: string; position: number };
type ItemRow = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price_cents: number;
  icon: string;
  photo_url: string | null;
  available: boolean;
  position: number;
  option_groups: OptionGroup[] | null;
};
type ZoneRow = { id: string; name: string; fee_cents: number; position: number };

const asIcon = (value: string): IconName =>
  (iconNames as readonly string[]).includes(value) ? (value as IconName) : "utensils";

/** Traduz erros técnicos em frases que o dono entende. */
function friendly(error: { message?: string; code?: string; status?: number } | null, fallback: string): RepoError {
  const message = (error?.message ?? "").toLowerCase();
  if (message.includes("invalid login credentials")) return new RepoError("E-mail ou senha incorretos.");
  if (message.includes("failed to fetch") || message.includes("networkerror") || message.includes("load failed")) {
    return new RepoError("Sem conexão com a internet. Confira o Wi-Fi ou o 4G e tente de novo.");
  }
  if (error?.code === "42501" || message.includes("row-level security") || message.includes("permission")) {
    return new RepoError("Você não tem permissão para alterar o cardápio. Entre de novo com o e-mail do dono.");
  }
  if (error?.code === "23503") {
    return new RepoError("Este item ainda está em uso. Remova o que depende dele primeiro.");
  }
  return new RepoError(fallback);
}

function must<T>(result: { data: T | null; error: { message?: string; code?: string } | null }, fallback: string): T {
  if (result.error || result.data === null) throw friendly(result.error, fallback);
  return result.data;
}

function check(result: { error: { message?: string; code?: string } | null }, fallback: string) {
  if (result.error) throw friendly(result.error, fallback);
}

export function createOnlineRepo(url: string, anonKey: string): Repo {
  const client: SupabaseClient = createClient(url, anonKey);

  return {
    mode: "online",

    async load(): Promise<MenuData> {
      const [settings, categories, items, zones] = await Promise.all([
        client.from("settings").select("*").eq("id", 1).maybeSingle(),
        client.from("categories").select("*").order("position"),
        client.from("items").select("*").order("position"),
        client.from("delivery_zones").select("*").order("position"),
      ]);
      if (settings.error) throw friendly(settings.error, "Não foi possível carregar o cardápio.");
      const s = settings.data as SettingsRow | null;
      const categoryRows = must<CategoryRow[]>(categories, "Não foi possível carregar o cardápio.");
      const itemRows = must<ItemRow[]>(items, "Não foi possível carregar o cardápio.");
      const zoneRows = must<ZoneRow[]>(zones, "Não foi possível carregar o cardápio.");

      return {
        settings: {
          name: s?.name ?? "Meu restaurante",
          tagline: s?.tagline ?? "",
          whatsapp: s?.whatsapp ?? "",
          open: s?.is_open ?? true,
          logoUrl: s?.logo_url ?? null,
          coverUrl: s?.cover_url ?? null,
        },
        categories: categoryRows.map((row) => ({
          id: row.id,
          name: row.name,
          icon: asIcon(row.icon),
          position: row.position,
        })),
        items: itemRows.map((row) => ({
          id: row.id,
          categoryId: row.category_id,
          name: row.name,
          description: row.description,
          price: row.price_cents,
          icon: asIcon(row.icon),
          photoUrl: row.photo_url,
          available: row.available,
          position: row.position,
          optionGroups: Array.isArray(row.option_groups) ? row.option_groups : [],
        })),
        zones: zoneRows.map((row) => ({
          id: row.id,
          name: row.name,
          fee: row.fee_cents,
          position: row.position,
        })),
      };
    },

    async getSession() {
      const { data } = await client.auth.getSession();
      const email = data.session?.user.email;
      return email ? { email } : null;
    },

    async signIn(email, password) {
      const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw friendly(error, "Não foi possível entrar. Tente de novo.");
    },

    async signOut() {
      await client.auth.signOut();
    },

    async saveSettings(patch: Partial<Settings>) {
      const row: Partial<SettingsRow> = {};
      if (patch.name !== undefined) row.name = patch.name;
      if (patch.tagline !== undefined) row.tagline = patch.tagline;
      if (patch.whatsapp !== undefined) row.whatsapp = patch.whatsapp;
      if (patch.open !== undefined) row.is_open = patch.open;
      if (patch.logoUrl !== undefined) row.logo_url = patch.logoUrl;
      if (patch.coverUrl !== undefined) row.cover_url = patch.coverUrl;
      // upsert: funciona mesmo se a linha única de ajustes ainda não existir.
      const result = await client.from("settings").upsert({ id: 1, ...row });
      check(result, "Não foi possível salvar os ajustes.");
    },

    async saveCategory(category: Category) {
      const result = await client.from("categories").upsert({
        id: category.id,
        name: category.name,
        icon: category.icon,
        position: category.position,
      });
      check(result, "Não foi possível salvar a categoria.");
    },

    async deleteCategory(id) {
      const result = await client.from("categories").delete().eq("id", id);
      if (result.error?.code === "23503") {
        throw new RepoError("Esta categoria ainda tem pratos. Mude ou exclua os pratos primeiro.");
      }
      check(result, "Não foi possível excluir a categoria.");
    },

    async saveItem(item: MenuItem) {
      const result = await client.from("items").upsert({
        id: item.id,
        category_id: item.categoryId,
        name: item.name,
        description: item.description,
        price_cents: item.price,
        icon: item.icon,
        photo_url: item.photoUrl,
        available: item.available,
        position: item.position,
        option_groups: item.optionGroups,
      });
      check(result, "Não foi possível salvar o prato.");
    },

    async deleteItem(id) {
      const result = await client.from("items").delete().eq("id", id);
      check(result, "Não foi possível excluir o prato.");
    },

    async saveZone(zone: DeliveryZone) {
      const result = await client.from("delivery_zones").upsert({
        id: zone.id,
        name: zone.name,
        fee_cents: zone.fee,
        position: zone.position,
      });
      check(result, "Não foi possível salvar o bairro.");
    },

    async deleteZone(id) {
      const result = await client.from("delivery_zones").delete().eq("id", id);
      check(result, "Não foi possível excluir o bairro.");
    },

    async uploadPhoto(file: Blob, kind: PhotoKind) {
      const extension = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
      const path = `${kind}/${newId()}.${extension}`;
      const { error } = await client.storage.from(BUCKET).upload(path, file, {
        contentType: file.type || "image/jpeg",
        cacheControl: "31536000",
      });
      if (error) throw friendly(error, "Não foi possível enviar a foto.");
      return client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    },
  };
}
