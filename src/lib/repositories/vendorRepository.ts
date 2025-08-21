import { supabase } from '@/lib/supabase'
import type { VendorCreateInput, VendorRecord } from '@/lib/schema'

export async function createVendor(input: VendorCreateInput): Promise<VendorRecord> {
  const createdAt = new Date().toISOString()

  const { data, error } = await supabase
    .from('vendors')
    .insert({
      business_name: input.businessName,
      contact_name: input.contactName,
      email: input.email,
      phone: input.phone ?? '',
      business_type: input.businessType,
      website: input.website ?? '',
      description: input.description ?? '',
      created_at: createdAt
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create vendor: ${error.message}`)
  }

  // Transform from database format to our schema format
  return {
    id: data.id,
    businessName: data.business_name,
    contactName: data.contact_name,
    email: data.email,
    phone: data.phone,
    businessType: data.business_type,
    website: data.website,
    description: data.description,
    createdAt: data.created_at
  }
}

export async function getVendorById(id: number): Promise<VendorRecord | null> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to get vendor: ${error.message}`)
  }

  // Transform from database format to our schema format
  return {
    id: data.id,
    businessName: data.business_name,
    contactName: data.contact_name,
    email: data.email,
    phone: data.phone,
    businessType: data.business_type,
    website: data.website,
    description: data.description,
    createdAt: data.created_at
  }
}

export async function listVendors(limit = 50, offset = 0): Promise<VendorRecord[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error(`Failed to list vendors: ${error.message}`)
  }

  // Transform from database format to our schema format
  return data.map(row => ({
    id: row.id,
    businessName: row.business_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    businessType: row.business_type,
    website: row.website,
    description: row.description,
    createdAt: row.created_at
  }))
}

export async function updateVendor(id: number, updates: Partial<VendorCreateInput>): Promise<VendorRecord> {
  const updateData: any = {}
  
  if (updates.businessName !== undefined) updateData.business_name = updates.businessName
  if (updates.contactName !== undefined) updateData.contact_name = updates.contactName
  if (updates.email !== undefined) updateData.email = updates.email
  if (updates.phone !== undefined) updateData.phone = updates.phone
  if (updates.businessType !== undefined) updateData.business_type = updates.businessType
  if (updates.website !== undefined) updateData.website = updates.website
  if (updates.description !== undefined) updateData.description = updates.description

  const { data, error } = await supabase
    .from('vendors')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update vendor: ${error.message}`)
  }

  // Transform from database format to our schema format
  return {
    id: data.id,
    businessName: data.business_name,
    contactName: data.contact_name,
    email: data.email,
    phone: data.phone,
    businessType: data.business_type,
    website: data.website,
    description: data.description,
    createdAt: data.created_at
  }
}

export async function deleteVendor(id: number): Promise<void> {
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete vendor: ${error.message}`)
  }
}

export async function findVendorByEmail(email: string): Promise<VendorRecord | null> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to find vendor by email: ${error.message}`)
  }

  // Transform from database format to our schema format
  return {
    id: data.id,
    businessName: data.business_name,
    contactName: data.contact_name,
    email: data.email,
    phone: data.phone,
    businessType: data.business_type,
    website: data.website,
    description: data.description,
    createdAt: data.created_at
  }
}

