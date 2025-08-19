'use client'

import { Builder } from '@builder.io/react'
import { BUILDER_API_KEY } from '../../builder-config'
import { useEffect } from 'react'

interface BuilderProviderProps {
  children: React.ReactNode
}

export default function BuilderProvider({ children }: BuilderProviderProps) {
  useEffect(() => {
    // Initialize Builder.io only on client side
    if (typeof window !== 'undefined') {
      Builder.init(BUILDER_API_KEY)
    }
  }, [])

  return <>{children}</>
}
