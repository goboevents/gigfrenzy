'use client'

import { builder } from '@builder.io/sdk'
import { BUILDER_API_KEY } from '../../builder-config'
import { useEffect } from 'react'

interface BuilderProviderProps {
  children: React.ReactNode
}

export default function BuilderProvider({ children }: BuilderProviderProps) {
  useEffect(() => {
    // Configure Builder.io API key on client side
    if (typeof window !== 'undefined') {
      // Set the API key for the builder instance
      builder.apiKey = BUILDER_API_KEY
    }
  }, [])

  return <>{children}</>
}
