'use client'

import { Builder, BuilderComponent } from '@builder.io/react'
import { useEffect, useState } from 'react'
import { BUILDER_API_KEY, BUILDER_MODEL } from '../../builder-config'

// Initialize Builder.io
Builder.init(BUILDER_API_KEY)

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

    // Fetch content from Builder.io if no content is provided
    const fetchContent = async () => {
      try {
        const content = await Builder.get(model, {
          userAttributes: {
            urlPath: window.location.pathname
          }
        }).promise()
        
        setBuilderContent(content)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [content, model])

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
