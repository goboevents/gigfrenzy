import { GiftIcon, ClockIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface Offer {
  id: string
  title: string
  description: string
  discountPercent: number
  validUntil: string
}

interface OffersSectionProps {
  offers: Offer[]
}

export default function OffersSection({ offers }: OffersSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  const getDaysRemaining = (dateString: string) => {
    const today = new Date()
    const expiryDate = new Date(dateString)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <GiftIcon className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Offers</h3>
        <p className="text-gray-500">
          This vendor doesn't have any active offers at the moment. Check back later for special deals and promotions.
        </p>
      </div>
    )
  }

  // Separate active and expired offers
  const activeOffers = offers.filter(offer => !isExpired(offer.validUntil))
  const expiredOffers = offers.filter(offer => isExpired(offer.validUntil))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Special Offers & Deals</h2>
        <p className="text-gray-600">
          Take advantage of our current promotions and save on our services. Limited time offers available.
        </p>
      </div>

      {/* Active Offers */}
      {activeOffers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TagIcon className="h-5 w-5 text-green-600 mr-2" />
            Active Offers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeOffers.map((offer) => {
              const daysRemaining = getDaysRemaining(offer.validUntil)
              return (
                <div
                  key={offer.id}
                  className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200 p-6 relative overflow-hidden"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {offer.discountPercent}% OFF
                    </div>
                  </div>

                  {/* Offer Content */}
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{offer.description}</p>
                  </div>

                  {/* Expiry Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-orange-600">
                      <ClockIcon className="h-4 w-4" />
                      <span className="font-medium">
                        {daysRemaining === 0 ? 'Expires today!' : `${daysRemaining} days left`}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      Valid until {formatDate(offer.validUntil)}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium">
                    Claim This Offer
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Expired Offers (if any) */}
      {expiredOffers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-600 mr-2" />
            Past Offers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expiredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-6 opacity-75"
              >
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">{offer.title}</h4>
                  <p className="text-gray-600 text-sm">{offer.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Expired on {formatDate(offer.validUntil)}</span>
                  <span className="line-through">{offer.discountPercent}% OFF</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Promotions Info */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-3">Want More Deals?</h3>
        <p className="mb-4 opacity-90">
          Sign up for our newsletter to receive exclusive offers, seasonal promotions, and early access to special deals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
          />
          <button className="bg-white text-purple-600 px-6 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 transition-colors duration-200 font-medium">
            Subscribe
          </button>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Offer Terms & Conditions</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Offers cannot be combined with other promotions or discounts</p>
          <p>• Valid for new customers only unless otherwise specified</p>
          <p>• Offers are subject to availability and may be modified or cancelled at any time</p>
          <p>• Some restrictions may apply - contact us for full details</p>
          <p>• Offers expire at 11:59 PM on the specified end date</p>
        </div>
      </div>
    </div>
  )
}