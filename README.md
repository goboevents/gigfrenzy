# GigFrenzy - Event Management Platform

A modern event management platform built with Next.js 15, React 19, and Builder.io for visual page building.

## 🚀 Features

- **Next.js 15** with App Router
- **React 19** with latest features
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Builder.io** integration for visual page building
- **Vendor signup system** with API endpoints
- **Dynamic routing** for Builder.io content
- **Responsive design** with modern UI

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Builder.io
- **Development**: ESLint, PostCSS

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

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your app.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── vendors/       # Vendor signup API
│   ├── vendor-signup/     # Vendor signup page
│   ├── [...page]/         # Dynamic Builder.io pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   └── BuilderPage.tsx    # Builder.io page component
└── ...
```

## 🔧 Builder.io Integration

### Components

- **BuilderPage**: Main component for rendering Builder.io content
- **Dynamic routing**: Handles any URL path for Builder.io content
- **Fallback content**: Shows default content when Builder.io content isn't available

### Configuration

The app is configured to work with Builder.io's page model by default. You can customize this in `builder-config.ts`.

## 📱 Available Routes

- `/` - Home page with Builder.io integration
- `/vendor-signup` - Vendor registration form
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

## 🔌 API Endpoints

### POST /api/vendors

Vendor signup endpoint that accepts:

```json
{
  "businessName": "string",
  "contactName": "string", 
  "email": "string",
  "phone": "string (optional)",
  "businessType": "string",
  "description": "string (optional)"
}
```

## 🎨 Customization

### Styling

The app uses Tailwind CSS. You can customize the design by modifying the Tailwind classes or adding custom CSS.

### Builder.io Content

1. Create content in Builder.io
2. Set the URL path to match your desired route
3. The app will automatically render Builder.io content for that route

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
3. Open an issue in this repository

## 🔮 Future Enhancements

- [ ] User authentication
- [ ] Event management dashboard
- [ ] Payment integration
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
