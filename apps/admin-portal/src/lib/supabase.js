import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqbdhpcnrsbexrvkfkso.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTUxOTMsImV4cCI6MjA3MDMzMTE5M30.s6oQMIxDXTirHrEcZO8WdBJvd2-SAnetFmNYVjr0yuI'

// Validate that we have the required credentials
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  console.warn('Supabase URL not configured. Please set VITE_SUPABASE_URL in your .env file')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.warn('Supabase anon key not configured. Please set VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
