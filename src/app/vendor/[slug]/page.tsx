import { notFound } from 'next/navigation'
import VendorProfile from '@/components/vendor-profile/VendorProfile'

interface VendorProfilePageProps {
  params: {
    slug: string
  }
}

export default async function VendorProfilePage({ params }: VendorProfilePageProps) {
  try {
    // Construct absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
    const response = await fetch(`${baseUrl}/api/vendor/public/${params.slug}`, {
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