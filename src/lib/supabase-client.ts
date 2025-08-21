import { createBrowserClient } from '@supabase/ssr'

export type AuthUser = { 
  userId: string; 
  role: 'vendor' | 'admin';
  email?: string;
  name?: string;
}

// Client-side Supabase client for browser
export function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Client-side authentication functions
export async function signInClient(email: string, password: string) {
  const supabase = createBrowserSupabaseClient()
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUpClient(email: string, password: string, metadata?: any) {
  const supabase = createBrowserSupabaseClient()
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata }
  })
}

export async function signOutClient() {
  const supabase = createBrowserSupabaseClient()
  return await supabase.auth.signOut()
}

export async function resetPasswordClient(email: string) {
  const supabase = createBrowserSupabaseClient()
  return await supabase.auth.resetPasswordForEmail(email)
}

export async function getCurrentUser() {
  const supabase = createBrowserSupabaseClient()
  return await supabase.auth.getUser()
}

export async function getCurrentSession() {
  const supabase = createBrowserSupabaseClient()
  return await supabase.auth.getSession()
}
