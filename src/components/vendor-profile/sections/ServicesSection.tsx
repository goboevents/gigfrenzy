import { CurrencyDollarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface Service {
  id: string
  title: string
  description: string
  priceCents: number
}

interface ServicesSectionProps {
  services: Service[]
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Services & Pricing</h2>
        <p className="text-gray-600">
          Browse our comprehensive range of services designed to meet your needs.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            {/* Service Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(service.priceCents)}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Starting Price
                </span>
              </div>
            </div>

            {/* Service Description */}
            <p className="text-gray-600 mb-4 leading-relaxed">
              {service.description}
            </p>

            {/* Service Features (placeholder) */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Professional service</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Quality guaranteed</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Flexible scheduling</span>
              </div>
            </div>

            {/* Call to Action */}
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium">
              Get Quote
            </button>
          </div>
        ))}
      </div>

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