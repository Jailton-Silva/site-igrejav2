# Configuração do Supabase

Execute os scripts SQL **nesta ordem** no [SQL Editor](https://supabase.com/dashboard/project/gnrdqnxttpmcqpszrwmw/sql) do Supabase:

1. `supabase/schema.sql` — tabelas base + RLS
2. `supabase/migration_banners.sql`
3. `supabase/migration_add_banner_buttons.sql`
4. `supabase/migration_add_button_styles.sql`
5. `supabase/migration_add_order_to_events.sql`
6. `supabase/migration_add_ensaio_event_type.sql`
7. `supabase/migration_add_department_to_leaders.sql`
8. `supabase/migration_add_posts_views.sql`
9. `supabase/migration_create_post_relations.sql`
10. `supabase/migration_create_page_banners.sql`
11. `supabase/migration_create_about_page_tables.sql`
12. `supabase/migration_add_about_church_content.sql`
13. `supabase/migration_create_page_views.sql`
14. `supabase/migrations/add_seo_fields.sql`
15. `supabase/migrations/add_performance_indexes.sql`
16. `supabase/create_storage_buckets.sql`

## Autenticação (admin)

1. **Authentication → Providers** — habilite Email
2. **Authentication → Users** — crie o usuário admin
3. **Authentication → Settings** — desabilite "Enable sign ups" em produção

## Storage

Após `create_storage_buckets.sql`, confira em **Storage** se existem os buckets:
`banners`, `leaders`, `posts`, `gallery`, `testimonials`, `about`, `financials`, `page-banners`

## Verificar localmente

```bash
node scripts/verify-supabase.mjs
```

## Variáveis na Vercel

Configure as mesmas variáveis do `.env.local`, com `NEXT_PUBLIC_SITE_URL` apontando para o domínio de produção.
