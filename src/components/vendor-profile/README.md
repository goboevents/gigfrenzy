# Vendor Profile System

A comprehensive, modular public-facing vendor profile system designed to showcase vendor information with a persistent "Book Now" call-to-action.

## Features

- **Hero Section**: Eye-catching cover image with vendor information overlay
- **Persistent Book Now CTA**: Sticky header with prominent booking button
- **Modular Tab System**: Organized sections for different types of information
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Modal dialogs, hover effects, and smooth transitions

## Components

### Main Components

- **`VendorProfile`**: Main container component with hero section and tab navigation
- **`BookNowCTA`**: Persistent sticky header with booking modal

### Section Components

- **`AboutSection`**: Vendor bio, contact information, and company highlights
- **`ServicesSection`**: Service offerings with pricing and descriptions
- **`ServiceAreasSection`**: Geographic coverage areas with detailed information
- **`OffersSection`**: Special deals, promotions, and discounts
- **`ReviewsSection`**: Customer reviews, ratings, and testimonials

## Usage

### Basic Implementation

```tsx
import VendorProfile from '@/components/vendor-profile/VendorProfile'

const vendorData = {
  // ... vendor information
}

export default function VendorPage() {
  return <VendorProfile vendor={vendorData} />
}
```

### Route Structure

The system is designed to work with dynamic routes:

```
/vendor/[slug] → VendorProfilePage
```

### API Integration

The system expects vendor data in this format:

```typescript
interface Vendor {
  id: string
  slug: string
  displayName: string
  headline: string
  bio: string
  location: string
  website: string
  phone: string
  avatarUrl: string
  coverImageUrl: string
  rating: number
  reviewCount: number
  services: Service[]
  serviceAreas: ServiceArea[]
  offers: Offer[]
  reviews: Review[]
}
```

## Design Features

### Persistent Book Now CTA

- **Sticky Positioning**: Always visible at the top of the viewport
- **Multiple Booking Options**: Phone, website, and in-app booking
- **Quick Vendor Info**: Rating and contact details always accessible

### Tab Navigation

- **Icon-based Tabs**: Visual indicators for each section
- **Smooth Transitions**: Content changes without page reloads
- **Active State**: Clear indication of current section

### Responsive Layout

- **Mobile-First**: Optimized for mobile devices
- **Flexible Grids**: Adaptive layouts for different screen sizes
- **Touch-Friendly**: Appropriate sizing for mobile interactions

## Customization

### Styling

All components use Tailwind CSS classes and can be easily customized:

```tsx
// Custom color scheme
className="bg-custom-blue text-custom-white"

// Custom spacing
className="p-custom-spacing"
```

### Content

Each section component can be modified to include additional fields:

```tsx
// Add custom fields to AboutSection
<div className="custom-field">
  <h4>Custom Information</h4>
  <p>{vendor.customField}</p>
</div>
```

### Layout

The tab system can be extended with additional sections:

```tsx
const tabs = [
  // ... existing tabs
  { id: 'custom', name: 'Custom', icon: CustomIcon }
]
```

## Demo

Visit `/demo/vendor-profile` to see a working example with sample data.

## API Endpoints

### Public Vendor Profile

```
GET /api/vendor/public/[slug]
```

Returns vendor data for public display.

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for all device sizes
- Progressive enhancement for older browsers

## Performance

- **Lazy Loading**: Images and content loaded as needed
- **Optimized Rendering**: Efficient React component updates
- **Minimal Dependencies**: Lightweight component library

## Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color combinations

## Future Enhancements

- **Real-time Updates**: Live chat and availability status
- **Advanced Booking**: Calendar integration and appointment scheduling
- **Social Proof**: Social media integration and sharing
- **Analytics**: User interaction tracking and insights
- **Multi-language**: Internationalization support

## Contributing

When adding new features or modifying existing components:

1. Maintain the modular structure
2. Follow the established naming conventions
3. Include proper TypeScript interfaces
4. Add comprehensive documentation
5. Test across different screen sizes
6. Ensure accessibility compliance

## License

This component system is part of the GigFrenzy platform and follows the project's licensing terms.