import { getDatabase } from '@/lib/db'
import type { ServiceCreateInput, ServiceUpdateInput } from '@/lib/schema'

export type ServiceRecord = {
  id: number
  vendorId: number
  title: string
  description: string
  priceCents: number
  isActive: number
  createdAt: string
  updatedAt: string
}

export function createService(vendorId: number, input: ServiceCreateInput): ServiceRecord {
  const db = getDatabase()
  const now = new Date().toISOString()
  const info = db.prepare(`INSERT INTO services (vendorId, title, description, priceCents, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    vendorId, input.title, input.description ?? '', input.priceCents, input.isActive ? 1 : 0, now, now
  )
  return db.prepare('SELECT * FROM services WHERE id = ?').get(Number(info.lastInsertRowid)) as ServiceRecord
}

export function updateService(vendorId: number, input: ServiceUpdateInput): ServiceRecord | null {
  const db = getDatabase()
  const now = new Date().toISOString()
  const info = db.prepare(`UPDATE services SET title = ?, description = ?, priceCents = ?, isActive = ?, updatedAt = ? WHERE id = ? AND vendorId = ?`).run(
    input.title, input.description ?? '', input.priceCents, input.isActive ? 1 : 0, now, input.id, vendorId
  )
  if (info.changes === 0) return null
  return db.prepare('SELECT * FROM services WHERE id = ?').get(input.id) as ServiceRecord
}

export function deleteService(vendorId: number, id: number): boolean {
  const db = getDatabase()
  const info = db.prepare('DELETE FROM services WHERE id = ? AND vendorId = ?').run(id, vendorId)
  return info.changes > 0
}

export function listServices(vendorId: number): ServiceRecord[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM services WHERE vendorId = ? ORDER BY createdAt DESC').all(vendorId) as ServiceRecord[]
}

