import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side client for API routes (uses service role key)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service role key')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Type definitions for database tables
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
          pricing_model: string | null
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
          pricing_model?: string | null
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
          pricing_model?: string | null
          hourly_rate?: number | null
          deposit_required?: boolean
          deposit_percentage?: number | null
          cancellation_policy?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendor_service_areas: {
        Row: {
          id: number
          vendor_id: number
          city: string
          state: string
          zip_code: string
          radius: number | null
          created_at: string
        }
        Insert: {
          id?: number
          vendor_id: number
          city: string
          state: string
          zip_code: string
          radius?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          vendor_id?: number
          city?: string
          state?: string
          zip_code?: string
          radius?: number | null
          created_at?: string
        }
      }
      vendor_availability: {
        Row: {
          id: number
          vendor_id: number
          monday: boolean
          tuesday: boolean
          wednesday: boolean
          thursday: boolean
          friday: boolean
          saturday: boolean
          sunday: boolean
          start_time: string | null
          end_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          vendor_id: number
          monday?: boolean
          tuesday?: boolean
          wednesday?: boolean
          thursday?: boolean
          friday?: boolean
          saturday?: boolean
          sunday?: boolean
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          vendor_id?: number
          monday?: boolean
          tuesday?: boolean
          wednesday?: boolean
          thursday?: boolean
          friday?: boolean
          saturday?: boolean
          sunday?: boolean
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: number
          vendor_id: number
          customer_name: string
          customer_email: string
          customer_phone: string | null
          service_id: number | null
          event_date: string
          event_time: string | null
          event_location: string | null
          guest_count: number | null
          special_requirements: string | null
          status: string
          total_amount_cents: number
          deposit_amount_cents: number | null
          deposit_paid: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          vendor_id: number
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          service_id?: number | null
          event_date: string
          event_time?: string | null
          event_location?: string | null
          guest_count?: number | null
          special_requirements?: string | null
          status?: string
          total_amount_cents: number
          deposit_amount_cents?: number | null
          deposit_paid?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          vendor_id?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          service_id?: number | null
          event_date?: string
          event_time?: string | null
          event_location?: string | null
          guest_count?: number | null
          special_requirements?: string | null
          status?: string
          total_amount_cents?: number
          deposit_amount_cents?: number | null
          deposit_paid?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vendor_user_vendors: {
        Row: {
          user_id: string
          vendor_id: number
        }
        Insert: {
          user_id: string
          vendor_id: number
        }
        Update: {
          user_id?: string
          vendor_id?: number
        }
      }
    }
  }
}
