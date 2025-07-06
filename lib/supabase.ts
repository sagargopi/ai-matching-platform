import { createClient } from "@supabase/supabase-js"

/**
 * Real keys must be provided through NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY.
 * If the placeholders are still present we switch to “mock” mode so the app
 * keeps working in the preview.
 */
const PLACEHOLDER_URL = "https://your-project.supabase.co"
const PLACEHOLDER_KEY = "your-anon-key"

export const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes(PLACEHOLDER_URL) &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.includes(PLACEHOLDER_KEY)

const supabaseUrl = isSupabaseConfigured ? process.env.NEXT_PUBLIC_SUPABASE_URL! : PLACEHOLDER_URL
const supabaseAnonKey = isSupabaseConfigured ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : PLACEHOLDER_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
