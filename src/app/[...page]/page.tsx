import DynamicPage from '../../components/DynamicPage'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ page: string[] }> }) {
  const resolved = await params
  
  // Exclude API routes from the catch-all route
  if (resolved.page && resolved.page[0] === 'api') {
    notFound()
  }
  
  return <DynamicPage params={resolved} />
}
