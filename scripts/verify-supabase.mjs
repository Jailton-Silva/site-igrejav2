/**
 * Verifica conexão com o Supabase usando variáveis do .env.local
 * Uso: node scripts/verify-supabase.mjs
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '.env.local');
  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

const env = loadEnvLocal();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes no .env.local');
  process.exit(1);
}

const tables = ['banners', 'verses', 'posts', 'site_settings', 'page_views'];

console.log('Verificando Supabase:', url);

let hasError = false;

for (const table of tables) {
  const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (res.ok) {
    console.log(`✅ ${table}`);
  } else {
    const body = await res.text();
    console.error(`❌ ${table} — HTTP ${res.status}: ${body.slice(0, 120)}`);
    hasError = true;
  }
}

process.exit(hasError ? 1 : 0);
