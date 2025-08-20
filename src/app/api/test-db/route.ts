import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServiceRoleClient()
    
    // Test basic connection
    const { data, error } = await supabase
      .from('vendors')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        details: error
      }, { status: 500 })
    }
    
    // Test inserting a simple record
    const { data: insertData, error: insertError } = await supabase
      .from('vendors')
      .insert({
        business_name: 'Test Business',
        contact_name: 'Test Contact',
        email: 'test@example.com',
        business_type: 'Test'
      })
      .select()
      .single()
    
    if (insertError) {
      return NextResponse.json({
        status: 'error',
        message: 'Insert test failed',
        error: insertError.message,
        details: insertError
      }, { status: 500 })
    }
    
    // Clean up test record
    await supabase
      .from('vendors')
      .delete()
      .eq('id', insertData.id)
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection and operations working',
      data: {
        connection: 'OK',
        insert: 'OK',
        delete: 'OK'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}