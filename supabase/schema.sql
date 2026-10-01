-- ============================================================================
-- Cardápio digital: tabelas, regras de acesso e espaço para fotos.
-- Cole este arquivo inteiro no "SQL Editor" do Supabase e clique em "Run".
-- Pode ser executado de novo sem problema (não apaga nada).
-- ============================================================================

-- ---------- Tabelas (as "fichas" do fichário) ----------

create table if not exists public.settings (
  id        int primary key default 1 check (id = 1),   -- só existe uma linha de ajustes
  name      text not null default 'Meu restaurante',
  tagline   text not null default '',
  whatsapp  text not null default '',
  is_open   boolean not null default true,
  logo_url  text,
  cover_url text
);

create table if not exists public.categories (
  id       text primary key,
  name     text not null,
  icon     text not null default 'utensils',
  position int  not null default 0
);

create table if not exists public.items (
  id            text primary key,
  category_id   text not null references public.categories (id) on delete restrict,
  name          text not null,
  description   text not null default '',
  price_cents   int  not null check (price_cents >= 0),
  icon          text not null default 'utensils',
  photo_url     text,
  available     boolean not null default true,
  position      int  not null default 0,
  option_groups jsonb not null default '[]'::jsonb
);

create table if not exists public.delivery_zones (
  id        text primary key,
  name      text not null,
  fee_cents int  not null check (fee_cents >= 0),
  position  int  not null default 0
);

-- Lista de e-mails que podem alterar o cardápio (o "porteiro").
create table if not exists public.owners (
  email text primary key
);

-- ---------- Quem é o dono? ----------

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.owners
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to anon, authenticated;

-- ---------- Regras de acesso ----------
-- Qualquer pessoa pode LER o cardápio; só o dono pode ALTERAR.

alter table public.settings       enable row level security;
alter table public.categories     enable row level security;
alter table public.items          enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.owners         enable row level security;  -- sem regras: ninguém lê direto

drop policy if exists "leitura publica" on public.settings;
drop policy if exists "dono altera"     on public.settings;
create policy "leitura publica" on public.settings for select using (true);
create policy "dono altera"     on public.settings for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

drop policy if exists "leitura publica" on public.categories;
drop policy if exists "dono altera"     on public.categories;
create policy "leitura publica" on public.categories for select using (true);
create policy "dono altera"     on public.categories for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

drop policy if exists "leitura publica" on public.items;
drop policy if exists "dono altera"     on public.items;
create policy "leitura publica" on public.items for select using (true);
create policy "dono altera"     on public.items for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

drop policy if exists "leitura publica" on public.delivery_zones;
drop policy if exists "dono altera"     on public.delivery_zones;
create policy "leitura publica" on public.delivery_zones for select using (true);
create policy "dono altera"     on public.delivery_zones for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- ---------- Fotos ----------
-- Espaço público para leitura (qualquer cliente vê as fotos); só o dono envia e apaga.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "fotos leitura publica" on storage.objects;
drop policy if exists "dono envia fotos"      on storage.objects;
drop policy if exists "dono troca fotos"      on storage.objects;
drop policy if exists "dono apaga fotos"      on storage.objects;

create policy "fotos leitura publica" on storage.objects for select
  using (bucket_id = 'fotos');
create policy "dono envia fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and public.is_owner());
create policy "dono troca fotos" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and public.is_owner())
  with check (bucket_id = 'fotos' and public.is_owner());
create policy "dono apaga fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and public.is_owner());
