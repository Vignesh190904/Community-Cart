import { createClient } from '@supabase/supabase-js'

// Direct configuration for Node.js testing
const supabaseUrl = 'https://gqbdhpcnrsbexrvkfkso.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTUxOTMsImV4cCI6MjA3MDMzMTE5M30.s6oQMIxDXTirHrEcZO8WdBJvd2-SAnetFmNYVjr0yuI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
