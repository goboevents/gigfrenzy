# GigFrenzy - Event Management Platform

A modern event management platform built with Next.js 15, React 19, and Builder.io for visual page building, featuring comprehensive vendor management and customer booking experiences.

## 🚀 Features

- **Next.js 15** with App Router
- **React 19** with latest features
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Builder.io** integration for visual page building
- **Complete vendor management system** with onboarding, profiles, and dashboard
- **Multi-step customer booking flow** with service selection, scheduling, and confirmation
- **Vendor public profiles** with booking CTAs and service display
- **Dynamic routing** for Builder.io content and vendor profiles
- **Responsive design** with modern UI components
- **SQLite database** with comprehensive data models
- **Repository pattern** for clean data access
- **Authentication system** with login/signup flows

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Builder.io
- **Database**: SQLite with Drizzle ORM
- **Development**: ESLint, PostCSS
- **State Management**: React Context and Hooks

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Builder.io account and API key

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd gigfrenzy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Builder.io

1. Get your API key from [Builder.io](https://builder.io)
2. Update `builder-config.ts` with your API key:

```typescript
export const BUILDER_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE'
```

### 4. Initialize the database

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your app.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── booking/       # Booking management API
│   │   ├── vendor/        # Vendor management API
│   │   └── public/        # Public vendor data API
│   ├── booking/           # Customer booking flows
│   ├── vendor/            # Vendor public profiles
│   ├── vendor-dashboard/  # Vendor management dashboard
│   ├── vendor-onboarding/ # Vendor registration flow
│   ├── [...page]/         # Dynamic Builder.io pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── booking/           # Booking flow components
│   ├── vendor-dashboard/  # Vendor dashboard components
│   ├── vendor-profile/    # Vendor profile components
│   └── BuilderPage.tsx    # Builder.io page component
├── lib/                    # Utilities and configurations
│   ├── repositories/      # Data access layer
│   ├── schemas/           # Database schemas
│   └── db.ts             # Database configuration
└── scripts/               # Database and utility scripts
```

## 🔧 Core Features

### Vendor Management System

- **Onboarding Flow**: Multi-step vendor registration with business profile, services, and pricing
- **Dashboard**: Comprehensive management interface for bookings, packages, and analytics
- **Public Profiles**: Dynamic vendor profiles with service listings and booking capabilities
- **Service Management**: Add, edit, and manage service offerings and pricing packages

### Customer Booking Experience

- **Multi-step Flow**: Service selection → Event details → Date/time → Customer info → Review → Confirmation
- **Service Selection**: Browse vendor services with pricing and package options
- **Scheduling**: Interactive date and time picker with availability checking
- **Progress Tracking**: Visual progress bar throughout the booking process
- **Price Calculator**: Real-time pricing based on services and options selected

### Authentication & User Management

- **User Registration**: Customer and vendor account creation
- **Login System**: Secure authentication with session management
- **Profile Management**: User profile updates and preferences

## 📱 Available Routes

- `/` - Home page with Builder.io integration
- `/login` - User authentication
- `/signup` - User registration
- `/vendor-signup` - Vendor registration form
- `/vendor-onboarding` - Vendor onboarding flow
- `/vendor-dashboard` - Vendor management dashboard
- `/vendor/[slug]` - Public vendor profile
- `/booking/[vendorSlug]` - Customer booking flow
- `/booking/confirm/[bookingId]` - Booking confirmation
- `/[any-path]` - Dynamic Builder.io pages

## 🧪 Testing

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Database operations

```bash
npm run db:generate    # Generate database migrations
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database with sample data
npm run db:cleanup     # Clean up test data
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Vendor Management
- `GET /api/vendor/profile` - Get vendor profile
- `POST /api/vendor/profile` - Update vendor profile
- `GET /api/vendor/services` - Get vendor services
- `POST /api/vendor/services` - Create/update services
- `GET /api/vendor/packages` - Get pricing packages
- `POST /api/vendor/packages` - Create/update packages
- `GET /api/vendor/bookings` - Get vendor bookings
- `GET /api/vendor/analytics` - Get vendor analytics

### Public Vendor Data
- `GET /api/public/vendors/[slug]` - Get public vendor profile
- `GET /api/public/vendors/[slug]/services` - Get vendor services
- `GET /api/public/vendors/[slug]/availability` - Check vendor availability

### Booking Management
- `POST /api/booking` - Create new booking
- `GET /api/booking/[id]` - Get booking details
- `PUT /api/booking/[id]` - Update booking
- `GET /api/booking/[id]/messages` - Get booking messages

## 🎨 Customization

### Styling

The app uses Tailwind CSS. You can customize the design by modifying the Tailwind classes or adding custom CSS.

### Builder.io Content

1. Create content in Builder.io
2. Set the URL path to match your desired route
3. The app will automatically render Builder.io content for that route

### Database Schema

The platform uses a comprehensive database schema with:
- User management and authentication
- Vendor profiles and services
- Service areas and availability
- Pricing packages and options
- Booking management and messaging
- Analytics and reporting

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables if needed
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Builder.io Documentation](https://www.builder.io/c/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Builder.io guides](https://www.builder.io/c/docs)
3. Check the [TESTING_GUIDE.md](./TESTING_GUIDE.md)
4. Open an issue in this repository

## 🔮 Recent Updates

### Version 0.2.0 - Complete Customer Booking Experience
- ✅ Multi-step booking flow implementation
- ✅ Comprehensive vendor management system
- ✅ Enhanced vendor dashboard with analytics
- ✅ Public vendor profiles with booking CTAs
- ✅ Service and package management
- ✅ Authentication and user management
- ✅ Database integration with SQLite
- ✅ Repository pattern for clean architecture

### Version 0.1.0 - Foundation
- ✅ Next.js 15 with App Router
- ✅ Builder.io integration
- ✅ Basic vendor signup system
- ✅ Dynamic routing capabilities

## 🚀 Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] Real-time notifications and messaging
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Social media integration
- [ ] Calendar integration
- [ ] Email marketing tools
- [ ] Customer review system
