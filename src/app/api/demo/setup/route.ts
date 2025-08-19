import { NextRequest, NextResponse } from 'next/server'
import { createDemoVendor, getDemoVendorData, clearDemoData } from '@/lib/repositories/demoDataRepository'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'create':
        const result = createDemoVendor()
        return NextResponse.json({ 
          success: true, 
          message: 'Demo vendor created successfully',
          data: result
        })

      case 'clear':
        clearDemoData()
        return NextResponse.json({ 
          success: true, 
          message: 'Demo data cleared successfully' 
        })

      case 'status':
        const demoData = getDemoVendorData()
        return NextResponse.json({ 
          success: true, 
          exists: !!demoData,
          data: demoData 
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: create, clear, or status' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Demo setup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const demoData = getDemoVendorData()
    return NextResponse.json({ 
      success: true, 
      exists: !!demoData,
      data: demoData 
    })
  } catch (error) {
    console.error('Demo status error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}