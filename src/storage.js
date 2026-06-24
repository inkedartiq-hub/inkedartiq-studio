import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mimics the artifact's window.storage API (get/set/delete/list) so App.jsx
// barely has to change. Backed by a single table: app_storage(key text primary key, value text).
export const storage = {
  async get(key) {
    const { data, error } = await supabase.from("app_storage").select("value").eq("key", key).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return { key, value: data.value, shared: false };
  },
  async set(key, value) {
    const { error } = await supabase.from("app_storage").upsert({ key, value });
    if (error) throw error;
    return { key, value, shared: false };
  },
  async delete(key) {
    const { error } = await supabase.from("app_storage").delete().eq("key", key);
    if (error) throw error;
    return { key, deleted: true, shared: false };
  },
  async list(prefix = "") {
    const { data, error } = await supabase.from("app_storage").select("key").like("key", `${prefix}%`);
    if (error) throw error;
    return { keys: (data || []).map((r) => r.key), prefix, shared: false };
  },
};
