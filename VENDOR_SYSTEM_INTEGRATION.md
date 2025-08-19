# Vendor System Integration Guide

## Overview
The vendor system has been completely restructured to provide a cohesive, unified experience across all components. All vendor-related functionality now uses a single data model and consistent interfaces.

## Unified Data Model

### Core Schema (`src/lib/schema.ts`)
- **`VendorService`**: Unified interface for both services and packages
  - `type`: 'service' | 'package'
  - `features`: Array of feature descriptions
  - `duration`: Service duration (e.g., "per event", "per hour")
  - `isPopular`: Boolean flag for highlighting
  - `pricingModel`: 'fixed' | 'hourly' | 'package'
  - `hourlyRate`: For hourly pricing
  - `depositRequired`: Boolean flag
  - `depositPercentage`: Deposit amount
  - `cancellationPolicy`: Text description

### Database Schema (`src/lib/db.ts`)
- **`vendor_services`**: Single table for all services and packages
- **`vendor_onboarding`**: Stores onboarding progress and data
- **`vendor_service_areas`**: Service area locations
- **`vendor_availability`**: Business hours and availability

## Component Integration

### 1. Vendor Signup (`src/components/VendorSignupForm.tsx`)
- **Purpose**: Initial vendor application
- **Data Flow**: Creates vendor record → triggers onboarding flow
- **Integration**: Connects to `/api/vendors` endpoint

### 2. Vendor Onboarding (`src/components/onboarding/`)
- **Purpose**: Step-by-step vendor profile completion
- **Data Flow**: Each step saves to `vendor_onboarding` table
- **Key Steps**:
  - Account Creation
  - Business Profile
  - Service Categories
  - Location & Availability
  - **Pricing & Packages** ← **UNIFIED WITH DASHBOARD**
  - Documentation
  - Review & Submit

### 3. Vendor Dashboard (`src/components/vendor-dashboard/`)
- **Purpose**: Ongoing vendor management
- **Data Flow**: Reads/writes to `vendor_services` table
- **Key Features**:
  - **Service Management**: Create/edit/delete services and packages
  - Profile Management
  - Booking Management
  - Analytics
  - Settings

### 4. Vendor Profile (`src/components/vendor-profile/`)
- **Purpose**: Public-facing vendor display
- **Data Flow**: Reads from public API endpoints
- **Key Features**:
  - **Services Section**: Displays same data as dashboard
  - About, Service Areas, Offers, Reviews

## Data Consistency

### Services & Packages
- **Onboarding**: Creates packages with features, pricing, duration
- **Dashboard**: Manages same data structure
- **Profile**: Displays identical information
- **Single Source of Truth**: `vendor_services` table

### Features Display
- **Onboarding**: Features are added during package creation
- **Dashboard**: Features are editable in service management
- **Profile**: Features are displayed consistently with checkmarks

### Pricing Information
- **Onboarding**: Sets initial pricing structure
- **Dashboard**: Allows ongoing price updates
- **Profile**: Shows current pricing to customers

## API Endpoints

### Private (Vendor Dashboard)
- `POST /api/vendor/services` - Create service/package
- `PUT /api/vendor/services` - Update service/package
- `DELETE /api/vendor/services` - Delete service/package
- `GET /api/vendor/services` - List vendor services

### Public (Vendor Profile)
- `GET /api/vendor/public/[slug]/services` - Get public services

### Onboarding
- `POST /api/vendor/onboarding` - Save onboarding step
- `GET /api/vendor/onboarding` - Get onboarding progress

## Data Flow Examples

### Example 1: Creating a Wedding Photography Package

1. **Onboarding Flow**:
   - Vendor completes "Pricing & Packages" step
   - Package data saved to `vendor_onboarding` table
   - Features: ["8 hours coverage", "200 edited photos", "Wedding album"]

2. **Dashboard Management**:
   - Same package appears in Service Management
   - Vendor can edit features, pricing, description
   - Changes saved to `vendor_services` table

3. **Public Profile**:
   - Package displayed in Services section
   - Features shown with checkmarks
   - Pricing and duration prominently displayed

### Example 2: Service Updates

1. **Dashboard Edit**:
   - Vendor updates service price or features
   - Changes saved to `vendor_services` table

2. **Immediate Consistency**:
   - Public profile reflects changes instantly
   - Onboarding data remains as historical record
   - All components use same data source

## Key Benefits

### 1. **Data Consistency**
- No more duplicate data structures
- Single source of truth for all vendor information
- Consistent display across all components

### 2. **Unified Experience**
- Onboarding creates the same data structure as dashboard
- Profile displays exactly what vendors manage
- Seamless transition from onboarding to active management

### 3. **Maintainability**
- Single schema for all vendor services
- Centralized business logic
- Easier to add new features

### 4. **User Experience**
- Vendors see their data consistently
- Customers see accurate, up-to-date information
- No confusion between different data sources

## Migration Notes

### Legacy Support
- Old `services` and `packages` tables remain for backward compatibility
- New components use unified `vendor_services` table
- Gradual migration path available

### Data Transformation
- Onboarding data automatically converts to unified format
- Features stored as JSON arrays
- Pricing models standardized across all components

## Future Enhancements

### 1. **Real-time Updates**
- WebSocket integration for live data updates
- Instant sync between dashboard and profile

### 2. **Advanced Features**
- Service templates and duplication
- Bulk operations for multiple services
- Advanced pricing models (tiered, seasonal)

### 3. **Analytics Integration**
- Service performance metrics
- Customer engagement data
- Revenue tracking per service

## Testing & Validation

### Data Integrity
- All components use same validation schemas
- Database constraints ensure data consistency
- API endpoints validate input/output formats

### User Experience
- Onboarding flow creates usable dashboard data
- Dashboard changes immediately reflect in profile
- No data loss or inconsistency between components

## Conclusion

The vendor system is now a cohesive, unified platform where:
- **Onboarding** creates the foundation
- **Dashboard** manages ongoing operations  
- **Profile** displays current information
- **All components** share the same data model

This integration ensures that vendors have a seamless experience from initial signup through ongoing business management, while customers see accurate, consistent information across all touchpoints.