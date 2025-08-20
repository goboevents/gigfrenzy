import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import VendorProfile from '@/components/vendor-profile/VendorProfile'

interface VendorProfilePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function VendorProfilePage({ params }: VendorProfilePageProps) {
  try {
    const { slug } = await params
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = process?.env?.NODE_ENV === 'development' ? 'http' : 'https'
    
    // Construct absolute URL for server-side fetch
    const baseUrl = `${protocol}://${host}`
    const response = await fetch(`${baseUrl}/api/vendor/public/${slug}`, {
      cache: 'no-store' // Ensure fresh data
    })
    
    if (!response.ok) {
      console.error(`Vendor profile fetch failed: ${response.status} ${response.statusText}`)
      notFound()
    }

    const vendorData = await response.json()
    
    if (!vendorData.vendor) {
      console.error('No vendor data in response:', vendorData)
      notFound()
    }
    
    return <VendorProfile vendor={vendorData.vendor} />
  } catch (error) {
    console.error('Error fetching vendor profile:', error)
    notFound()
  }
}