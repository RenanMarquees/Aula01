-- ============================================================================
-- Cardápio de exemplo (gerado a partir de lib/sample-menu.ts).
-- Cole no "SQL Editor" do Supabase depois do schema.sql. Não sobrescreve nada que já exista.
-- ============================================================================

insert into public.settings (id, name, tagline, whatsapp, is_open, logo_url, cover_url)
values (1, 'Restaurante Exemplo', 'Monte seu pedido e envie pelo WhatsApp', '5543999288173', true, null, null)
on conflict (id) do nothing;

insert into public.categories (id, name, icon, position) values
  ('entradas', 'Entradas', 'salad', 0),
  ('pratos', 'Pratos', 'utensils', 1),
  ('bebidas', 'Bebidas', 'cup-soda', 2),
  ('sobremesas', 'Sobremesas', 'cake-slice', 3)
on conflict (id) do nothing;

insert into public.delivery_zones (id, name, fee_cents, position) values
  ('centro', 'Centro', 500, 0),
  ('jardim-america', 'Jardim América', 700, 1),
  ('vila-nova', 'Vila Nova', 800, 2),
  ('bela-vista', 'Bela Vista', 1000, 3)
on conflict (id) do nothing;

insert into public.items (id, category_id, name, description, price_cents, icon, photo_url, available, position, option_groups) values
  ('bruschetta', 'entradas', 'Bruschetta de tomate', 'Pão italiano tostado, tomate fresco, manjericão e azeite.', 2200, 'sandwich', null, true, 0, '[]'::jsonb),
  ('bolinho-bacalhau', 'entradas', 'Bolinho de bacalhau', '6 unidades crocantes, acompanham molho de limão.', 3200, 'fish', null, true, 1, '[]'::jsonb),
  ('batata-rustica', 'entradas', 'Batata rústica', 'Porção grande, temperada com alecrim e sal grosso.', 2800, 'wheat', null, true, 2, '[{"id":"adicionais","title":"Adicionais","required":false,"type":"multiple","choices":[{"id":"cheddar","name":"Cheddar e bacon","price":800},{"id":"maionese","name":"Maionese da casa","price":300}]}]'::jsonb),
  ('hamburguer-classico', 'pratos', 'Hambúrguer clássico', 'Blend 180 g, queijo, alface, tomate e molho especial no pão brioche.', 3800, 'hamburger', null, true, 3, '[{"id":"ponto","title":"Ponto da carne","required":true,"type":"single","choices":[{"id":"mal","name":"Mal passado","price":0},{"id":"ao-ponto","name":"Ao ponto","price":0},{"id":"bem","name":"Bem passado","price":0}]},{"id":"adicionais","title":"Adicionais","required":false,"type":"multiple","choices":[{"id":"bacon","name":"Bacon","price":500},{"id":"ovo","name":"Ovo","price":300},{"id":"queijo-extra","name":"Queijo extra","price":400}]}]'::jsonb),
  ('risoto-cogumelos', 'pratos', 'Risoto de cogumelos', 'Arroz arbóreo cremoso com mix de cogumelos e parmesão.', 4600, 'soup', null, true, 4, '[{"id":"tamanho","title":"Tamanho","required":true,"type":"single","choices":[{"id":"individual","name":"Individual","price":0},{"id":"para-dois","name":"Para dividir (2 pessoas)","price":3800}]}]'::jsonb),
  ('file-parmegiana', 'pratos', 'Filé à parmegiana', 'Filé empanado com molho de tomate e queijo gratinado, arroz e batata frita.', 5200, 'beef', null, true, 5, '[]'::jsonb),
  ('salada-caesar', 'pratos', 'Salada Caesar com frango', 'Alface americana, frango grelhado, croutons e molho Caesar.', 3600, 'salad', null, true, 6, '[]'::jsonb),
  ('suco-laranja', 'bebidas', 'Suco de laranja', 'Natural, espremido na hora. 400 ml.', 800, 'citrus', null, true, 7, '[]'::jsonb),
  ('refrigerante', 'bebidas', 'Refrigerante lata', 'Cola, guaraná ou limão. 350 ml.', 600, 'cup-soda', null, true, 8, '[]'::jsonb),
  ('agua', 'bebidas', 'Água mineral', 'Com ou sem gás. 500 ml.', 400, 'glass-water', null, true, 9, '[]'::jsonb),
  ('cerveja', 'bebidas', 'Cerveja long neck', 'Bem gelada. 355 ml.', 1200, 'beer', null, true, 10, '[]'::jsonb),
  ('petit-gateau', 'sobremesas', 'Petit gâteau', 'Bolinho de chocolate com centro cremoso e sorvete de creme.', 2600, 'cookie', null, true, 11, '[{"id":"cobertura","title":"Cobertura","required":false,"type":"multiple","choices":[{"id":"calda-frutas","name":"Calda de frutas vermelhas","price":300}]}]'::jsonb),
  ('pudim', 'sobremesas', 'Pudim de leite', 'Receita da casa, com calda de caramelo.', 1600, 'dessert', null, true, 12, '[]'::jsonb),
  ('brownie', 'sobremesas', 'Brownie com sorvete', 'Brownie de chocolate meio amargo com bola de sorvete de baunilha.', 2200, 'ice-cream-bowl', null, false, 13, '[]'::jsonb)
on conflict (id) do nothing;
