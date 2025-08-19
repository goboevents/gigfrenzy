import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarDaysIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function BookingIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find & Book Event Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing vendors and book your perfect event with confidence
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you need?
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Catering, DJ, Photography..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where?
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, State"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When?
              </label>
              <div className="relative">
                <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Search Vendors
            </button>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Catering', icon: '🍽️', count: '150+ vendors' },
              { name: 'Photography', icon: '📸', count: '200+ vendors' },
              { name: 'DJ & Music', icon: '🎵', count: '100+ vendors' },
              { name: 'Venues', icon: '🏛️', count: '80+ venues' },
              { name: 'Flowers', icon: '💐', count: '90+ florists' },
              { name: 'Decorations', icon: '🎨', count: '120+ decorators' },
              { name: 'Transportation', icon: '🚗', count: '60+ services' },
              { name: 'Entertainment', icon: '🎭', count: '75+ performers' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/vendors?category=${category.name.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Vendors */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Vendors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* These would be populated from actual vendor data */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Sample Vendor {i}</h3>
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium ml-1">4.9</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    Professional event services with 10+ years of experience
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Starting at $500</span>
                    <Link
                      href={`/booking/sample-vendor-${i}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Search & Compare',
                description: 'Browse vendors and compare services, prices, and reviews'
              },
              {
                step: '2',
                title: 'Book Online',
                description: 'Select your service and book directly through our platform'
              },
              {
                step: '3',
                title: 'Vendor Confirms',
                description: 'The vendor reviews your request and confirms availability'
              },
              {
                step: '4',
                title: 'Enjoy Your Event',
                description: 'Relax and enjoy your special day with professional service'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}