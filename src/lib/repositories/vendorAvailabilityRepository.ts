import { getDatabase } from '@/lib/db'

export type VendorAvailabilityRecord = {
  id: number
  vendorId: number
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

export function createVendorAvailability(
  vendorId: number,
  availability: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
    startTime: string
    endTime: string
  }
): VendorAvailabilityRecord {
  const db = getDatabase()
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO vendor_availability (
      vendorId, monday, tuesday, wednesday, thursday, friday, saturday, sunday,
      startTime, endTime, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    vendorId,
    availability.monday ? 1 : 0,
    availability.tuesday ? 1 : 0,
    availability.wednesday ? 1 : 0,
    availability.thursday ? 1 : 0,
    availability.friday ? 1 : 0,
    availability.saturday ? 1 : 0,
    availability.sunday ? 1 : 0,
    availability.startTime,
    availability.endTime,
    now,
    now
  )

  return {
    id: Number(result.lastInsertRowid),
    vendorId,
    ...availability,
    createdAt: now,
    updatedAt: now,
  }
}

export function getVendorAvailability(vendorId: number): VendorAvailabilityRecord | null {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM vendor_availability WHERE vendorId = ?').get(vendorId) as VendorAvailabilityRecord | undefined
  return row ?? null
}

export function updateVendorAvailability(
  vendorId: number,
  availability: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
    startTime: string
    endTime: string
  }
): VendorAvailabilityRecord | null {
  const db = getDatabase()
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    UPDATE vendor_availability SET
      monday = ?, tuesday = ?, wednesday = ?, thursday = ?, friday = ?, saturday = ?, sunday = ?,
      startTime = ?, endTime = ?, updatedAt = ?
    WHERE vendorId = ?
  `)

  const result = stmt.run(
    availability.monday ? 1 : 0,
    availability.tuesday ? 1 : 0,
    availability.wednesday ? 1 : 0,
    availability.thursday ? 1 : 0,
    availability.friday ? 1 : 0,
    availability.saturday ? 1 : 0,
    availability.sunday ? 1 : 0,
    availability.startTime,
    availability.endTime,
    now,
    vendorId
  )

  if (result.changes === 0) return null
  return getVendorAvailability(vendorId)
}
