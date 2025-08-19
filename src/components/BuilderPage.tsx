'use client'

import { BuilderComponent } from '@builder.io/react'
import { useEffect, useState } from 'react'
import { BUILDER_MODEL } from '../../builder-config'

interface BuilderPageProps {
  content?: any
  model?: string
}

export default function BuilderPage({ content, model = BUILDER_MODEL }: BuilderPageProps) {
  const [builderContent, setBuilderContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (content) {
      setBuilderContent(content)
      setLoading(false)
      return
    }

    setLoading(false)
  }, [content])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!builderContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No content found</div>
      </div>
    )
  }

  return (
    <div>
      <BuilderComponent
        model={model}
        content={builderContent}
      />
    </div>
  )
}
