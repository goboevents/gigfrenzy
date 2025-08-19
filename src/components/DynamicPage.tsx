'use client'

interface DynamicPageProps {
  params: {
    page: string[]
  }
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const urlPath = '/' + (params.page || []).join('/')

  // Show a default page for now
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
