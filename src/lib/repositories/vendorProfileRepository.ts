import { supabase } from '@/lib/supabase'
import type { VendorProfileUpsertInput } from '@/lib/schema'

export interface VendorProfileRecord {
  id: number
  vendorId: number
  slug: string
  displayName: string
  headline: string | null
  bio: string | null
  location: string | null
  website: string | null
  avatarUrl: string | null
  coverImageUrl: string | null
  visibility: string
  createdAt: string
  updatedAt: string
}

export async function createVendorProfile(input: VendorProfileUpsertInput, vendorId: number): Promise<VendorProfileRecord> {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('vendor_profiles')
    .insert({
      vendor_id: vendorId,
      slug: input.slug,
      display_name: input.displayName,
      headline: input.headline,
      bio: input.bio,
      location: input.location,
      website: input.website,
      avatar_url: input.avatarUrl,
      cover_image_url: input.coverImageUrl,
      visibility: input.visibility,
      created_at: now,
      updated_at: now
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create vendor profile: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    slug: data.slug,
    displayName: data.display_name,
    headline: data.headline,
    bio: data.bio,
    location: data.location,
    website: data.website,
    avatarUrl: data.avatar_url,
    coverImageUrl: data.cover_image_url,
    visibility: data.visibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function updateVendorProfile(id: number, input: Partial<VendorProfileUpsertInput>): Promise<VendorProfileRecord> {
  const updateData: any = {}
  
  if (input.slug !== undefined) updateData.slug = input.slug
  if (input.displayName !== undefined) updateData.display_name = input.displayName
  if (input.headline !== undefined) updateData.headline = input.headline
  if (input.bio !== undefined) updateData.bio = input.bio
  if (input.location !== undefined) updateData.location = input.location
  if (input.website !== undefined) updateData.website = input.website
  if (input.avatarUrl !== undefined) updateData.avatar_url = input.avatarUrl
  if (input.coverImageUrl !== undefined) updateData.cover_image_url = input.coverImageUrl
  if (input.visibility !== undefined) updateData.visibility = input.visibility
  
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('vendor_profiles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update vendor profile: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    slug: data.slug,
    displayName: data.display_name,
    headline: data.headline,
    bio: data.bio,
    location: data.location,
    website: data.website,
    avatarUrl: data.avatar_url,
    coverImageUrl: data.cover_image_url,
    visibility: data.visibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function getVendorProfileById(id: number): Promise<VendorProfileRecord | null> {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to get vendor profile: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    slug: data.slug,
    displayName: data.display_name,
    headline: data.headline,
    bio: data.bio,
    location: data.location,
    website: data.website,
    avatarUrl: data.avatar_url,
    coverImageUrl: data.cover_image_url,
    visibility: data.visibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function getVendorProfileBySlug(slug: string): Promise<VendorProfileRecord | null> {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('visibility', 'public')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to get vendor profile by slug: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    slug: data.slug,
    displayName: data.display_name,
    headline: data.headline,
    bio: data.bio,
    location: data.location,
    website: data.website,
    avatarUrl: data.avatar_url,
    coverImageUrl: data.cover_image_url,
    visibility: data.visibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function getVendorProfileByVendorId(vendorId: number): Promise<VendorProfileRecord | null> {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('vendor_id', vendorId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to get vendor profile by vendor ID: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    slug: data.slug,
    displayName: data.display_name,
    headline: data.headline,
    bio: data.bio,
    location: data.location,
    website: data.website,
    avatarUrl: data.avatar_url,
    coverImageUrl: data.cover_image_url,
    visibility: data.visibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function listPublicVendorProfiles(limit = 50, offset = 0): Promise<VendorProfileRecord[]> {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error(`Failed to list public vendor profiles: ${error.message}`)
  }

  // Transform from database format to our interface format
  return data.map(row => ({
    id: row.id,
    vendorId: row.vendor_id,
    slug: row.slug,
    displayName: row.display_name,
    headline: row.headline,
    bio: row.bio,
    location: row.location,
    website: row.website,
    avatarUrl: row.avatar_url,
    coverImageUrl: row.cover_image_url,
    visibility: row.visibility,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }))
}

export async function deleteVendorProfile(id: number): Promise<void> {
  const { error } = await supabase
    .from('vendor_profiles')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete vendor profile: ${error.message}`)
  }
}

export async function upsertVendorProfile(vendorId: number, input: VendorProfileUpsertInput): Promise<VendorProfileRecord> {
  // Check if profile already exists
  const existingProfile = await getVendorProfileByVendorId(vendorId)
  
  if (existingProfile) {
    // Update existing profile
    return await updateVendorProfile(existingProfile.id, input)
  } else {
    // Create new profile
    return await createVendorProfile(input, vendorId)
  }
}

