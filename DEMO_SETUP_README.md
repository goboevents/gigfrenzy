# Demo Vendor Setup Guide

This guide will help you set up a comprehensive demo vendor account to test all aspects of the vendor application.

## 🎯 What You'll Get

The demo vendor includes:
- **Complete Business Profile**: Elegant Events Photography
- **4 Services/Packages**: Wedding photography, corporate events, portraits, hourly services
- **Rich Content**: Features, pricing, duration, cancellation policies
- **Sample Reviews**: 5 customer reviews with 5-star ratings
- **Active Offers**: 3 promotional offers with expiration dates
- **Service Areas**: San Francisco, Oakland, San Jose coverage
- **Business Hours**: 7 days/week, 9 AM - 6 PM
- **Onboarding Data**: Complete step-by-step onboarding history

## 🚀 Quick Setup

### Option 1: Web Interface (Recommended)
1. Navigate to `/demo-setup` in your browser
2. Click "Create Demo Vendor" button
3. Wait for confirmation message
4. Use the quick links to explore the application

### Option 2: Command Line Script
```bash
# Create demo vendor
node scripts/setup-demo.js create

# Check status
node scripts/setup-demo.js status

# Clear demo data
node scripts/setup-demo.js clear

# Show help
node scripts/setup-demo.js help
```

### Option 3: API Endpoint
```bash
# Create demo vendor
curl -X POST http://localhost:3000/api/demo/setup \
  -H "Content-Type: application/json" \
  -d '{"action": "create"}'

# Check status
curl http://localhost:3000/api/demo/setup

# Clear demo data
curl -X POST http://localhost:3000/api/demo/setup \
  -H "Content-Type: application/json" \
  -d '{"action": "clear"}'
```

## 🔗 Demo Vendor Details

### Business Information
- **Name**: Elegant Events Photography
- **Contact**: Sarah Johnson
- **Email**: sarah@elegantevents.com
- **Phone**: (555) 123-4567
- **Type**: Photography
- **Website**: https://elegantevents.com
- **Location**: San Francisco, CA

### Services & Packages

#### 1. Wedding Photography Package ($2,500)
- **Type**: Package
- **Duration**: Full Day Coverage
- **Features**: 8 hours coverage, engagement session, editing, digital files, online gallery, print release, album consultation
- **Popular**: Yes
- **Deposit**: 25% required

#### 2. Corporate Event Coverage ($1,500)
- **Type**: Service
- **Duration**: Per Event
- **Features**: 4 hours coverage, professional editing, 48-hour turnaround, corporate usage rights
- **Popular**: No
- **Deposit**: 50% required

#### 3. Portrait Session ($350)
- **Type**: Service
- **Duration**: 1 Hour Session
- **Features**: 1 hour session, editing, 10-15 images, online gallery, print release
- **Popular**: No
- **Deposit**: None required

#### 4. Hourly Photography ($150/hour)
- **Type**: Service
- **Duration**: Per Hour
- **Features**: Professional photographer, basic editing, digital files, flexible scheduling
- **Popular**: No
- **Deposit**: None required

### Sample Reviews
- **Jennifer & Michael**: "Sarah captured our wedding day perfectly! Every photo is absolutely stunning..."
- **Corporate Events Inc.**: "Professional, punctual, and delivered amazing photos for our annual conference..."
- **The Rodriguez Family**: "Our family portrait session was wonderful! Sarah has a great eye for composition..."
- **Emma & David**: "We couldn't be happier with our engagement photos! Sarah has a natural talent..."
- **Tech Startup Conference**: "Outstanding service for our tech conference. The photos perfectly captured..."

### Active Offers
- **Spring Wedding Special**: 10% off + free engagement session (expires in 30 days)
- **Corporate Event Bundle**: 15% off when booking 3+ events (expires in 60 days)
- **New Client Welcome**: 20% off first portrait session (expires in 90 days)

## 🧪 Testing Scenarios

### 1. Public Profile Testing
- Navigate to `/vendor/elegant-events-photography`
- Test all tabs: About, Services, Service Areas, Offers, Reviews
- Verify service features display correctly
- Check pricing and duration information
- Test responsive design on different screen sizes

### 2. Dashboard Testing
- Navigate to `/vendor-dashboard`
- Test all tabs: Profile, Services & Packages, Bookings, Analytics, Settings
- Verify service management functionality
- Test editing services and packages
- Check data consistency with public profile

### 3. Onboarding Flow Testing
- Navigate to `/vendor-onboarding`
- Verify all 7 steps are marked as complete
- Check data persistence across steps
- Test step navigation and progress tracking

### 4. Data Consistency Testing
- Create/edit services in dashboard
- Verify changes appear in public profile
- Check that features, pricing, and descriptions sync
- Test real-time updates

## 🗄️ Database Schema

The demo data uses these tables:
- `vendors` - Basic vendor information
- `vendor_profiles` - Public profile data
- `vendor_services` - Services and packages
- `vendor_service_areas` - Geographic coverage
- `vendor_availability` - Business hours
- `vendor_onboarding` - Onboarding progress
- `vendor_reviews` - Customer reviews
- `vendor_offers` - Promotional offers

## 🔧 Troubleshooting

### Demo Vendor Not Created
1. Check browser console for errors
2. Verify database is accessible
3. Check API endpoint `/api/demo/setup` is working
4. Ensure all required tables exist

### Data Not Displaying
1. Check if demo vendor exists in database
2. Verify API endpoints are returning data
3. Check browser network tab for failed requests
4. Ensure components are receiving proper props

### Database Errors
1. Check database file permissions
2. Verify SQLite is working correctly
3. Check for table creation errors
4. Ensure foreign key constraints are satisfied

## 🧹 Cleanup

When you're done testing:
```bash
# Clear all demo data
node scripts/setup-demo.js clear

# Or use the web interface
# Navigate to /demo-setup and click "Clear Demo Data"
```

## 📝 Notes

- Demo data is completely isolated from production data
- All images use Unsplash URLs for realistic appearance
- Data includes realistic business scenarios and pricing
- Reviews and offers have realistic dates and content
- Service features demonstrate the rich content capabilities

## 🚀 Next Steps

After setting up the demo vendor:
1. Explore the public profile to see customer experience
2. Test the dashboard to understand vendor management
3. Try editing services to see real-time updates
4. Test the onboarding flow to understand the complete journey
5. Use the data as a reference for building new features

Happy testing! 🎉