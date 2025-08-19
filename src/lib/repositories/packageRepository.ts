import { getDatabase } from '@/lib/db'
import type { PackageCreateInput, PackageUpdateInput } from '@/lib/schema'

export type PackageRecord = {
  id: number
  vendorId: number
  title: string
  description: string
  priceCents: number
  isActive: number
  createdAt: string
  updatedAt: string
}

export function createPackage(vendorId: number, input: PackageCreateInput): PackageRecord {
  const db = getDatabase()
  const now = new Date().toISOString()
  const info = db.prepare(`INSERT INTO packages (vendorId, title, description, priceCents, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    vendorId, input.title, input.description ?? '', input.priceCents, input.isActive ? 1 : 0, now, now
  )
  return db.prepare('SELECT * FROM packages WHERE id = ?').get(Number(info.lastInsertRowid)) as PackageRecord
}

export function updatePackage(vendorId: number, input: PackageUpdateInput): PackageRecord | null {
  const db = getDatabase()
  const now = new Date().toISOString()
  const info = db.prepare(`UPDATE packages SET title = ?, description = ?, priceCents = ?, isActive = ?, updatedAt = ? WHERE id = ? AND vendorId = ?`).run(
    input.title, input.description ?? '', input.priceCents, input.isActive ? 1 : 0, now, input.id, vendorId
  )
  if (info.changes === 0) return null
  return db.prepare('SELECT * FROM packages WHERE id = ?').get(input.id) as PackageRecord
}

export function deletePackage(vendorId: number, id: number): boolean {
  const db = getDatabase()
  const info = db.prepare('DELETE FROM packages WHERE id = ? AND vendorId = ?').run(id, vendorId)
  return info.changes > 0
}

export function listPackages(vendorId: number): PackageRecord[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM packages WHERE vendorId = ? ORDER BY createdAt DESC').all(vendorId) as PackageRecord[]
}

