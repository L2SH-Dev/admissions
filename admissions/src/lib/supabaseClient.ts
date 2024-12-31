import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
if (!supabaseUrl)
  throw new Error("VITE_SUPABASE_URL environment variable is not set");

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
if (!supabaseKey)
  throw new Error("VITE_SUPABASE_ANON_KEY environment variable is not set");

export const supabase = createClient(supabaseUrl, supabaseKey);
