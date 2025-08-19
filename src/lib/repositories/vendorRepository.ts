import { getDatabase } from '@/lib/db'
import type { VendorCreateInput, VendorRecord } from '@/lib/schema'

export function createVendor(input: VendorCreateInput): VendorRecord {
  const db = getDatabase()
  const createdAt = new Date().toISOString()

  const statement = db.prepare(`
    INSERT INTO vendors (
      businessName, contactName, email, phone, businessType, website, description, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const result = statement.run(
    input.businessName,
    input.contactName,
    input.email,
    input.phone ?? '',
    input.businessType,
    input.website ?? '',
    input.description ?? '',
    createdAt
  )

  return {
    id: Number(result.lastInsertRowid),
    businessName: input.businessName,
    contactName: input.contactName,
    email: input.email,
    phone: input.phone ?? '',
    businessType: input.businessType,
    website: input.website ?? '',
    description: input.description ?? '',
    createdAt,
  }
}

export function getVendorById(id: number): VendorRecord | null {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM vendors WHERE id = ?').get(id) as VendorRecord | undefined
  return row ?? null
}

export function listVendors(limit = 50, offset = 0): VendorRecord[] {
  const db = getDatabase()
  const rows = db.prepare('SELECT * FROM vendors ORDER BY id DESC LIMIT ? OFFSET ?').all(limit, offset) as VendorRecord[]
  return rows
}

