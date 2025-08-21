import { supabase } from '@/lib/supabase'

export interface VendorAvailabilityRecord {
  id: number
  vendorId: number
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  startTime: string | null
  endTime: string | null
  createdAt: string
  updatedAt: string
}

export async function createVendorAvailability(
  vendorId: number,
  availability: Omit<VendorAvailabilityRecord, 'id' | 'vendorId' | 'createdAt' | 'updatedAt'>
): Promise<VendorAvailabilityRecord> {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('vendor_availability')
    .insert({
      vendor_id: vendorId,
      monday: availability.monday,
      tuesday: availability.tuesday,
      wednesday: availability.wednesday,
      thursday: availability.thursday,
      friday: availability.friday,
      saturday: availability.saturday,
      sunday: availability.sunday,
      start_time: availability.startTime,
      end_time: availability.endTime,
      created_at: now,
      updated_at: now
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create vendor availability: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    monday: data.monday,
    tuesday: data.tuesday,
    wednesday: data.wednesday,
    thursday: data.thursday,
    friday: data.friday,
    saturday: data.saturday,
    sunday: data.sunday,
    startTime: data.start_time,
    endTime: data.end_time,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function getVendorAvailability(vendorId: number): Promise<VendorAvailabilityRecord | null> {
  const { data, error } = await supabase
    .from('vendor_availability')
    .select('*')
    .eq('vendor_id', vendorId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to get vendor availability: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    monday: data.monday,
    tuesday: data.tuesday,
    wednesday: data.wednesday,
    thursday: data.thursday,
    friday: data.friday,
    saturday: data.saturday,
    sunday: data.sunday,
    startTime: data.start_time,
    endTime: data.end_time,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function updateVendorAvailability(
  vendorId: number,
  updates: Partial<Omit<VendorAvailabilityRecord, 'id' | 'vendorId' | 'createdAt' | 'updatedAt'>>
): Promise<VendorAvailabilityRecord> {
  const updateData: any = {}
  
  if (updates.monday !== undefined) updateData.monday = updates.monday
  if (updates.tuesday !== undefined) updateData.tuesday = updates.tuesday
  if (updates.wednesday !== undefined) updateData.wednesday = updates.wednesday
  if (updates.thursday !== undefined) updateData.thursday = updates.thursday
  if (updates.friday !== undefined) updateData.friday = updates.friday
  if (updates.saturday !== undefined) updateData.saturday = updates.saturday
  if (updates.sunday !== undefined) updateData.sunday = updates.sunday
  if (updates.startTime !== undefined) updateData.start_time = updates.startTime
  if (updates.endTime !== undefined) updateData.end_time = updates.endTime
  
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('vendor_availability')
    .update(updateData)
    .eq('vendor_id', vendorId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update vendor availability: ${error.message}`)
  }

  // Transform from database format to our interface format
  return {
    id: data.id,
    vendorId: data.vendor_id,
    monday: data.monday,
    tuesday: data.tuesday,
    wednesday: data.wednesday,
    thursday: data.thursday,
    friday: data.friday,
    saturday: data.saturday,
    sunday: data.sunday,
    startTime: data.start_time,
    endTime: data.end_time,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export async function upsertVendorAvailability(
  vendorId: number,
  availability: Omit<VendorAvailabilityRecord, 'id' | 'vendorId' | 'createdAt' | 'updatedAt'>
): Promise<VendorAvailabilityRecord> {
  // Try to get existing availability
  const existing = await getVendorAvailability(vendorId)
  
  if (existing) {
    // Update existing
    return await updateVendorAvailability(vendorId, availability)
  } else {
    // Create new
    return await createVendorAvailability(vendorId, availability)
  }
}

export async function deleteVendorAvailability(vendorId: number): Promise<void> {
  const { error } = await supabase
    .from('vendor_availability')
    .delete()
    .eq('vendor_id', vendorId)

  if (error) {
    throw new Error(`Failed to delete vendor availability: ${error.message}`)
  }
}

export async function isVendorAvailableOnDay(vendorId: number, dayOfWeek: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('vendor_availability')
    .select('monday, tuesday, wednesday, thursday, friday, saturday, sunday')
    .eq('vendor_id', vendorId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No availability record, assume not available
      return false
    }
    throw new Error(`Failed to check vendor availability: ${error.message}`)
  }

  const days = [
    data.sunday,    // 0 = Sunday
    data.monday,    // 1 = Monday
    data.tuesday,   // 2 = Tuesday
    data.wednesday, // 3 = Wednesday
    data.thursday,  // 4 = Thursday
    data.friday,    // 5 = Friday
    data.saturday   // 6 = Saturday
  ]

  return days[dayOfWeek] || false
}
