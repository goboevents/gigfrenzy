import VendorProfile from '@/components/vendor-profile/VendorProfile'

// Sample vendor data for demo
const demoVendor = {
  id: '1',
  slug: 'acme-cleaning',
  displayName: 'Acme Professional Cleaning Services',
  headline: 'Professional Cleaning Solutions for Homes & Businesses',
  bio: 'Acme Professional Cleaning Services has been providing exceptional cleaning solutions for over 15 years. We specialize in residential and commercial cleaning, with a focus on eco-friendly products and attention to detail. Our team of certified professionals is committed to delivering outstanding results that exceed your expectations.',
  location: 'San Francisco, CA',
  website: 'https://acmecleaning.com',
  phone: '(555) 123-4567',
  avatarUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=face',
  coverImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop',
  rating: 4.8,
  reviewCount: 127,
  services: [
    {
      id: '1',
      title: 'Residential Deep Cleaning',
      description: 'Comprehensive deep cleaning service for homes, including kitchen, bathrooms, living areas, and bedrooms. Perfect for move-in/move-out or seasonal cleaning.',
      priceCents: 15000,
      type: 'service',
      duration: 'per event',
      features: ['Deep cleaning', 'Eco-friendly products', 'Move-in/move-out', 'Seasonal cleaning'],
      isPopular: true,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: true,
      depositPercentage: 25,
      cancellationPolicy: '24-hour notice required'
    },
    {
      id: '2',
      title: 'Commercial Office Cleaning',
      description: 'Regular office cleaning services including dusting, vacuuming, sanitizing, and trash removal. Available daily, weekly, or monthly.',
      priceCents: 25000,
      type: 'service',
      duration: 'per event',
      features: ['Dusting', 'Vacuuming', 'Sanitizing', 'Trash removal'],
      isPopular: false,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: true,
      depositPercentage: 25,
      cancellationPolicy: '24-hour notice required'
    },
    {
      id: '3',
      title: 'Carpet & Upholstery Cleaning',
      description: 'Professional deep cleaning for carpets, rugs, and upholstered furniture using eco-friendly cleaning solutions.',
      priceCents: 8000,
      type: 'service',
      duration: 'per event',
      features: ['Deep cleaning', 'Eco-friendly solutions', 'Carpet cleaning', 'Upholstery cleaning'],
      isPopular: false,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: true,
      depositPercentage: 25,
      cancellationPolicy: '24-hour notice required'
    }
  ],
  serviceAreas: [
    { id: '1', city: 'San Francisco', state: 'CA', zipCode: '94102' },
    { id: '2', city: 'San Francisco', state: 'CA', zipCode: '94103' },
    { id: '3', city: 'San Francisco', state: 'CA', zipCode: '94104' },
    { id: '4', city: 'Oakland', state: 'CA', zipCode: '94601' },
    { id: '5', city: 'Berkeley', state: 'CA', zipCode: '94701' }
  ],
  offers: [
    {
      id: '1',
      title: 'New Customer Special',
      description: 'Get 20% off your first cleaning service. Valid for new customers only.',
      discountPercent: 20,
      validUntil: '2024-12-31'
    },
    {
      id: '2',
      title: 'Spring Cleaning Package',
      description: 'Book our spring cleaning package and get 15% off regular pricing. Includes deep cleaning of all rooms.',
      discountPercent: 15,
      validUntil: '2024-06-30'
    }
  ],
  reviews: [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      rating: 5,
      comment: 'Acme Cleaning did an amazing job on our move-out cleaning. The team was professional, thorough, and left our apartment spotless. Highly recommend!',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      customerName: 'Michael Chen',
      rating: 5,
      comment: 'We\'ve been using Acme for our office cleaning for over a year now. Consistent quality, reliable service, and great communication. They\'ve become an essential part of our business.',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      customerName: 'Emily Rodriguez',
      rating: 4,
      comment: 'Great service and very thorough. The team was respectful of our home and did an excellent job. Will definitely use them again.',
      createdAt: '2024-01-05'
    },
    {
      id: '4',
      customerName: 'David Thompson',
      rating: 5,
      comment: 'Outstanding deep cleaning service. Our house looks and smells amazing. The attention to detail was impressive.',
      createdAt: '2024-01-01'
    }
  ]
}

export default function VendorProfileDemoPage() {
  return (
    <div>
      <VendorProfile vendor={demoVendor} />
    </div>
  )
}