import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (for components and hooks)
export const createClientComponentClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client (for API routes and server components)
export const createServerComponentClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Service role client (for admin operations, use with caution)
export const createServiceRoleClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Legacy client for backward compatibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      vendors: {
        Row: {
          id: number
          business_name: string
          contact_name: string
          email: string
          phone: string | null
          business_type: string
          website: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          business_name: string
          contact_name: string
          email: string
          phone?: string | null
          business_type: string
          website?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          business_name?: string
          contact_name?: string
          email?: string
          phone?: string | null
          business_type?: string
          website?: string | null
          description?: string | null
          created_at?: string
        }
      }
      vendor_users: {
        Row: {
          id: number
          email: string
          password_hash: string
          name: string
          role: string
          created_at: string
        }
        Insert: {
          id?: number
          email: string
          password_hash: string
          name: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: number
          email?: string
          password_hash?: string
          name?: string
          role?: string
          created_at?: string
        }
      }
      vendor_profiles: {
        Row: {
          id: number
          vendor_id: number
          slug: string
          display_name: string
          headline: string | null
          bio: string | null
          location: string | null
          website: string | null
          avatar_url: string | null
          cover_image_url: string | null
          visibility: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          vendor_id: number
          slug: string
          display_name: string
          headline?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          avatar_url?: string | null
          cover_image_url?: string | null
          visibility?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          vendor_id?: number
          slug?: string
          display_name?: string
          headline?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          avatar_url?: string | null
          cover_image_url?: string | null
          visibility?: string
          created_at?: string
          updated_at?: string
        }
      }
      vendor_services: {
        Row: {
          id: number
          vendor_id: number
          title: string
          description: string | null
          price_cents: number
          is_active: boolean
          type: string
          duration: string | null
          features: string[] | null
          is_popular: boolean
          pricing_model: string
          hourly_rate: number | null
          deposit_required: boolean
          deposit_percentage: number | null
          cancellation_policy: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          vendor_id: number
          title: string
          description?: string | null
          price_cents: number
          is_active?: boolean
          type?: string
          duration?: string | null
          features?: string[] | null
          is_popular?: boolean
          pricing_model?: string
          hourly_rate?: number | null
          deposit_required?: boolean
          deposit_percentage?: number | null
          cancellation_policy?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          vendor_id?: number
          title?: string
          description?: string | null
          price_cents?: number
          is_active?: boolean
          type?: string
          duration?: string | null
          features?: string[] | null
          is_popular?: boolean
          pricing_model?: string
          hourly_rate?: number | null
          deposit_required?: boolean
          deposit_percentage?: number | null
          cancellation_policy?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed...
    }
  }
}