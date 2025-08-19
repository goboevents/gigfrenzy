import { notFound } from 'next/navigation'
import VendorProfile from '@/components/vendor-profile/VendorProfile'

interface VendorProfilePageProps {
  params: {
    slug: string
  }
}

export default async function VendorProfilePage({ params }: VendorProfilePageProps) {
  try {
    // Fetch vendor data based on slug
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vendor/public/${params.slug}`)
    
    if (!response.ok) {
      notFound()
    }

    const vendorData = await response.json()
    
    return <VendorProfile vendor={vendorData.vendor} />
  } catch (error) {
    console.error('Error fetching vendor profile:', error)
    notFound()
  }
}