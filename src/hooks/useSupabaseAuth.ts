'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient, getCurrentSession, getCurrentUser, type AuthUser } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  isLoading: boolean
  supabase: ReturnType<typeof createBrowserSupabaseClient>
}

export function useSupabaseAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    supabase: createBrowserSupabaseClient()
  })

  useEffect(() => {
    const supabase = authState.supabase

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await getCurrentSession()
      if (session?.user) {
        await updateUserState(session.user)
      }
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await updateUserState(session.user)
        } else if (event === 'SIGNED_OUT') {
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: false,
            user: null
          }))
        }
      }
    )

    getInitialSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const updateUserState = async (user: User) => {
    try {
      // Check if user is linked to a vendor
      const { data: vendorLink } = await authState.supabase
        .from('vendor_user_vendors')
        .select('vendor_id')
        .eq('user_id', user.id)
        .single()

      if (vendorLink) {
        const authUser: AuthUser = {
          userId: user.id,
          role: 'vendor', // For now, assume all users are vendors
          name: user.user_metadata?.full_name || user.email,
          email: user.email
        }

        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: authUser
        }))
      } else {
        // User exists but not linked to vendor
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null
        }))
      }
    } catch (error) {
      console.error('Error updating user state:', error)
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null
      }))
    }
  }

  return authState
}

// Convenience hook for just the user data
export function useUser() {
  const { user, isAuthenticated } = useSupabaseAuth()
  return { user, isAuthenticated }
}

// Hook for authentication actions
export function useAuthActions() {
  const { supabase } = useSupabaseAuth()

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  return {
    signIn,
    signUp,
    signOut,
    resetPassword
  }
}
