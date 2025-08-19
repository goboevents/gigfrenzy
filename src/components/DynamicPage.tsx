'use client'

import { builder } from '@builder.io/sdk'
import { BUILDER_API_KEY, BUILDER_MODEL } from '../../builder-config'
import type { BuilderContent } from '@builder.io/sdk'
import BuilderPage from './BuilderPage'
import { useEffect, useState } from 'react'

interface DynamicPageProps {
  params: {
    page: string[]
  }
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const [content, setContent] = useState<BuilderContent | null>(null)
  const [loading, setLoading] = useState(true)
  const urlPath = '/' + (params.page || []).join('/')

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Try to get content from Builder.io
        const builderContent = await builder.get(BUILDER_MODEL, {
          apiKey: BUILDER_API_KEY,
          userAttributes: {
            urlPath: urlPath
          }
        }).promise()

        if (builderContent) {
          setContent(builderContent)
        }
      } catch {
        console.log('No Builder.io content found for path:', urlPath)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [urlPath])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (content) {
    return <BuilderPage content={content} model={BUILDER_MODEL} />
  }

  // If no content is found, show a default page
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to GigFrenzy</h1>
        <p className="text-gray-600 mb-8">Your event management platform</p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            This page is ready for Builder.io content
          </p>
          <p className="text-sm text-gray-500">
            URL Path: {urlPath}
          </p>
        </div>
      </div>
    </div>
  )
}
