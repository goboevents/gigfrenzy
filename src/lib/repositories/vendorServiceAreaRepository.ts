import { supabase } from '@/lib/supabase'

export interface VendorServiceAreaRecord {
  id: number
  vendorId: number
  city: string
  state: string
  zipCode: string
  radius: number | null
  createdAt: string
}

export async function createVendorServiceArea(
  vendorId: number, 
  city: string, 
  state: string, 
  zipCode: string, 
  radius: number = 25
): Promise<VendorServiceAreaRecord> {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('vendor_service_areas')
    .insert({
      vendor_id: vendorId,
      city,
      state,
      zip_code: zipCode,
      radius,
      created_at: now
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create vendor service area: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    radius: data.radius,
    createdAt: data.created_at
  }
}

export async function getVendorServiceAreas(vendorId: number): Promise<VendorServiceAreaRecord[]> {
  const { data, error } = await supabase
    .from('vendor_service_areas')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get vendor service areas: ${error.message}`)
  }

  // Transform from database format to our interface format
  return data.map(row => ({
    id: row.id,
    vendorId: row.vendor_id,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    radius: row.radius,
    createdAt: row.created_at
  }))
}

export async function getVendorServiceAreaById(id: number): Promise<VendorServiceAreaRecord | null> {
  const { data, error } = await supabase
    .from('vendor_service_areas')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to get vendor service area: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    radius: data.radius,
    createdAt: data.created_at
  }
}

export async function updateVendorServiceArea(
  id: number, 
  updates: Partial<Pick<VendorServiceAreaRecord, 'city' | 'state' | 'zipCode' | 'radius'>>
): Promise<VendorServiceAreaRecord> {
  const updateData: any = {}
  
  if (updates.city !== undefined) updateData.city = updates.city
  if (updates.state !== undefined) updateData.state = updates.state
  if (updates.zipCode !== undefined) updateData.zip_code = updates.zipCode
  if (updates.radius !== undefined) updateData.radius = updates.radius

  const { data, error } = await supabase
    .from('vendor_service_areas')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update vendor service area: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    radius: data.radius,
    createdAt: data.created_at
  }
}

export async function deleteVendorServiceArea(id: number): Promise<void> {
  const { error } = await supabase
    .from('vendor_service_areas')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete vendor service area: ${error.message}`)
  }
}

export async function deleteAllVendorServiceAreas(vendorId: number): Promise<void> {
  const { error } = await supabase
    .from('vendor_service_areas')
    .delete()
    .eq('vendor_id', vendorId)

  if (error) {
    throw new Error(`Failed to delete all vendor service areas: ${error.message}`)
  }
}

export async function findVendorsInArea(city: string, state: string, zipCode: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('vendor_service_areas')
    .select('vendor_id')
    .or(`city.eq.${city},state.eq.${state},zip_code.eq.${zipCode}`)

  if (error) {
    throw new Error(`Failed to find vendors in area: ${error.message}`)
  }

  return data.map(row => row.vendor_id)
}
