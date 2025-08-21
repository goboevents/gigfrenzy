import { VendorProfile } from '@/components/vendor-profile'

export default function TestVendorPage() {
  // Mock vendor data for testing
  const mockVendor = {
    id: "1",
    slug: "dj-mixmaster",
    displayName: "DJ MixMaster Pro",
    headline: "Professional DJ Services for Unforgettable Events",
    bio: "With over 10 years of experience in the entertainment industry, DJ MixMaster Pro delivers exceptional music experiences for all types of events.",
    location: "Los Angeles, CA",
    website: "https://mixmasterpro.com",
    phone: "+1-555-0123",
    avatarUrl: null,
    coverImageUrl: null,
    rating: 4.8,
    reviewCount: 12,
    services: [
      {
        id: "1",
        title: "Basic DJ Package",
        description: "Perfect for small gatherings and intimate events.",
        priceCents: 50000,
        type: "package",
        duration: "3 hours",
        features: ["3 hours DJ set", "Basic sound system", "Curated playlist"],
        isPopular: false,
        pricingModel: "fixed",
        hourlyRate: null,
        depositRequired: true,
        depositPercentage: 25,
        cancellationPolicy: "Full refund if cancelled 7+ days before event."
      }
    ],
    serviceAreas: [
      {
        id: "1",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001"
      }
    ],
    offers: [],
    reviews: []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Vendor Profile Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Mock Vendor Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(mockVendor, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold p-6 border-b">Vendor Profile Component</h2>
          <VendorProfile vendor={mockVendor} />
        </div>
      </div>
    </div>
  )
}
