// Test Supabase Connection
// Run this with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT FOUND')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n🔌 Testing connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('vendors')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "vendors" does not exist')) {
        console.log('⚠️  Database tables not created yet. Please run the SQL setup script first.')
        console.log('📋 Go to: SQL Editor → New Query → Paste supabase-setup.sql → Run')
        return
      }
      throw error
    }
    
    console.log('✅ Connection successful!')
    console.log('✅ Database tables are ready!')
    
    // Test authentication
    console.log('\n🔐 Testing authentication...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('⚠️  Auth test failed:', authError.message)
    } else {
      console.log('✅ Authentication system ready!')
    }
    
    console.log('\n🎉 Supabase setup is complete and working!')
    console.log('🚀 You can now run: npm run dev')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check your API keys are correct')
    console.log('2. Ensure your project is active in Supabase')
    console.log('3. Check the Supabase dashboard for any errors')
  }
}

testConnection()