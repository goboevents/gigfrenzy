# Supabase Setup Guide for GigFrenzy

This guide will walk you through setting up Supabase as your external database solution for GigFrenzy.

## 🚀 Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up/sign in
3. Create a new organization (if you don't have one)

## 🏗️ Step 2: Create New Project

1. Click "New Project"
2. Choose your organization
3. Enter project details:
   - **Name**: `gigfrenzy` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be ready (usually 2-3 minutes)

## 🔑 Step 3: Get API Keys

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## 📝 Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Update the values with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 🗄️ Step 5: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-migration.sql`
3. Paste and run the SQL script
4. Verify all tables are created in **Table Editor**

## 🔐 Step 6: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your site URL: `http://localhost:3000` (for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/login`
   - `http://localhost:3000/auth/signup`

## 🚀 Step 7: Test Your Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Test authentication by visiting `/auth/signup`

## 📊 Step 8: Monitor and Debug

- **Logs**: Check **Logs** in Supabase dashboard
- **Database**: Use **Table Editor** to view data
- **API**: Test endpoints in **API** section

## 🔒 Security Features Enabled

Your database now includes:

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication**: Built-in user management
- **Real-time subscriptions**: Live updates for bookings
- **Automatic backups**: Daily backups with point-in-time recovery
- **SSL connections**: All data encrypted in transit

## 🚨 Important Notes

1. **Never commit `.env.local`** to version control
2. **Service role key** has admin access - keep it secure
3. **Anon key** is safe for client-side use
4. **Database password** is only needed for direct database access

## 🔧 Troubleshooting

### Common Issues:

1. **Connection errors**: Check your API keys and URL
2. **RLS errors**: Ensure user is authenticated
3. **CORS issues**: Check redirect URLs in auth settings
4. **Migration errors**: Verify SQL syntax and run step by step

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🎯 Next Steps

After setup, you can:

1. **Migrate existing data** from SQLite (if any)
2. **Set up real-time subscriptions** for live updates
3. **Configure file storage** for vendor images
4. **Set up edge functions** for custom business logic
5. **Enable email templates** for notifications

## 📈 Scaling Considerations

- **Free tier**: 500MB database, 50MB file storage
- **Pro tier**: 8GB database, 100GB file storage
- **Team tier**: 100GB database, 1TB file storage
- **Enterprise**: Custom limits and features

Your app is now ready for production with enterprise-grade security and scalability! 🎉