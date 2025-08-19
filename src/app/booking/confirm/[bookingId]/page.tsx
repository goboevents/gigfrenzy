import { notFound } from 'next/navigation'
import BookingConfirmation from '@/components/booking/BookingFlow/BookingConfirmation'

interface BookingConfirmPageProps {
  params: Promise<{
    bookingId: string
  }>
}

export default async function BookingConfirmPage({ params }: BookingConfirmPageProps) {
  const { bookingId } = await params
  
  const bookingIdNum = parseInt(bookingId)
  if (isNaN(bookingIdNum)) {
    notFound()
  }

  // Fetch booking details
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/booking/${bookingIdNum}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      notFound()
    }

    const bookingData = await response.json()
    
    // Fetch vendor data using vendorId
    const vendorResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vendor/${bookingData.booking.vendorId}/public`
    )
    
    const vendorData = vendorResponse.ok ? await vendorResponse.json() : null
    
    return (
      <BookingConfirmation 
        bookingId={bookingIdNum}
        vendorData={vendorData}
        bookingData={bookingData.booking}
      />
    )
  } catch (error) {
    console.error('Error loading booking confirmation:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: BookingConfirmPageProps) {
  const { bookingId } = await params
  
  return {
    title: `Booking Confirmation #${bookingId}`,
    description: 'Your booking has been confirmed. View your booking details and next steps.',
  }
}