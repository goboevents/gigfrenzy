#!/usr/bin/env tsx

import { getDatabase } from '../src/lib/db'

async function cleanupTestData() {
  console.log('🧹 Starting cleanup of test data...')
  
  const db = getDatabase()
  
  try {
    // Start transaction
    db.exec('BEGIN TRANSACTION')
    
    // Find the test vendor by email
    const vendor = db.prepare('SELECT id FROM vendors WHERE email = ?').get('dj@mixmasterpro.com') as { id: number } | undefined
    
    if (vendor) {
      const vendorId = vendor.id
      console.log(`🗑️  Cleaning up vendor with ID: ${vendorId}`)
      
      // Delete in reverse order of dependencies
      // 1. Delete availability
      db.prepare('DELETE FROM vendor_availability WHERE vendorId = ?').run(vendorId)
      console.log('✅ Deleted vendor availability')
      
      // 2. Delete service areas
      db.prepare('DELETE FROM vendor_service_areas WHERE vendorId = ?').run(vendorId)
      console.log('✅ Deleted service areas')
      
      // 3. Delete services
      db.prepare('DELETE FROM vendor_services WHERE vendorId = ?').run(vendorId)
      console.log('✅ Deleted vendor services')
      
      // 4. Delete profile
      db.prepare('DELETE FROM vendor_profiles WHERE vendorId = ?').run(vendorId)
      console.log('✅ Deleted vendor profile')
      
      // 5. Delete user-vendor link
      db.prepare('DELETE FROM vendor_user_vendors WHERE vendorId = ?').run(vendorId)
      console.log('✅ Deleted user-vendor link')
      
      // 6. Delete vendor
      db.prepare('DELETE FROM vendors WHERE id = ?').run(vendorId)
      console.log('✅ Deleted vendor')
    } else {
      console.log('ℹ️  No test vendor found to clean up')
    }
    
    // Also clean up the vendor user by email
    const vendorUser = db.prepare('SELECT id FROM vendor_users WHERE email = ?').get('dj@mixmasterpro.com') as { id: number } | undefined
    
    if (vendorUser) {
      const userId = vendorUser.id
      console.log(`🗑️  Cleaning up vendor user with ID: ${userId}`)
      
      // Delete user-vendor link first
      db.prepare('DELETE FROM vendor_user_vendors WHERE userId = ?').run(userId)
      console.log('✅ Deleted user-vendor link')
      
      // Delete vendor user
      db.prepare('DELETE FROM vendor_users WHERE id = ?').run(userId)
      console.log('✅ Deleted vendor user')
    } else {
      console.log('ℹ️  No test vendor user found to clean up')
    }
    
    // Commit transaction
    db.exec('COMMIT')
    
    console.log('🎉 Test data cleanup completed successfully!')
    
  } catch (error) {
    // Rollback transaction on error
    db.exec('ROLLBACK')
    console.error('❌ Error during cleanup:', error)
    throw error
  }
}

// Run the cleanup function
cleanupTestData()
  .then(() => {
    console.log('✅ Cleanup completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  })
