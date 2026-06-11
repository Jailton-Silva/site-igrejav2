# Configuração do Supabase

## Instalação nova (recomendado)

Execute no [SQL Editor](https://supabase.com/dashboard) do Supabase:

1. **`supabase/schema.sql`** — schema consolidado (tabelas, RLS, índices, analytics, SEO, relações)
2. **`supabase/create_storage_buckets.sql`** — buckets de upload

Em seguida configure autenticação e storage (abaixo).

## Banco já existente (atualizar)

Se o projeto já foi criado com versões antigas do schema, rode **apenas** as migrações que ainda faltam, na ordem:

1. `supabase/migration_hero_autoplay.sql`
2. `supabase/migration_add_order_to_events.sql`
3. `supabase/migration_add_button_styles.sql`
4. `supabase/migration_create_post_relations.sql`
5. `supabase/migration_create_page_views.sql`
6. `supabase/migrations/add_seo_fields.sql`

Use `node scripts/verify-supabase.mjs` para ver o que falta.

## Autenticação (admin)

1. **Authentication → Providers** — habilite Email
2. **Authentication → Users** — crie o usuário admin
3. **Authentication → Settings** — desabilite "Enable sign ups" em produção

## Storage

Após `create_storage_buckets.sql`, confira em **Storage** se existem os buckets:
`banners`, `leaders`, `posts`, `gallery`, `testimonials`, `about`, `financials`, `page-banners`

## Verificar localmente

```bash
npm run verify:supabase
```

## Variáveis na Vercel

Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `REVALIDATION_SECRET` (opcional, para webhook de revalidação).
