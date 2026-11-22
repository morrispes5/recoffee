import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { readSupabaseEnv } from './env';

let client: SupabaseClient<Database> | undefined;

export function getSupabase(): SupabaseClient<Database> {
  if (!client) {
    const { url, key } = readSupabaseEnv();
    client = createClient<Database>(url, key, { auth: { flowType: 'pkce' } });
  }
  return client;
}
