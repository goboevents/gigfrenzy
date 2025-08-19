import { getDatabase } from '@/lib/db'

export type VendorServiceAreaRecord = {
  id: number
  vendorId: number
  city: string
  state: string
  zipCode: string
  radius: number
  createdAt: string
}

export function createVendorServiceArea(
  vendorId: number,
  city: string,
  state: string,
  zipCode: string,
  radius: number = 25
): VendorServiceAreaRecord {
  const db = getDatabase()
  const createdAt = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO vendor_service_areas (vendorId, city, state, zipCode, radius, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(vendorId, city, state, zipCode, radius, createdAt)

  return {
    id: Number(result.lastInsertRowid),
    vendorId,
    city,
    state,
    zipCode,
    radius,
    createdAt,
  }
}

export function getVendorServiceAreas(vendorId: number): VendorServiceAreaRecord[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM vendor_service_areas WHERE vendorId = ? ORDER BY createdAt DESC')
    .all(vendorId) as VendorServiceAreaRecord[]
}

export function deleteVendorServiceArea(id: number, vendorId: number): boolean {
  const db = getDatabase()
  const info = db.prepare('DELETE FROM vendor_service_areas WHERE id = ? AND vendorId = ?').run(id, vendorId)
  return info.changes > 0
}
