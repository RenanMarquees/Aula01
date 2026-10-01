# Cardápio digital

Cardápio para restaurante: o cliente monta o pedido no celular e envia pelo WhatsApp.
O dono cuida de tudo (pratos, fotos, preços, bairros, QR Codes) por um painel no celular.

## Andamento

- [x] Etapa 1: cardápio navegável (capa, categorias na base da tela, lista de itens, carrinho fixo)
- [x] Etapa 2: detalhe do item (opções, observação, quantidade) e carrinho
- [x] Etapa 3: mesa/retirada/entrega, pagamento, prévia e envio pelo WhatsApp
- [x] Etapa 4: painel do dono (modo demonstração e fichário online)
- [ ] Etapa 5: publicação e testes no celular

## Como funciona

| Parte | O que faz |
| --- | --- |
| `/` | Cardápio do cliente (também `/?mesa=7` para o QR Code da mesa 7) |
| `/painel` | Painel do dono (login por e-mail e senha) |
| `lib/repo/` | O "fichário": `local.ts` (demonstração, no navegador) e `online.ts` (Supabase) |
| `supabase/schema.sql` | Tabelas, regras de acesso e espaço de fotos do fichário online |
| `supabase/seed.sql` | Cardápio de exemplo para começar |

### Modo demonstração

Sem as variáveis do Supabase, o app guarda tudo no navegador. Para entrar no painel:
e-mail `dono@exemplo.com`, senha `demo1234`.

### Fichário online (Supabase)

1. Crie um projeto no Supabase.
2. No *SQL Editor*, rode `supabase/schema.sql`, depois cadastre o e-mail do dono
   (`insert into public.owners (email) values ('dono@seuemail.com');`) e rode `supabase/seed.sql`.
3. Em *Authentication > Users*, crie o usuário do dono (marque *Auto Confirm User*).
4. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (na Vercel, cadastre os mesmos nomes).

Segurança: qualquer pessoa **lê** o cardápio; só o e-mail cadastrado em `owners` **altera** pratos, preços,
bairros, ajustes e fotos (regras `row level security` em `supabase/schema.sql`).

## Desenvolvimento

```
npm install
npm run dev      # servidor local
npm run lint
npm run build
```
