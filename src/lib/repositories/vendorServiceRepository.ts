import { getDatabase } from '@/lib/db'
import type { VendorServiceCreateInput, VendorServiceUpdateInput } from '@/lib/schema'

export type VendorServiceRecord = {
  id: number
  vendorId: number
  title: string
  description: string
  priceCents: number
  isActive: number
  type: string
  duration: string
  features: string
  isPopular: number
  pricingModel: string
  hourlyRate: number
  depositRequired: number
  depositPercentage: number
  cancellationPolicy: string
  createdAt: string
  updatedAt: string
}

export function createVendorService(vendorId: number, input: VendorServiceCreateInput): VendorServiceRecord {
  const db = getDatabase()
  const now = new Date().toISOString()
  
  const info = db.prepare(`
    INSERT INTO vendor_services (
      vendorId, title, description, priceCents, isActive, type, duration, 
      features, isPopular, pricingModel, hourlyRate, depositRequired, 
      depositPercentage, cancellationPolicy, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    vendorId, 
    input.title, 
    input.description ?? '', 
    input.priceCents, 
    input.isActive ? 1 : 0,
    input.type,
    input.duration ?? 'per event',
    JSON.stringify(input.features ?? []),
    input.isPopular ? 1 : 0,
    input.pricingModel ?? 'fixed',
    input.hourlyRate ?? 0,
    input.depositRequired ? 1 : 0,
    input.depositPercentage ?? 25,
    input.cancellationPolicy ?? '',
    now, 
    now
  )
  
  return db.prepare('SELECT * FROM vendor_services WHERE id = ?').get(Number(info.lastInsertRowid)) as VendorServiceRecord
}

export function updateVendorService(vendorId: number, input: VendorServiceUpdateInput): VendorServiceRecord | null {
  const db = getDatabase()
  const now = new Date().toISOString()
  
  const info = db.prepare(`
    UPDATE vendor_services SET 
      title = ?, description = ?, priceCents = ?, isActive = ?, type = ?, 
      duration = ?, features = ?, isPopular = ?, pricingModel = ?, hourlyRate = ?, 
      depositRequired = ?, depositPercentage = ?, cancellationPolicy = ?, updatedAt = ? 
    WHERE id = ? AND vendorId = ?
  `).run(
    input.title, 
    input.description ?? '', 
    input.priceCents, 
    input.isActive ? 1 : 0,
    input.type,
    input.duration ?? 'per event',
    JSON.stringify(input.features ?? []),
    input.isPopular ? 1 : 0,
    input.pricingModel ?? 'fixed',
    input.hourlyRate ?? 0,
    input.depositRequired ? 1 : 0,
    input.depositPercentage ?? 25,
    input.cancellationPolicy ?? '',
    now, 
    input.id, 
    vendorId
  )
  
  if (info.changes === 0) return null
  return db.prepare('SELECT * FROM vendor_services WHERE id = ?').get(input.id) as VendorServiceRecord
}

export function deleteVendorService(vendorId: number, id: number): boolean {
  const db = getDatabase()
  const info = db.prepare('DELETE FROM vendor_services WHERE id = ? AND vendorId = ?').run(id, vendorId)
  return info.changes > 0
}

export function listVendorServices(vendorId: number, type?: string): VendorServiceRecord[] {
  const db = getDatabase()
  if (type) {
    return db.prepare('SELECT * FROM vendor_services WHERE vendorId = ? AND type = ? ORDER BY createdAt DESC').all(vendorId, type) as VendorServiceRecord[]
  }
  return db.prepare('SELECT * FROM vendor_services WHERE vendorId = ? ORDER BY createdAt DESC').all(vendorId) as VendorServiceRecord[]
}

export function getVendorService(vendorId: number, id: number): VendorServiceRecord | null {
  const db = getDatabase()
  return db.prepare('SELECT * FROM vendor_services WHERE id = ? AND vendorId = ?').get(id, vendorId) as VendorServiceRecord | null
}

// Helper function to parse features from JSON string
export function parseFeatures(features: string): string[] {
  try {
    return JSON.parse(features)
  } catch {
    return []
  }
}

// Helper function to get active services for public display
export function getActiveVendorServices(vendorId: number): VendorServiceRecord[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM vendor_services WHERE vendorId = ? AND isActive = 1 ORDER BY isPopular DESC, createdAt DESC').all(vendorId) as VendorServiceRecord[]
}