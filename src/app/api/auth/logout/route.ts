import { NextRequest, NextResponse } from 'next/server'
import { signOutUser } from '@/lib/supabase-auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { error } = await signOutUser()
    
    if (error) {
      console.error('Logout error:', error)
      // Even if there's an error, we'll still return success to clear the client state
    }

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (e) {
    console.error('Logout error', e)
    // Return success even on error to ensure client state is cleared
    return NextResponse.json({ message: 'Logged out successfully' })
  }
}

