# 🎧 GigFrenzy Testing Guide

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access the Application
Open your browser and navigate to: `http://localhost:3000`

## 🔐 Test Account Details

**DJ Vendor Account:**
- **Email:** `dj@mixmasterpro.com`
- **Password:** `password123`
- **Vendor ID:** 3
- **User ID:** 1
- **Profile Slug:** `dj-mixmaster-pro`

## 📱 How to Log In

### Option 1: Direct Login Page
1. Navigate to `/login`
2. Enter the credentials above
3. Click "Sign in"
4. You'll be redirected to `/vendor-dashboard`

### Option 2: Navigation Menu
1. Click "Sign In" in the top navigation
2. Enter the credentials above
3. Click "Sign in"
4. You'll be redirected to `/vendor-dashboard`

## 🎯 What You Can Test

### ✅ Vendor Dashboard Features
- **Profile Management:** Update business information, bio, and contact details
- **Services & Packages:** Manage your 4 DJ packages and services
- **Bookings:** View and manage incoming booking requests
- **Analytics:** View business metrics and performance data
- **Settings:** Configure account preferences

### ✅ Public Profile Features
- **Public URL:** `/vendor/dj-mixmaster-pro`
- **Services Display:** All 4 packages are visible to customers
- **Booking Flow:** Test the complete customer booking process
- **Service Areas:** Los Angeles and Orange County coverage
- **Availability:** 7 days a week with extended weekend hours

### ✅ Customer Booking Experience
1. Visit the public profile
2. Select a service/package
3. Choose date and time
4. Fill in event details
5. Complete the booking process

## 🎵 Test Data Overview

### Services & Packages Created:
1. **Basic DJ Package** - $500 (4 hours)
   - Professional sound system
   - Basic lighting setup
   - Music consultation
   - Setup and teardown

2. **Premium DJ Package** - $800 (6 hours) ⭐ **Most Popular**
   - Enhanced sound system
   - Professional lighting
   - MC services
   - Wireless microphone

3. **Wedding DJ Package** - $1,200 (Full day)
   - Complete wedding coordination
   - Ceremony, cocktail hour, reception
   - Professional equipment
   - Day-of coordination

4. **Hourly DJ Service** - $150/hour
   - Flexible hourly rate
   - Professional equipment
   - Custom event needs

### Service Areas:
- **Los Angeles, CA** (25-mile radius)
- **Orange County, CA** (25-mile radius)

### Availability:
- **Monday-Friday:** 9:00 AM - 6:00 PM
- **Saturday-Sunday:** 9:00 AM - 2:00 AM

## 🛠️ Management Commands

### Create Test Data
```bash
npm run seed:dj
```

### Clean Up Test Data
```bash
npm run seed:clean
```

### Reset Database (if needed)
```bash
# Delete the database file and restart
rm data/app.db
npm run dev
npm run seed:dj
```

## 🔍 Testing Scenarios

### 1. **Vendor Login Flow**
- [ ] Navigate to `/login`
- [ ] Enter test credentials
- [ ] Verify redirect to dashboard
- [ ] Check navigation shows authenticated state

### 2. **Dashboard Navigation**
- [ ] Verify all 5 tabs are accessible
- [ ] Check profile information is loaded
- [ ] Verify services are displayed correctly
- [ ] Test settings and analytics

### 3. **Public Profile**
- [ ] Visit `/vendor/dj-mixmaster-pro`
- [ ] Verify all services are visible
- [ ] Check service areas and availability
- [ ] Test responsive design

### 4. **Customer Booking Flow**
- [ ] Start booking from public profile
- [ ] Select different packages
- [ ] Test date/time selection
- [ ] Complete booking process
- [ ] Verify booking appears in dashboard

### 5. **Authentication System**
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Verify logout functionality
- [ ] Check protected route access

## 🐛 Troubleshooting

### Common Issues:

1. **"Database locked" error:**
   - Stop the dev server
   - Delete `data/app.db` and restart
   - Run `npm run seed:dj` again

2. **Login not working:**
   - Check browser console for errors
   - Verify the seeding script ran successfully
   - Check that the auth API endpoints are working

3. **Services not showing:**
   - Verify the seeding script completed without errors
   - Check database tables have data
   - Restart the development server

4. **Navigation not updating:**
   - Hard refresh the page (Ctrl+F5 / Cmd+Shift+R)
   - Check browser console for JavaScript errors
   - Verify the auth check is working

### Debug Commands:
```bash
# Check if database exists and has data
ls -la data/
sqlite3 data/app.db ".tables"
sqlite3 data/app.db "SELECT * FROM vendors;"
sqlite3 data/app.db "SELECT * FROM vendor_users;"
```

## 📚 API Endpoints

### Authentication:
- `POST /api/auth/login` - Vendor login
- `POST /api/auth/logout` - Vendor logout
- `GET /api/auth/me` - Get current user info

### Vendor Data:
- `GET /api/vendor/profile` - Get vendor profile
- `GET /api/vendor/services` - Get vendor services
- `GET /api/vendor/bookings` - Get vendor bookings

### Public:
- `GET /api/vendor/public/[slug]` - Get public vendor profile
- `GET /api/vendor/public/[slug]?type=booking-options` - Get booking options
- `GET /api/vendor/public/[slug]/services` - Get public services

## 🎉 Success Criteria

You'll know the system is working correctly when:

1. ✅ You can log in with `dj@mixmasterpro.com` / `password123`
2. ✅ You're redirected to the vendor dashboard
3. ✅ All 5 dashboard tabs are functional
4. ✅ Your public profile is accessible at `/vendor/dj-mixmaster-pro`
5. ✅ All 4 services are visible to customers
6. ✅ The navigation shows "Welcome, John Smith" and logout button
7. ✅ You can log out and return to the home page

## 🚀 Next Steps

Once the basic system is working:

1. **Test the complete booking flow** from a customer perspective
2. **Create additional test vendors** with different service types
3. **Test the review and rating system** (if implemented)
4. **Verify payment integration** (if implemented)
5. **Test mobile responsiveness** across different devices
6. **Performance testing** with multiple concurrent users

---

**Happy Testing! 🎧✨**
