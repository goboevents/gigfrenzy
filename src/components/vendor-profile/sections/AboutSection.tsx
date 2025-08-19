import { 
  MapPinIcon, 
  PhoneIcon, 
  GlobeAltIcon, 
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Vendor {
  displayName: string
  headline: string
  bio: string
  location: string
  website: string
  phone: string
}

interface AboutSectionProps {
  vendor: Vendor
}

export default function AboutSection({ vendor }: AboutSectionProps) {
  return (
    <div className="space-y-8">
      {/* About Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About {vendor.displayName}</h2>
        
        {vendor.headline && (
          <p className="text-lg text-gray-700 mb-4 font-medium">{vendor.headline}</p>
        )}
        
        {vendor.bio ? (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">{vendor.bio}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No description available.</p>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Location</h4>
              <p className="text-gray-600">{vendor.location || 'Not specified'}</p>
            </div>
          </div>

          {/* Phone */}
          {vendor.phone && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <PhoneIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Phone</h4>
                <a 
                  href={`tel:${vendor.phone}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {vendor.phone}
                </a>
              </div>
            </div>
          )}

          {/* Website */}
          {vendor.website && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <GlobeAltIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Website</h4>
                <a 
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Visit Website
                </a>
              </div>
            </div>
          )}

          {/* Business Hours (placeholder for future implementation) */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Business Hours</h4>
              <p className="text-gray-600">Contact for availability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us (placeholder section) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose {vendor.displayName}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
            <span className="text-gray-700">Professional and reliable service</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
            <span className="text-gray-700">Competitive pricing</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
            <span className="text-gray-700">Local expertise</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
            <span className="text-gray-700">Customer satisfaction guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  )
}