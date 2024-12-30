import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sb.gkogan.ru";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY ?? "";
if (!supabaseKey)
  throw new Error("SUPABASE_KEY environment variable is not set");

export const supabase = createClient(supabaseUrl, supabaseKey);
