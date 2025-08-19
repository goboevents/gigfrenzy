import { getDatabase } from '@/lib/db'
import { createVendor } from './vendorRepository'
import { createVendorProfile } from './vendorProfileRepository'
import { createVendorService } from './vendorServiceRepository'
import { saveOnboardingStep } from './vendorOnboardingRepository'

export function createDemoVendor() {
  const db = getDatabase()
  
  // Create demo vendor
  const vendor = createVendor({
    businessName: 'Elegant Events Photography',
    contactName: 'Sarah Johnson',
    email: 'sarah@elegantevents.com',
    phone: '(555) 123-4567',
    businessType: 'Photography',
    website: 'https://elegantevents.com',
    description: 'Professional wedding and event photography services with over 10 years of experience capturing life\'s most precious moments.'
  })

  // Create vendor profile
  const vendorProfile = createVendorProfile(vendor.id, {
    slug: 'elegant-events-photography',
    displayName: 'Elegant Events Photography',
    headline: 'Capturing Your Special Moments with Elegance & Style',
    bio: 'We specialize in wedding photography, corporate events, and special occasions. Our team of professional photographers ensures every moment is beautifully captured with attention to detail and artistic vision. From intimate ceremonies to grand celebrations, we create timeless memories that you\'ll treasure forever.',
    location: 'San Francisco, CA',
    website: 'https://elegantevents.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    coverImageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=400&fit=crop',
    visibility: 'public'
  })

  // Create demo services
  const services = [
    {
      title: 'Wedding Photography Package',
      description: 'Complete wedding day coverage including ceremony, reception, and engagement session. Professional editing and high-resolution digital files included.',
      priceCents: 250000, // $2,500
      type: 'package',
      duration: 'Full Day Coverage',
      features: [
        '8 hours of photography coverage',
        'Engagement session included',
        'Professional photo editing',
        'High-resolution digital files',
        'Online gallery for sharing',
        'Print release for personal use',
        'Wedding album design consultation'
      ],
      isPopular: true,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: true,
      depositPercentage: 25,
      cancellationPolicy: '50% refund if cancelled 30+ days before event. No refunds within 30 days of event.'
    },
    {
      title: 'Corporate Event Coverage',
      description: 'Professional photography for corporate events, conferences, and business functions. Quick turnaround for marketing materials.',
      priceCents: 150000, // $1,500
      type: 'service',
      duration: 'Per Event',
      features: [
        '4 hours of coverage',
        'Professional editing',
        'Quick turnaround (48 hours)',
        'High-resolution files',
        'Corporate usage rights',
        'Social media optimized images'
      ],
      isPopular: false,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: true,
      depositPercentage: 50,
      cancellationPolicy: 'Full refund if cancelled 7+ days before event. 50% refund within 7 days.'
    },
    {
      title: 'Portrait Session',
      description: 'Professional portrait photography for individuals, families, and seniors. Perfect for professional headshots or family memories.',
      priceCents: 35000, // $350
      type: 'service',
      duration: '1 Hour Session',
      features: [
        '1 hour photo session',
        'Professional editing',
        '10-15 final images',
        'Online gallery',
        'Print release',
        'Location of your choice'
      ],
      isPopular: false,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: false,
      depositPercentage: 0,
      cancellationPolicy: 'Full refund if cancelled 24+ hours before session. No refunds within 24 hours.'
    },
    {
      title: 'Hourly Photography',
      description: 'Flexible hourly photography services for events that need custom coverage. Perfect for smaller events or additional coverage.',
      priceCents: 15000, // $150
      type: 'service',
      duration: 'Per Hour',
      features: [
        'Professional photographer',
        'Basic editing included',
        'Digital files',
        'Flexible scheduling',
        'Quick turnaround'
      ],
      isPopular: false,
      pricingModel: 'hourly',
      hourlyRate: 15000, // $150/hour
      depositRequired: false,
      depositPercentage: 0,
      cancellationPolicy: 'Full refund if cancelled 48+ hours before event.'
    }
  ]

  // Insert services
  services.forEach(serviceData => {
    createVendorService(vendor.id, serviceData)
  })

  // Create demo onboarding data
  const onboardingSteps = [
    {
      step: 'accountCreation',
      data: {
        businessName: 'Elegant Events Photography',
        contactName: 'Sarah Johnson',
        email: 'sarah@elegantevents.com',
        phone: '(555) 123-4567',
        businessType: 'Photography',
        website: 'https://elegantevents.com',
        description: 'Professional wedding and event photography services with over 10 years of experience capturing life\'s most precious moments.'
      }
    },
    {
      step: 'businessProfile',
      data: {
        displayName: 'Elegant Events Photography',
        headline: 'Capturing Your Special Moments with Elegance & Style',
        bio: 'We specialize in wedding photography, corporate events, and special occasions. Our team of professional photographers ensures every moment is beautifully captured with attention to detail and artistic vision.',
        location: 'San Francisco, CA',
        website: 'https://elegantevents.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        coverImageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=400&fit=crop'
      }
    },
    {
      step: 'serviceCategories',
      data: {
        categories: ['Photography', 'Wedding Services', 'Event Services'],
        specialties: ['Wedding Photography', 'Corporate Events', 'Portrait Photography', 'Event Coverage'],
        certifications: ['Professional Photographers of America', 'Wedding Photography Certification']
      }
    },
    {
      step: 'locationAvailability',
      data: {
        serviceAreas: [
          { city: 'San Francisco', state: 'CA', zipCode: '94102', radius: 50 },
          { city: 'Oakland', state: 'CA', zipCode: '94601', radius: 30 },
          { city: 'San Jose', state: 'CA', zipCode: '95110', radius: 40 }
        ],
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
          startTime: '09:00',
          endTime: '18:00'
        }
      }
    },
    {
      step: 'pricingPackages',
      data: {
        packages: [
          {
            id: 'wedding-package',
            name: 'Wedding Photography Package',
            description: 'Complete wedding day coverage including ceremony, reception, and engagement session.',
            price: 2500,
            currency: 'USD',
            duration: 'Full Day Coverage',
            features: [
              '8 hours of photography coverage',
              'Engagement session included',
              'Professional photo editing',
              'High-resolution digital files',
              'Online gallery for sharing',
              'Print release for personal use',
              'Wedding album design consultation'
            ],
            isPopular: true
          },
          {
            id: 'corporate-event',
            name: 'Corporate Event Coverage',
            description: 'Professional photography for corporate events, conferences, and business functions.',
            price: 1500,
            currency: 'USD',
            duration: 'Per Event',
            features: [
              '4 hours of coverage',
              'Professional editing',
              'Quick turnaround (48 hours)',
              'High-resolution files',
              'Corporate usage rights',
              'Social media optimized images'
            ],
            isPopular: false
          }
        ],
        pricingModel: 'package',
        hourlyRate: 150,
        depositRequired: true,
        depositPercentage: 25,
        cancellationPolicy: '50% refund if cancelled 30+ days before event. No refunds within 30 days of event.'
      }
    },
    {
      step: 'documentation',
      data: {
        businessLicense: 'CA-123456789',
        insuranceCertificate: 'INS-987654321',
        taxDocuments: 'TAX-2024-001',
        otherDocuments: ['Professional Liability Insurance', 'Equipment Insurance']
      }
    }
  ]

  // Save onboarding steps
  onboardingSteps.forEach(({ step, data }) => {
    saveOnboardingStep(vendor.id, step, data)
  })

  // Insert service areas
  const serviceAreas = [
    { city: 'San Francisco', state: 'CA', zipCode: '94102', radius: 50 },
    { city: 'Oakland', state: 'CA', zipCode: '94601', radius: 30 },
    { city: 'San Jose', state: 'CA', zipCode: '95110', radius: 40 }
  ]

  serviceAreas.forEach(area => {
    const now = new Date().toISOString()
    db.prepare(`
      INSERT INTO vendor_service_areas (vendorId, city, state, zipCode, radius, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(vendor.id, area.city, area.state, area.zipCode, area.radius, now)
  })

  // Insert availability
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO vendor_availability (
      vendorId, monday, tuesday, wednesday, thursday, friday, saturday, sunday, 
      startTime, endTime, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    vendor.id, 1, 1, 1, 1, 1, 1, 1, '09:00', '18:00', now, now
  )

  // Insert sample reviews
  const reviews = [
    {
      customerName: 'Jennifer & Michael',
      rating: 5,
      comment: 'Sarah captured our wedding day perfectly! Every photo is absolutely stunning and she made us feel so comfortable throughout the entire day. The quality and attention to detail exceeded our expectations.',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
    },
    {
      customerName: 'Corporate Events Inc.',
      rating: 5,
      comment: 'Professional, punctual, and delivered amazing photos for our annual conference. The turnaround time was incredible and the photos perfectly captured the energy of our event.',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days ago
    },
    {
      customerName: 'The Rodriguez Family',
      rating: 5,
      comment: 'Our family portrait session was wonderful! Sarah has a great eye for composition and made our kids feel at ease. The photos are beautiful and we\'ll treasure them forever.',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days ago
    },
    {
      customerName: 'Emma & David',
      rating: 5,
      comment: 'We couldn\'t be happier with our engagement photos! Sarah has a natural talent for capturing authentic moments. The lighting and composition are perfect.',
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString() // 75 days ago
    },
    {
      customerName: 'Tech Startup Conference',
      rating: 5,
      comment: 'Outstanding service for our tech conference. The photos perfectly captured the innovative spirit and networking opportunities. Highly recommend for any corporate event!',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days ago
    }
  ]

  reviews.forEach(review => {
    db.prepare(`
      INSERT INTO vendor_reviews (vendorId, customerName, rating, comment, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(vendor.id, review.customerName, review.rating, review.comment, review.createdAt)
  })

  // Insert sample offers
  const offers = [
    {
      title: 'Spring Wedding Special',
      description: 'Book your spring wedding by March 31st and receive a complimentary engagement session plus 10% off your wedding package. Perfect for capturing the beauty of spring blooms!',
      discountPercent: 10,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    },
    {
      title: 'Corporate Event Bundle',
      description: 'Book 3 or more corporate events and save 15% on each. Perfect for companies with multiple events throughout the year.',
      discountPercent: 15,
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days from now
    },
    {
      title: 'New Client Welcome',
      description: 'First-time clients get 20% off their first portrait session. Experience our quality and style at a special introductory rate.',
      discountPercent: 20,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
    }
  ]

  offers.forEach(offer => {
    db.prepare(`
      INSERT INTO vendor_offers (vendorId, title, description, discountPercent, validUntil, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(vendor.id, offer.title, offer.description, offer.discountPercent, offer.validUntil, now)
  })

  return {
    vendor,
    vendorProfile,
    services: services.length
  }
}

export function getDemoVendorData() {
  const db = getDatabase()
  
  // Get vendor by business name
  const vendor = db.prepare('SELECT * FROM vendors WHERE businessName = ?').get('Elegant Events Photography')
  
  if (!vendor) {
    return null
  }

  // Get vendor profile
  const profile = db.prepare('SELECT * FROM vendor_profiles WHERE vendorId = ?').get(vendor.id)
  
  // Get services
  const services = db.prepare('SELECT * FROM vendor_services WHERE vendorId = ?').all(vendor.id)
  
  // Get service areas
  const serviceAreas = db.prepare('SELECT * FROM vendor_service_areas WHERE vendorId = ?').all(vendor.id)
  
  // Get availability
  const availability = db.prepare('SELECT * FROM vendor_availability WHERE vendorId = ?').get(vendor.id)
  
  // Get reviews
  const reviews = db.prepare('SELECT * FROM vendor_reviews WHERE vendorId = ? ORDER BY createdAt DESC').all(vendor.id)
  
  // Get offers
  const offers = db.prepare('SELECT * FROM vendor_offers WHERE vendorId = ? ORDER BY validUntil ASC').all(vendor.id)
  
  return {
    vendor,
    profile,
    services,
    serviceAreas,
    availability,
    reviews,
    offers
  }
}

export function clearDemoData() {
  const db = getDatabase()
  
  // Get demo vendor
  const vendor = db.prepare('SELECT * FROM vendors WHERE businessName = ?').get('Elegant Events Photography')
  
  if (vendor) {
    // Delete related data
    db.prepare('DELETE FROM vendor_services WHERE vendorId = ?').run(vendor.id)
    db.prepare('DELETE FROM vendor_service_areas WHERE vendorId = ?').run(vendor.id)
    db.prepare('DELETE FROM vendor_availability WHERE vendorId = ?').run(vendor.id)
    db.prepare('DELETE FROM vendor_onboarding WHERE vendorId = ?').run(vendor.id)
    db.prepare('DELETE FROM vendor_profiles WHERE vendorId = ?').run(vendor.id)
    db.prepare('DELETE FROM vendor_user_vendors WHERE vendorId = ?').run(vendor.id)
    db.prepare('DELETE FROM vendor_reviews WHERE vendorId = ?').run(vendor.id)
    db.prepare('DELETE FROM vendor_offers WHERE vendorId = ?').run(vendor.id)
    db.prepare('DELETE FROM vendors WHERE id = ?').run(vendor.id)
  }
}