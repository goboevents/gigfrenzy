#!/usr/bin/env tsx

// Check environment variables
console.log('🔍 Checking Environment Variables...\n')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY'
]

let allPresent = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`❌ ${varName}: MISSING`)
    allPresent = false
  }
})

console.log()

if (allPresent) {
  console.log('✅ All required environment variables are present')
  
  // Check if they look like valid Supabase values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (supabaseUrl.includes('supabase.co')) {
    console.log('✅ Supabase URL format looks correct')
  } else {
    console.log('⚠️  Supabase URL format may be incorrect')
  }
  
  if (anonKey.startsWith('eyJ') && anonKey.length > 100) {
    console.log('✅ Anon key format looks correct')
  } else {
    console.log('⚠️  Anon key format may be incorrect')
  }
  
  if (serviceKey.startsWith('eyJ') && serviceKey.length > 100) {
    console.log('✅ Service key format looks correct')
  } else {
    console.log('⚠️  Service key format may be incorrect')
  }
  
} else {
  console.log('❌ Some environment variables are missing')
  console.log('   Make sure to set them in your .env.local file')
  console.log('   Or in your Vercel deployment environment variables')
}

console.log('\n📋 Environment Check Complete')
