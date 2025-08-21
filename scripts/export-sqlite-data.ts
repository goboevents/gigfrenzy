import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'app.db')
const exportDir = path.join(process.cwd(), 'data', 'export')

// Ensure export directory exists
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true })
}

async function exportData() {
  try {
    console.log('🔍 Connecting to SQLite database...')
    const db = new Database(dbPath)
    
    console.log('📊 Exporting vendors...')
    const vendors = db.prepare('SELECT * FROM vendors').all()
    fs.writeFileSync(
      path.join(exportDir, 'vendors.json'), 
      JSON.stringify(vendors, null, 2)
    )
    console.log(`✅ Exported ${vendors.length} vendors`)

    console.log('📊 Exporting vendor profiles...')
    const vendorProfiles = db.prepare('SELECT * FROM vendor_profiles').all()
    fs.writeFileSync(
      path.join(exportDir, 'vendor_profiles.json'), 
      JSON.stringify(vendorProfiles, null, 2)
    )
    console.log(`✅ Exported ${vendorProfiles.length} vendor profiles`)

    console.log('📊 Exporting vendor services...')
    const vendorServices = db.prepare('SELECT * FROM vendor_services').all()
    fs.writeFileSync(
      path.join(exportDir, 'vendor_services.json'), 
      JSON.stringify(vendorServices, null, 2)
    )
    console.log(`✅ Exported ${vendorServices.length} vendor services`)

    console.log('📊 Exporting vendor service areas...')
    const vendorServiceAreas = db.prepare('SELECT * FROM vendor_service_areas').all()
    fs.writeFileSync(
      path.join(exportDir, 'vendor_service_areas.json'), 
      JSON.stringify(vendorServiceAreas, null, 2)
    )
    console.log(`✅ Exported ${vendorServiceAreas.length} vendor service areas`)

    console.log('📊 Exporting vendor availability...')
    const vendorAvailability = db.prepare('SELECT * FROM vendor_availability').all()
    fs.writeFileSync(
      path.join(exportDir, 'vendor_availability.json'), 
      JSON.stringify(vendorAvailability, null, 2)
    )
    console.log(`✅ Exported ${vendorAvailability.length} vendor availability records`)

    console.log('📊 Exporting vendor users...')
    const vendorUsers = db.prepare('SELECT * FROM vendor_users').all()
    fs.writeFileSync(
      path.join(exportDir, 'vendor_users.json'), 
      JSON.stringify(vendorUsers, null, 2)
    )
    console.log(`✅ Exported ${vendorUsers.length} vendor users`)

    console.log('📊 Exporting bookings...')
    const bookings = db.prepare('SELECT * FROM bookings').all()
    fs.writeFileSync(
      path.join(exportDir, 'bookings.json'), 
      JSON.stringify(bookings, null, 2)
    )
    console.log(`✅ Exported ${bookings.length} bookings`)

    console.log('📊 Exporting packages...')
    const packages = db.prepare('SELECT * FROM packages').all()
    fs.writeFileSync(
      path.join(exportDir, 'packages.json'), 
      JSON.stringify(packages, null, 2)
    )
    console.log(`✅ Exported ${packages.length} packages`)

    console.log('📊 Exporting services...')
    const services = db.prepare('SELECT * FROM services').all()
    fs.writeFileSync(
      path.join(exportDir, 'services.json'), 
      JSON.stringify(services, null, 2)
    )
    console.log(`✅ Exported ${services.length} services`)

    db.close()
    
    console.log('\n🎉 Data export completed successfully!')
    console.log(`📁 Exported data saved to: ${exportDir}`)
    
    // Create summary
    const summary = {
      exportDate: new Date().toISOString(),
      tables: {
        vendors: vendors.length,
        vendor_profiles: vendorProfiles.length,
        vendor_services: vendorServices.length,
        vendor_service_areas: vendorServiceAreas.length,
        vendor_availability: vendorAvailability.length,
        vendor_users: vendorUsers.length,
        bookings: bookings.length,
        packages: packages.length,
        services: services.length
      }
    }
    
    fs.writeFileSync(
      path.join(exportDir, 'export-summary.json'), 
      JSON.stringify(summary, null, 2)
    )
    
    console.log('\n📋 Export Summary:')
    Object.entries(summary.tables).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} records`)
    })
    
  } catch (error) {
    console.error('❌ Error exporting data:', error)
    process.exit(1)
  }
}

exportData()
