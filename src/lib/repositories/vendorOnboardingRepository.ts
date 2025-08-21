import { createClient } from '@supabase/supabase-js'
import type { OnboardingData } from '@/lib/schema'

export type VendorOnboardingRecord = {
  id: number
  vendor_id: number
  step: string
  data: string
  is_complete: boolean
  created_at: string
  updated_at: string
}

// Create Supabase client
function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function saveOnboardingStep(vendorId: number, step: string, data: any): Promise<VendorOnboardingRecord> {
  const supabase = createSupabaseClient()
  const now = new Date().toISOString()
  
  // Check if step already exists
  const { data: existing, error: selectError } = await supabase
    .from('vendor_onboarding')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('step', step)
    .single()
  
  if (selectError && selectError.code !== 'PGRST116') {
    throw new Error(`Error checking existing step: ${selectError.message}`)
  }
  
  if (existing) {
    // Update existing step
    const { data: updated, error: updateError } = await supabase
      .from('vendor_onboarding')
      .update({
        data: JSON.stringify(data),
        is_complete: true,
        updated_at: now
      })
      .eq('id', existing.id)
      .select()
      .single()
    
    if (updateError) {
      throw new Error(`Error updating step: ${updateError.message}`)
    }
    
    return updated
  } else {
    // Create new step
    const { data: created, error: insertError } = await supabase
      .from('vendor_onboarding')
      .insert({
        vendor_id: vendorId,
        step,
        data: JSON.stringify(data),
        is_complete: true,
        created_at: now,
        updated_at: now
      })
      .select()
      .single()
    
    if (insertError) {
      throw new Error(`Error creating step: ${insertError.message}`)
    }
    
    return created
  }
}

export async function getOnboardingStep(vendorId: number, step: string): Promise<any | null> {
  const supabase = createSupabaseClient()
  
  const { data: record, error } = await supabase
    .from('vendor_onboarding')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('step', step)
    .single()
  
  if (error || !record) return null
  
  try {
    return JSON.parse(record.data)
  } catch {
    return null
  }
}

export async function getAllOnboardingData(vendorId: number): Promise<OnboardingData> {
  const supabase = createSupabaseClient()
  
  const { data: records, error } = await supabase
    .from('vendor_onboarding')
    .select('*')
    .eq('vendor_id', vendorId)
  
  if (error) {
    console.error('Error fetching onboarding data:', error)
    return {}
  }
  
  const onboardingData: OnboardingData = {}
  
  records?.forEach(record => {
    try {
      const stepData = JSON.parse(record.data)
      switch (record.step) {
        case 'accountCreation':
          onboardingData.accountCreation = stepData
          break
        case 'accountSetup':
          onboardingData.accountSetup = stepData
          break
        case 'businessProfile':
          onboardingData.businessProfile = stepData
          break
        case 'documentation':
          onboardingData.documentation = stepData
          break
        case 'locationAvailability':
          onboardingData.locationAvailability = stepData
          break
        case 'pricingPackages':
          onboardingData.pricingPackages = stepData
          break
        case 'serviceCategories':
          onboardingData.serviceCategories = stepData
          break
      }
    } catch {
      // Skip invalid JSON data
    }
  })
  
  return onboardingData
}

export async function isOnboardingComplete(vendorId: number): Promise<boolean> {
  const supabase = createSupabaseClient()
  
  const { count, error } = await supabase
    .from('vendor_onboarding')
    .select('*', { count: 'exact', head: true })
    .eq('vendor_id', vendorId)
    .eq('is_complete', true)
  
  if (error) {
    console.error('Error checking onboarding completion:', error)
    return false
  }
  
  return (count || 0) >= 7 // All 7 steps must be complete
}

export async function getOnboardingProgress(vendorId: number): Promise<{ completed: number; total: number; percentage: number }> {
  const supabase = createSupabaseClient()
  
  const { count, error } = await supabase
    .from('vendor_onboarding')
    .select('*', { count: 'exact', head: true })
    .eq('vendor_id', vendorId)
    .eq('is_complete', true)
  
  if (error) {
    console.error('Error getting onboarding progress:', error)
    return { completed: 0, total: 7, percentage: 0 }
  }
  
  const completed = count || 0
  const total = 7
  const percentage = Math.round((completed / total) * 100)
  
  return { completed, total, percentage }
}