#!/usr/bin/env node

const Database = require('better-sqlite3')
const path = require('path')

// Connect to the database
const dbPath = path.join(__dirname, '..', 'data', 'app.db')
const db = new Database(dbPath)

console.log('🔍 Testing database structure...\n')

try {
  // Check vendors table
  console.log('📋 Vendors:')
  const vendors = db.prepare('SELECT id, businessName, email FROM vendors').all()
  vendors.forEach(v => console.log(`  ID: ${v.id}, Name: ${v.businessName}, Email: ${v.email}`))
  
  console.log('\n👤 Vendor Users:')
  const users = db.prepare('SELECT id, email, name FROM vendor_users').all()
  users.forEach(u => console.log(`  ID: ${u.id}, Email: ${u.email}, Name: ${u.name}`))
  
  console.log('\n🔗 Vendor-User Links:')
  const links = db.prepare('SELECT * FROM vendor_user_vendors').all()
  links.forEach(l => console.log(`  UserID: ${l.userId}, VendorID: ${l.vendorId}`))
  
  console.log('\n🎵 Vendor Services:')
  const services = db.prepare('SELECT id, title, type, features, isActive, isPopular FROM vendor_services').all()
  services.forEach(s => {
    console.log(`  ID: ${s.id}, Title: ${s.title}, Type: ${s.type}`)
    console.log(`    Features (raw): ${s.features}`)
    console.log(`    Features type: ${typeof s.features}`)
    try {
      const parsed = JSON.parse(s.features)
      console.log(`    Features (parsed): ${JSON.stringify(parsed)}`)
      console.log(`    Is array: ${Array.isArray(parsed)}`)
    } catch (e) {
      console.log(`    Features parse error: ${e.message}`)
    }
    console.log(`    Active: ${s.isActive}, Popular: ${s.isPopular}`)
    console.log('')
  })
  
  console.log('\n📍 Service Areas:')
  const areas = db.prepare('SELECT city, state, zipCode FROM vendor_service_areas').all()
  areas.forEach(a => console.log(`  ${a.city}, ${a.state} ${a.zipCode}`))
  
  console.log('\n⏰ Availability:')
  const availability = db.prepare('SELECT * FROM vendor_availability').all()
  availability.forEach(a => console.log(`  VendorID: ${a.vendorId}, Days: ${a.monday ? 'M' : '-'}${a.tuesday ? 'T' : '-'}${a.wednesday ? 'W' : '-'}${a.thursday ? 'T' : '-'}${a.friday ? 'F' : '-'}${a.saturday ? 'S' : '-'}${a.sunday ? 'S' : '-'}, Hours: ${a.startTime}-${a.endTime}`))
  
} catch (error) {
  console.error('❌ Error:', error)
} finally {
  db.close()
}

console.log('\n✅ Database test completed!')
