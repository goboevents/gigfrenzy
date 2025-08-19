import { getDatabase } from '@/lib/db'
import type { OnboardingData } from '@/lib/schema'

export type VendorOnboardingRecord = {
  id: number
  vendorId: number
  step: string
  data: string
  isComplete: number
  createdAt: string
  updatedAt: string
}

export function saveOnboardingStep(vendorId: number, step: string, data: any): VendorOnboardingRecord {
  const db = getDatabase()
  const now = new Date().toISOString()
  
  // Check if step already exists
  const existing = db.prepare('SELECT * FROM vendor_onboarding WHERE vendorId = ? AND step = ?').get(vendorId, step) as VendorOnboardingRecord | null
  
  if (existing) {
    // Update existing step
    const info = db.prepare(`
      UPDATE vendor_onboarding SET 
        data = ?, isComplete = ?, updatedAt = ? 
      WHERE id = ?
    `).run(JSON.stringify(data), 1, now, existing.id)
    
    return db.prepare('SELECT * FROM vendor_onboarding WHERE id = ?').get(existing.id) as VendorOnboardingRecord
  } else {
    // Create new step
    const info = db.prepare(`
      INSERT INTO vendor_onboarding (vendorId, step, data, isComplete, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(vendorId, step, JSON.stringify(data), 1, now, now)
    
    return db.prepare('SELECT * FROM vendor_onboarding WHERE id = ?').get(Number(info.lastInsertRowid)) as VendorOnboardingRecord
  }
}

export function getOnboardingStep(vendorId: number, step: string): any | null {
  const db = getDatabase()
  const record = db.prepare('SELECT * FROM vendor_onboarding WHERE vendorId = ? AND step = ?').get(vendorId, step) as VendorOnboardingRecord | null
  
  if (!record) return null
  
  try {
    return JSON.parse(record.data)
  } catch {
    return null
  }
}

export function getAllOnboardingData(vendorId: number): OnboardingData {
  const db = getDatabase()
  const records = db.prepare('SELECT * FROM vendor_onboarding WHERE vendorId = ?').all(vendorId) as VendorOnboardingRecord[]
  
  const onboardingData: OnboardingData = {}
  
  records.forEach(record => {
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

export function isOnboardingComplete(vendorId: number): boolean {
  const db = getDatabase()
  const records = db.prepare('SELECT COUNT(*) as count FROM vendor_onboarding WHERE vendorId = ? AND isComplete = 1').get(vendorId) as { count: number }
  return records.count >= 7 // All 7 steps must be complete
}

export function getOnboardingProgress(vendorId: number): { completed: number; total: number; percentage: number } {
  const db = getDatabase()
  const records = db.prepare('SELECT COUNT(*) as count FROM vendor_onboarding WHERE vendorId = ? AND isComplete = 1').get(vendorId) as { count: number }
  const completed = records.count
  const total = 7
  const percentage = Math.round((completed / total) * 100)
  
  return { completed, total, percentage }
}