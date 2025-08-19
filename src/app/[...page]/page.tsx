import { Builder } from '@builder.io/react'
import { BUILDER_API_KEY, BUILDER_MODEL } from '../../../builder-config'
import BuilderPage from '../../../components/BuilderPage'

// Initialize Builder.io
Builder.init(BUILDER_API_KEY)

interface PageProps {
  params: {
    page: string[]
  }
}

export default async function Page({ params }: PageProps) {
  const urlPath = '/' + (params.page || []).join('/')
  
  try {
    // Try to get content from Builder.io
    const content = await Builder.get(BUILDER_MODEL, {
      userAttributes: {
        urlPath: urlPath
      }
    }).promise()

    return <BuilderPage content={content} model={BUILDER_MODEL} />
  } catch (error) {
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
}
