import { supabase } from '@/lib/supabase'
import type { VendorServiceCreateInput, VendorServiceUpdateInput } from '@/lib/schema'

export interface VendorServiceRecord {
  id: number
  vendorId: number
  title: string
  description: string | null
  priceCents: number
  isActive: boolean
  type: string
  duration: string | null
  features: string[] | null
  isPopular: boolean
  pricingModel: string | null
  hourlyRate: number | null
  depositRequired: boolean
  depositPercentage: number | null
  cancellationPolicy: string | null
  createdAt: string
  updatedAt: string
}

export async function createVendorService(input: VendorServiceCreateInput, vendorId: number): Promise<VendorServiceRecord> {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('vendor_services')
    .insert({
      vendor_id: vendorId,
      title: input.title,
      description: input.description,
      price_cents: input.priceCents,
      is_active: input.isActive,
      type: input.type,
      duration: input.duration,
      features: input.features,
      is_popular: input.isPopular,
      pricing_model: input.pricingModel,
      hourly_rate: input.hourlyRate,
      deposit_required: input.depositRequired,
      deposit_percentage: input.depositPercentage,
      cancellation_policy: input.cancellationPolicy,
      created_at: now,
      updated_at: now
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create vendor service: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    title: data.title,
    description: data.description,
    priceCents: data.price_cents,
    isActive: data.is_active,
    type: data.type,
    duration: data.duration,
    features: data.features,
    isPopular: data.is_popular,
    pricingModel: data.pricing_model,
    hourlyRate: data.hourly_rate,
    depositRequired: data.deposit_required,
    depositPercentage: data.deposit_percentage,
    cancellationPolicy: data.cancellation_policy,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function updateVendorService(id: number, input: VendorServiceUpdateInput): Promise<VendorServiceRecord> {
  const updateData: any = {}
  
  if (input.title !== undefined) updateData.title = input.title
  if (input.description !== undefined) updateData.description = input.description
  if (input.priceCents !== undefined) updateData.price_cents = input.priceCents
  if (input.isActive !== undefined) updateData.is_active = input.isActive
  if (input.type !== undefined) updateData.type = input.type
  if (input.duration !== undefined) updateData.duration = input.duration
  if (input.features !== undefined) updateData.features = input.features
  if (input.isPopular !== undefined) updateData.is_popular = input.isPopular
  if (input.pricingModel !== undefined) updateData.pricing_model = input.pricingModel
  if (input.hourlyRate !== undefined) updateData.hourly_rate = input.hourlyRate
  if (input.depositRequired !== undefined) updateData.deposit_required = input.depositRequired
  if (input.depositPercentage !== undefined) updateData.deposit_percentage = input.depositPercentage
  if (input.cancellationPolicy !== undefined) updateData.cancellation_policy = input.cancellationPolicy
  
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('vendor_services')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update vendor service: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    title: data.title,
    description: data.description,
    priceCents: data.price_cents,
    isActive: data.is_active,
    type: data.type,
    duration: data.duration,
    features: data.features,
    isPopular: data.is_popular,
    pricingModel: data.pricing_model,
    hourlyRate: data.hourly_rate,
    depositRequired: data.deposit_required,
    depositPercentage: data.deposit_percentage,
    cancellationPolicy: data.cancellation_policy,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function getVendorServiceById(id: number): Promise<VendorServiceRecord | null> {
  const { data, error } = await supabase
    .from('vendor_services')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to get vendor service: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    title: data.title,
    description: data.description,
    priceCents: data.price_cents,
    isActive: data.is_active,
    type: data.type,
    duration: data.duration,
    features: data.features,
    isPopular: data.is_popular,
    pricingModel: data.pricing_model,
    hourlyRate: data.hourly_rate,
    depositRequired: data.deposit_required,
    depositPercentage: data.deposit_percentage,
    cancellationPolicy: data.cancellation_policy,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function listVendorServices(vendorId: number, limit = 50, offset = 0): Promise<VendorServiceRecord[]> {
  const { data, error } = await supabase
    .from('vendor_services')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error(`Failed to list vendor services: ${error.message}`)
  }

  // Transform from database format to our interface format
  return data.map(row => ({
    id: row.id,
    vendorId: row.vendor_id,
    title: row.title,
    description: row.description,
    priceCents: row.price_cents,
    isActive: row.is_active,
    type: row.type,
    duration: row.duration,
    features: row.features,
    isPopular: row.is_popular,
    pricingModel: row.pricing_model,
    hourlyRate: row.hourly_rate,
    depositRequired: row.deposit_required,
    depositPercentage: row.deposit_percentage,
    cancellationPolicy: row.cancellation_policy,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }))
}

export async function listVendorServicesByType(vendorId: number, type: string): Promise<VendorServiceRecord[]> {
  const { data, error } = await supabase
    .from('vendor_services')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('type', type)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to list vendor services by type: ${error.message}`)
  }

  // Transform from database format to our interface format
  return data.map(row => ({
    id: row.id,
    vendorId: row.vendor_id,
    title: row.title,
    description: row.description,
    priceCents: row.price_cents,
    isActive: row.is_active,
    type: row.type,
    duration: row.duration,
    features: row.features,
    isPopular: row.is_popular,
    pricingModel: row.pricing_model,
    hourlyRate: row.hourly_rate,
    depositRequired: row.deposit_required,
    depositPercentage: row.deposit_percentage,
    cancellationPolicy: row.cancellation_policy,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }))
}

export async function getPopularVendorServices(vendorId: number, limit = 5): Promise<VendorServiceRecord[]> {
  const { data, error } = await supabase
    .from('vendor_services')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)
    .eq('is_popular', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to get popular vendor services: ${error.message}`)
  }

  // Transform from database format to our interface format
  return data.map(row => ({
    id: row.id,
    vendorId: row.vendor_id,
    title: row.title,
    description: row.description,
    priceCents: row.price_cents,
    isActive: row.is_active,
    type: row.type,
    duration: row.duration,
    features: row.features,
    isPopular: row.is_popular,
    pricingModel: row.pricing_model,
    hourlyRate: row.hourly_rate,
    depositRequired: row.deposit_required,
    depositPercentage: row.deposit_percentage,
    cancellationPolicy: row.cancellation_policy,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }))
}

export async function deleteVendorService(id: number): Promise<void> {
  const { error } = await supabase
    .from('vendor_services')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete vendor service: ${error.message}`)
  }
}

export async function deactivateVendorService(id: number): Promise<void> {
  const { error } = await supabase
    .from('vendor_services')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to deactivate vendor service: ${error.message}`)
  }
}

export async function getActiveVendorServices(vendorId: number): Promise<VendorServiceRecord[]> {
  const { data, error } = await supabase
    .from('vendor_services')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get active vendor services: ${error.message}`)
  }

  // Transform from database format to our interface format
  return data.map(row => ({
    id: row.id,
    vendorId: row.vendor_id,
    title: row.title,
    description: row.description,
    priceCents: row.price_cents,
    isActive: row.is_active,
    type: row.type,
    duration: row.duration,
    features: row.features,
    isPopular: row.is_popular,
    pricingModel: row.pricing_model,
    hourlyRate: row.hourly_rate,
    depositRequired: row.deposit_required,
    depositPercentage: row.deposit_percentage,
    cancellationPolicy: row.cancellation_policy,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }))
}

export function parseFeatures(features: string[] | null): string[] {
  if (!features) return []
  if (Array.isArray(features)) return features
  if (typeof features === 'string') {
    try {
      return JSON.parse(features)
    } catch {
      return [features]
    }
  }
  return []
}