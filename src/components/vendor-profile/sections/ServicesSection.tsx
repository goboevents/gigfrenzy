import { CurrencyDollarIcon, ClockIcon, CheckCircleIcon, TagIcon, StarIcon } from '@heroicons/react/24/outline'

interface VendorService {
  id: string | number
  title: string
  description: string
  priceCents: number
  type: string
  duration: string
  features: string[]
  isPopular: boolean
  pricingModel: string
  hourlyRate: number | null
  depositRequired: boolean
  depositPercentage: number
  cancellationPolicy: string
}

interface ServicesSectionProps {
  services: VendorService[]
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceCents / 100)
  }

  if (!services || services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <CurrencyDollarIcon className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Available</h3>
        <p className="text-gray-500">
          This vendor hasn't added any services yet. Please contact them directly for more information.
        </p>
      </div>
    )
  }

  // Separate services and packages
  const serviceItems = services.filter(s => s.type === 'service')
  const packageItems = services.filter(s => s.type === 'package')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Services & Pricing</h2>
        <p className="text-gray-600">
          Browse our comprehensive range of services and packages designed to meet your needs.
        </p>
      </div>

      {/* Services */}
      {serviceItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
            Individual Services
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceItems.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Service Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                    {service.isPopular && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <StarIcon className="h-3 w-3 mr-1" />
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(service.priceCents)}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {service.duration}
                    </span>
                  </div>
                </div>

                {/* Service Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Service Features */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Call to Action */}
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium">
                  Get Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Packages */}
      {packageItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TagIcon className="h-5 w-5 text-purple-600 mr-2" />
            Service Packages
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packageItems.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-lg shadow-sm border-2 p-6 hover:shadow-md transition-shadow duration-200 ${
                  pkg.isPopular ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                }`}
              >
                {/* Package Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                    {pkg.isPopular && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <StarIcon className="h-3 w-3 mr-1" />
                        Most Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">
                      {formatPrice(pkg.priceCents)}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {pkg.duration}
                    </span>
                  </div>
                </div>

                {/* Package Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Package Features */}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Call to Action */}
                <button className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                  pkg.isPopular 
                    ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2' 
                    : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                }`}>
                  {pkg.isPopular ? 'Choose This Package' : 'Select Package'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Need a Custom Solution?</h3>
        <p className="text-blue-800 mb-4">
          Don't see exactly what you need? We offer custom services tailored to your specific requirements. 
          Contact us to discuss your project and get a personalized quote.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium">
            Request Custom Quote
          </button>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium">
            Schedule Consultation
          </button>
        </div>
      </div>
    </div>
  )
}