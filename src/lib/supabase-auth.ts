import { createServerSupabaseClient } from './supabase'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export type AuthUser = { 
  userId: string; 
  role: 'vendor' | 'admin';
  email?: string;
  name?: string;
}

// Server-side Supabase client for API routes
export async function createServerSupabaseClientFromCookies() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

// Get authenticated user from request (replaces getAuthUserFromRequest)
export async function getAuthUserFromRequest(): Promise<AuthUser | null> {
  try {
    const supabase = await createServerSupabaseClientFromCookies()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Check if user is linked to a vendor
    const { data: vendorLink } = await supabase
      .from('vendor_user_vendors')
      .select('vendor_id')
      .eq('user_id', user.id)
      .single()

    if (!vendorLink) {
      return null
    }

    // For now, assume all users are vendors (you can add admin logic later)
    return {
      userId: user.id,
      role: 'vendor',
      email: user.email,
      name: user.user_metadata?.full_name || user.email
    }
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

// Require authenticated user (replaces requireAuthUser)
export async function requireAuthUser(): Promise<AuthUser> {
  const auth = await getAuthUserFromRequest()
  if (!auth) {
    throw new Error('UNAUTHORIZED')
  }
  return auth
}

// Get vendor ID for user (replaces getVendorIdForUser)
export async function getVendorIdForUser(userId: string): Promise<number | null> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('vendor_user_vendors')
      .select('vendor_id')
      .eq('user_id', userId)
      .single()
    
    if (error || !data) {
      return null
    }
    
    return data.vendor_id
  } catch (error) {
    console.error('Error getting vendor ID:', error)
    return null
  }
}

// Create vendor user link
export async function createVendorUserLink(userId: string, vendorId: number): Promise<void> {
  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('vendor_user_vendors')
      .insert({
        user_id: userId,
        vendor_id: vendorId
      })
    
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error creating vendor user link:', error)
    throw error
  }
}

// Sign up new vendor user
export async function signUpVendorUser(email: string, password: string, userData: any): Promise<{ user: any; error: any }> {
  try {
    const supabase = createServerSupabaseClient()
    
    // Create the user account
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.name,
          role: 'vendor'
        }
      }
    })

    if (signUpError) {
      return { user: null, error: signUpError }
    }

    if (user) {
      // Create vendor record
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          business_name: userData.businessName,
          contact_name: userData.contactName,
          email: userData.email,
          phone: userData.phone || '',
          business_type: userData.businessType,
          website: userData.website || '',
          description: userData.description || ''
        })
        .select()
        .single()

      if (vendorError) {
        // If vendor creation fails, we should clean up the user
        await supabase.auth.admin.deleteUser(user.id)
        return { user: null, error: vendorError }
      }

      // Link user to vendor
      await createVendorUserLink(user.id, vendor.id)
    }

    return { user, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { user: null, error }
  }
}

// Sign in vendor user
export async function signInVendorUser(email: string, password: string): Promise<{ user: any; error: any }> {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { user: null, error }
    }

    // Verify user is linked to a vendor
    if (user) {
      const vendorId = await getVendorIdForUser(user.id)
      if (!vendorId) {
        await supabase.auth.signOut()
        return { user: null, error: { message: 'User not linked to any vendor' } }
      }
    }

    return { user, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { user: null, error }
  }
}

// Sign out user
export async function signOutUser(): Promise<{ error: any }> {
  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}
