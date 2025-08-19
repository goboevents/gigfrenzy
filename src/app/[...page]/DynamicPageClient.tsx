'use client'

import { Builder } from '@builder.io/react'
import { BUILDER_API_KEY, BUILDER_MODEL } from '../../../builder-config'
import BuilderPage from '../../../components/BuilderPage'

// Initialize Builder.io
Builder.init(BUILDER_API_KEY)

interface DynamicPageClientProps {
  params: {
    page: string[]
  }
}

export default function DynamicPageClient({ params }: DynamicPageClientProps) {
  const urlPath = '/' + (params.page || []).join('/')
  
  return (
    <div>
      <BuilderPage model={BUILDER_MODEL} />
    </div>
  )
}
