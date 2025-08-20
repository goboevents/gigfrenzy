import { createClientComponentClient, createServerComponentClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Vendor = Database['public']['Tables']['vendors']['Row']
type VendorInsert = Database['public']['Tables']['vendors']['Insert']
type VendorUpdate = Database['public']['Tables']['vendors']['Update']

export class SupabaseVendorRepository {
  private supabase: ReturnType<typeof createClientComponentClient>

  constructor() {
    this.supabase = createClientComponentClient()
  }

  // Create a new vendor
  async create(vendorData: VendorInsert): Promise<{ data: Vendor | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .insert(vendorData)
      .select()
      .single()

    return { data, error }
  }

  // Get vendor by ID
  async getById(id: number): Promise<{ data: Vendor | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single()

    return { data, error }
  }

  // Get vendor by email
  async getByEmail(email: string): Promise<{ data: Vendor | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .select('*')
      .eq('email', email)
      .single()

    return { data, error }
  }

  // Update vendor
  async update(id: number, updates: VendorUpdate): Promise<{ data: Vendor | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  // Delete vendor
  async delete(id: number): Promise<{ error: any }> {
    const { error } = await this.supabase
      .from('vendors')
      .delete()
      .eq('id', id)

    return { error }
  }

  // Get all vendors (with pagination)
  async getAll(page: number = 1, limit: number = 10): Promise<{ data: Vendor[] | null; error: any; count: number | null }> {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await this.supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    return { data, error, count }
  }

  // Search vendors by business type
  async searchByBusinessType(businessType: string): Promise<{ data: Vendor[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .select('*')
      .ilike('business_type', `%${businessType}%`)
      .order('created_at', { ascending: false })

    return { data, error }
  }

  // Get vendors by location (using service areas)
  async getByLocation(city: string, state: string): Promise<{ data: Vendor[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .select(`
        *,
        vendor_service_areas!inner(city, state)
      `)
      .eq('vendor_service_areas.city', city)
      .eq('vendor_service_areas.state', state)
      .order('created_at', { ascending: false })

    return { data, error }
  }
}

// Server-side repository for API routes
export class SupabaseServerVendorRepository {
  private supabase: ReturnType<typeof createServerComponentClient>

  constructor() {
    this.supabase = createServerComponentClient()
  }

  // Same methods as above but using server client
  async create(vendorData: VendorInsert): Promise<{ data: Vendor | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .insert(vendorData)
      .select()
      .single()

    return { data, error }
  }

  async getById(id: number): Promise<{ data: Vendor | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single()

    return { data, error }
  }

  async getByEmail(email: string): Promise<{ data: Vendor | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .select('*')
      .eq('email', email)
      .single()

    return { data, error }
  }

  async update(id: number, updates: VendorUpdate): Promise<{ data: Vendor | null; error: any }> {
    const { data, error } = await this.supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  async delete(id: number): Promise<{ error: any }> {
    const { error } = await this.supabase
      .from('vendors')
      .delete()
      .eq('id', id)

    return { error }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ data: Vendor[] | null; error: any; count: number | null }> {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await this.supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    return { data, error, count }
  }
}