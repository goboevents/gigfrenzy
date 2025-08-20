'use client'

import { useState, useEffect } from 'react'

interface User {
  userId: number
  role: 'vendor' | 'admin'
  name?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          if (userData.authenticated) {
            setAuthState({
              isAuthenticated: true,
              user: {
                userId: userData.userId,
                role: userData.role,
                name: userData.name
              },
              isLoading: false
            })
          } else {
            setAuthState({
              isAuthenticated: false,
              user: null,
              isLoading: false
            })
          }
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false
          })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        })
      }
    }

    checkAuth()
  }, [])

  return authState
}