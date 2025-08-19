import { NextRequest, NextResponse } from 'next/server'

// Mock vendor data for demonstration
const mockVendors = {
  'acme-cleaning': {
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
        priceCents: 15000
      },
      {
        id: '2',
        title: 'Commercial Office Cleaning',
        description: 'Regular office cleaning services including dusting, vacuuming, sanitizing, and trash removal. Available daily, weekly, or monthly.',
        priceCents: 25000
      },
      {
        id: '3',
        title: 'Carpet & Upholstery Cleaning',
        description: 'Professional deep cleaning for carpets, rugs, and upholstered furniture using eco-friendly cleaning solutions.',
        priceCents: 8000
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
  },
  'premium-plumbing': {
    id: '2',
    slug: 'premium-plumbing',
    displayName: 'Premium Plumbing & HVAC',
    headline: 'Expert Plumbing & HVAC Services You Can Trust',
    bio: 'Premium Plumbing & HVAC is your trusted partner for all plumbing and heating/cooling needs. With over 20 years of experience, our licensed technicians provide reliable, professional service with a 100% satisfaction guarantee. We offer 24/7 emergency services and competitive pricing.',
    location: 'Austin, TX',
    website: 'https://premiumplumbing.com',
    phone: '(555) 987-6543',
    avatarUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&h=150&fit=crop&crop=face',
    coverImageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 89,
    services: [
      {
        id: '1',
        title: 'Emergency Plumbing Repair',
        description: '24/7 emergency plumbing services for burst pipes, clogged drains, water heater issues, and other urgent plumbing problems.',
        priceCents: 12000
      },
      {
        id: '2',
        title: 'HVAC Installation & Repair',
        description: 'Complete HVAC system installation, maintenance, and repair services for residential and commercial properties.',
        priceCents: 45000
      },
      {
        id: '3',
        title: 'Drain Cleaning & Unclogging',
        description: 'Professional drain cleaning services using advanced equipment to clear stubborn clogs and restore proper drainage.',
        priceCents: 15000
      }
    ],
    serviceAreas: [
      { id: '1', city: 'Austin', state: 'TX', zipCode: '78701' },
      { id: '2', city: 'Austin', state: 'TX', zipCode: '78702' },
      { id: '3', city: 'Austin', state: 'TX', zipCode: '78703' },
      { id: '4', city: 'Round Rock', state: 'TX', zipCode: '78664' },
      { id: '5', city: 'Cedar Park', state: 'TX', zipCode: '78613' }
    ],
    offers: [
      {
        id: '1',
        title: 'First-Time Customer Discount',
        description: 'New customers get $50 off any service over $200. Valid for first-time appointments only.',
        discountPercent: 25,
        validUntil: '2024-12-31'
      }
    ],
    reviews: [
      {
        id: '1',
        customerName: 'Jennifer Williams',
        rating: 5,
        comment: 'Premium Plumbing saved us during a major plumbing emergency. They responded quickly and fixed the issue professionally. Excellent service!',
        createdAt: '2024-01-12'
      },
      {
        id: '2',
        customerName: 'Robert Davis',
        rating: 5,
        comment: 'Great experience with their HVAC installation. The team was knowledgeable, efficient, and cleaned up after themselves. Highly recommend.',
        createdAt: '2024-01-08'
      }
    ]
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const vendor = mockVendors[params.slug as keyof typeof mockVendors]
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ vendor })
  } catch (error) {
    console.error('Error fetching vendor profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}