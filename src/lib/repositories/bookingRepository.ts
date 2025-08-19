import { getDatabase } from '@/lib/db'

export type BookingRecord = {
  id: number
  vendorId: number
  customerName: string
  customerEmail: string
  eventDate: string
  packageId: number | null
  status: string
  createdAt: string
}

export function listBookingsForVendor(vendorId: number): BookingRecord[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM bookings WHERE vendorId = ? ORDER BY createdAt DESC').all(vendorId) as BookingRecord[]
}

