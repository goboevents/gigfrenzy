import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { businessName, contactName, email, businessType } = body
    
    if (!businessName || !contactName || !email || !businessType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Validate the data
    // 2. Save to database
    // 3. Send confirmation emails
    // 4. Log the submission
    
    console.log('Vendor signup received:', body)

    // Return success response
    return NextResponse.json({
      message: 'Vendor application submitted successfully',
      vendor: {
        id: Date.now(), // Temporary ID
        businessName,
        contactName,
        email,
        phone: body.phone || '',
        businessType,
        description: body.description || '',
        submittedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error processing vendor signup:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Vendor signup endpoint',
    method: 'POST',
    requiredFields: ['businessName', 'contactName', 'email', 'businessType']
  })
}
