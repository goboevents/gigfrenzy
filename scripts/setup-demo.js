#!/usr/bin/env node

/**
 * Demo Vendor Setup Script
 * 
 * This script creates a demo vendor account with comprehensive data for testing.
 * Run it with: node scripts/setup-demo.js
 */

const { createDemoVendor, getDemoVendorData, clearDemoData } = require('../src/lib/repositories/demoDataRepository');

async function main() {
  const command = process.argv[2] || 'create';
  
  console.log('🎭 Demo Vendor Setup Script');
  console.log('============================\n');
  
  try {
    switch (command) {
      case 'create':
        console.log('Creating demo vendor...');
        const result = createDemoVendor();
        console.log('✅ Demo vendor created successfully!');
        console.log(`   Vendor ID: ${result.vendor.id}`);
        console.log(`   Profile Slug: ${result.vendorProfile.slug}`);
        console.log(`   Services Created: ${result.services}`);
        console.log('\n🔗 Quick Links:');
        console.log(`   Public Profile: /vendor/${result.vendorProfile.slug}`);
        console.log(`   Dashboard: /vendor-dashboard`);
        console.log(`   Demo Setup: /demo-setup`);
        break;
        
      case 'status':
        console.log('Checking demo vendor status...');
        const demoData = getDemoVendorData();
        if (demoData) {
          console.log('✅ Demo vendor exists');
          console.log(`   Business: ${demoData.vendor.businessName}`);
          console.log(`   Services: ${demoData.services.length}`);
          console.log(`   Reviews: ${demoData.reviews?.length || 0}`);
          console.log(`   Offers: ${demoData.offers?.length || 0}`);
        } else {
          console.log('❌ No demo vendor found');
        }
        break;
        
      case 'clear':
        console.log('Clearing demo data...');
        clearDemoData();
        console.log('✅ Demo data cleared successfully!');
        break;
        
      case 'help':
        console.log('Available commands:');
        console.log('  create  - Create a new demo vendor (default)');
        console.log('  status  - Check if demo vendor exists');
        console.log('  clear   - Remove all demo data');
        console.log('  help    - Show this help message');
        break;
        
      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Run "node scripts/setup-demo.js help" for available commands');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();