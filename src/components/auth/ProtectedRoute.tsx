'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'vendor' | 'admin'
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'vendor',
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useSupabaseAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    } else if (!isLoading && isAuthenticated && user && user.role !== requiredRole) {
      // Redirect to appropriate page if user doesn't have required role
      if (requiredRole === 'admin' && user.role === 'vendor') {
        router.push('/vendor-dashboard')
      } else {
        router.push('/')
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  if (user && user.role !== requiredRole) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}