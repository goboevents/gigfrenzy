#!/usr/bin/env tsx

import fetch from 'node-fetch'

async function testLoginAPI() {
  try {
    console.log('🧪 Testing login API endpoint...')
    
    const loginData = {
      email: 'dj@mixmasterpro.com',
      password: 'password123'
    }
    
    console.log('📤 Sending login request...')
    console.log('   Email:', loginData.email)
    console.log('   Password:', loginData.password)
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    
    console.log('\n📊 Response Status:', response.status)
    console.log('   Status Text:', response.statusText)
    
    const responseText = await response.text()
    console.log('\n📄 Response Body:', responseText)
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText)
        console.log('\n✅ Login successful!')
        console.log('   User ID:', data.id)
        console.log('   Email:', data.email)
        console.log('   Name:', data.name)
        console.log('   Role:', data.role)
      } catch (parseError) {
        console.log('⚠️  Response is not valid JSON')
      }
    } else {
      console.log('\n❌ Login failed')
      console.log('   Status:', response.status)
      try {
        const errorData = JSON.parse(responseText)
        console.log('   Error:', errorData.error)
      } catch (parseError) {
        console.log('   Error response is not valid JSON')
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing login API:', error)
  }
}

// Run the test
testLoginAPI()
  .then(() => {
    console.log('\n✅ Login API test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Login API test failed:', error)
    process.exit(1)
  })
