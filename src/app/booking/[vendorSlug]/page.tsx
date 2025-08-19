import { notFound } from 'next/navigation'
import BookingFlow from '@/components/booking/BookingFlow'

interface BookingPageProps {
  params: Promise<{
    vendorSlug: string
  }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { vendorSlug } = await params
  
  // Verify the vendor exists and get booking data
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vendor/public/${vendorSlug}?type=booking-options`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      notFound()
    }

    const vendorData = await response.json()
    
    return (
      <BookingFlow 
        vendorSlug={vendorSlug}
        vendorData={vendorData}
      />
    )
  } catch (error) {
    console.error('Error loading vendor for booking:', error)
    notFound()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BookingPageProps) {
  const { vendorSlug } = await params
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vendor/public/${vendorSlug}`
    )
    
    if (response.ok) {
      const vendorData = await response.json()
      return {
        title: `Book ${vendorData.vendor.displayName} - Event Services`,
        description: `Book event services with ${vendorData.vendor.displayName}. ${vendorData.vendor.headline}`,
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  return {
    title: 'Book Event Services',
    description: 'Book professional event services for your special occasion.',
  }
}