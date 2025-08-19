import { MapPinIcon, GlobeAltIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface ServiceArea {
  id: string
  city: string
  state: string
  zipCode: string
}

interface ServiceAreasSectionProps {
  serviceAreas: ServiceArea[]
}

export default function ServiceAreasSection({ serviceAreas }: ServiceAreasSectionProps) {
  if (!serviceAreas || serviceAreas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <MapPinIcon className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Service Areas Not Specified</h3>
        <p className="text-gray-500">
          This vendor hasn't specified their service areas yet. Please contact them directly to confirm availability in your location.
        </p>
      </div>
    )
  }

  // Group service areas by state for better organization
  const areasByState = serviceAreas.reduce((acc, area) => {
    if (!acc[area.state]) {
      acc[area.state] = []
    }
    acc[area.state].push(area)
    return acc
  }, {} as Record<string, ServiceArea[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Areas</h2>
        <p className="text-gray-600">
          We proudly serve customers in the following locations. Contact us to confirm availability in your area.
        </p>
      </div>

      {/* Service Areas by State */}
      <div className="space-y-6">
        {Object.entries(areasByState).map(([state, areas]) => (
          <div key={state} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="h-6 w-6 text-blue-600 mr-2" />
              {state}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-900">{area.city}</span>
                    {area.zipCode && (
                      <span className="text-sm text-gray-500 ml-1">({area.zipCode})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Coverage Information */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Service Coverage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Primary Service Area</h4>
            <p className="text-blue-800 text-sm">
              We provide full-service coverage within our primary service areas, including emergency services and same-day availability for urgent requests.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Extended Coverage</h4>
            <p className="text-blue-800 text-sm">
              For locations outside our primary service areas, we may offer services with additional travel fees. Contact us to discuss your specific needs.
            </p>
          </div>
        </div>
      </div>

      {/* Travel Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel & Coverage Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Primary Areas</h4>
            <p className="text-sm text-gray-600">
              Full service coverage with standard pricing
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <MapPinIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Extended Areas</h4>
            <p className="text-sm text-gray-600">
              Service available with travel fees
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <GlobeAltIcon className="h-8 w-8 text-gray-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Custom Requests</h4>
            <p className="text-sm text-gray-600">
              Contact us for special arrangements
            </p>
          </div>
        </div>
      </div>

      {/* Contact for Coverage */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-3">Not in Our Service Area?</h3>
        <p className="mb-4 opacity-90">
          We're always expanding our coverage areas. If you're not currently in our service area, 
          let us know and we'll notify you when we start serving your location.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200 font-medium">
            Request Coverage
          </button>
          <button className="bg-transparent text-white px-4 py-2 rounded-md border border-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200 font-medium">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}