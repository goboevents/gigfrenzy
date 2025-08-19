# Vendor Portal Components

This directory contains all the components for the comprehensive vendor portal that allows vendors to manage their business profile, packages, bookings, and more.

## Components Overview

### 1. VendorDashboard (`VendorDashboard.tsx`)
The main dashboard component that provides navigation between different sections of the vendor portal.

**Features:**
- Tab-based navigation between different sections
- Responsive design with mobile-friendly layout
- Header with notifications and user profile
- Consistent styling with the rest of the application

**Builder.io Registration:**
- Name: "Vendor Dashboard"
- Configurable title and subtitle
- Dashboard icon

### 2. ProfileManagement (`ProfileManagement.tsx`)
Allows vendors to manage their business profile information.

**Features:**
- Edit business profile details (name, headline, bio, location, website)
- Upload and manage profile pictures and cover images
- Control profile visibility (public/private)
- Real-time form validation and editing
- Responsive form layout

**Builder.io Registration:**
- Name: "Vendor Profile Management"
- User icon

### 3. PackageManagement (`PackageManagement.tsx`)
Enables vendors to create, edit, and manage their service packages and pricing.

**Features:**
- Create new service packages
- Edit existing package details
- Set pricing in USD
- Toggle package visibility (active/inactive)
- Delete packages with confirmation
- Form validation and error handling

**Builder.io Registration:**
- Name: "Vendor Package Management"
- Package icon

### 4. BookingManagement (`BookingManagement.tsx`)
Provides vendors with a comprehensive view of their event bookings.

**Features:**
- View all bookings with filtering by status and date
- Update booking status (confirm, decline, mark complete)
- Detailed booking information display
- Customer contact information
- Booking notes and special requirements
- Modal for detailed booking view

**Builder.io Registration:**
- Name: "Vendor Booking Management"
- Calendar icon

### 5. Analytics (`Analytics.tsx`)
Gives vendors insights into their business performance and metrics.

**Features:**
- Key performance indicators (bookings, revenue, ratings, customers)
- Monthly trends and charts
- Top-performing packages analysis
- Recent activity feed
- Performance insights and calculations
- Time range filtering (7 days, 30 days, 90 days, 1 year)

**Builder.io Registration:**
- Name: "Vendor Analytics"
- Chart bar icon

### 6. Settings (`Settings.tsx`)
Allows vendors to configure their account preferences and settings.

**Features:**
- Notification preferences (email, SMS, push)
- Privacy and security settings
- Billing and payment preferences
- Integration management
- Tab-based settings organization

**Builder.io Registration:**
- Name: "Vendor Settings"
- Settings icon

## API Endpoints

The vendor portal integrates with the following API endpoints:

### Existing Endpoints:
- `GET/POST /api/vendor/profile` - Profile management
- `GET/POST/PUT/DELETE /api/vendor/packages` - Package management
- `GET /api/vendor/bookings` - Booking retrieval

### New Endpoints:
- `PUT /api/vendor/bookings/[id]/status` - Update booking status
- `GET /api/vendor/analytics` - Analytics data

## Design System

The vendor portal follows the established design patterns:

- **Colors**: Consistent with the existing app using blue (#3b82f6) as primary color
- **Typography**: Clear hierarchy with proper font weights and sizes
- **Spacing**: Consistent padding and margins using Tailwind CSS classes
- **Components**: Reusable UI components with hover states and transitions
- **Responsiveness**: Mobile-first design with responsive breakpoints

## Builder.io Integration

All components are registered with Builder.io for visual editing:

- **Component Registration**: Each component has proper Builder.io registration
- **Input Fields**: Configurable properties where appropriate
- **Icons**: Relevant icons for each component category
- **Default Styles**: Consistent styling defaults

## Usage

To use the vendor portal:

1. Navigate to `/vendor-dashboard` in your application
2. The dashboard will load with the Profile tab active by default
3. Use the tab navigation to switch between different sections
4. All components are fully interactive and integrate with existing APIs

## Future Enhancements

Potential improvements for the vendor portal:

- Real-time notifications and updates
- Advanced analytics with charts and graphs
- Calendar integration for availability management
- Customer messaging system
- Payment processing integration
- Multi-language support
- Advanced filtering and search capabilities
- Export functionality for reports and data

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS
- Heroicons
- Builder.io React SDK
- Next.js 13+ (App Router)