import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://skaanrwiwfnhofzdchiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrYWFucndpd2ZuaG9memRjaGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NjIxMDUsImV4cCI6MjA4NzEzODEwNX0.8lV_Mncr3JADxVTJPnuhgVJs1PYsJb1Dj6iDpGTx6JY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
