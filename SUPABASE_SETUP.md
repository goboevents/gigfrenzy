# Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dvwtrdazfropfkzrmxgv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d3RyZGF6ZnJvcGZrenJteGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MTk4NDUsImV4cCI6MjA3MTI5NTg0NX0.2tljqdW8nEACpc7XZZzyQjR4SAG4d_TawRB3EX99Bps
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d3RyZGF6ZnJvcGZrenJteGd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcxOTg0NSwiZXhwIjoyMDcxMjk1ODQ1fQ.HeD0QDm0r9_v51UqvKB6DBWnZio--iJMmzYZOFXOFRk

# Keep existing auth secret for now during transition
AUTH_SECRET=dev-insecure-secret-change-me
```

## What's Been Implemented

### Phase 1 Complete ✅
- ✅ Supabase client configuration (`src/lib/supabase.ts`)
- ✅ Supabase authentication system (`src/lib/supabase-auth.ts`)
- ✅ Updated authentication hooks (`src/hooks/useSupabaseAuth.ts`)
- ✅ Updated API routes for login, register, logout, and me

### Next Steps
1. Create the `.env.local` file with the above variables
2. Test the authentication system
3. Update frontend components to use the new auth hooks
4. Migrate data access layer from SQLite to Supabase
5. Test end-to-end functionality

## Testing the Setup

1. Start your development server: `npm run dev`
2. Try to register a new vendor account
3. Try to login with the created account
4. Check that authentication state is properly managed

## Notes

- The database schema is already set up in your Supabase project
- Row Level Security (RLS) is enabled on all tables
- The authentication system now uses Supabase's built-in auth instead of custom JWT
- All API routes have been updated to use the new system
