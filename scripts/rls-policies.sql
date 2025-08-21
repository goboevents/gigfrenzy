-- Fix RLS Policies for GigFrenzy Vendor System
-- Run this script in your Supabase Dashboard SQL Editor

-- Step 1: Ensure RLS is enabled on all tables
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_availability ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "vendors_public_read" ON public.vendors;
DROP POLICY IF EXISTS "vendors_update_own" ON public.vendors;
DROP POLICY IF EXISTS "vendor_profiles_public_read" ON public.vendor_profiles;
DROP POLICY IF EXISTS "vendor_profiles_update_own" ON public.vendor_profiles;
DROP POLICY IF EXISTS "vendor_services_public_read" ON public.vendor_services;
DROP POLICY IF EXISTS "vendor_services_manage_own" ON public.vendor_services;
DROP POLICY IF EXISTS "vendor_service_areas_public_read" ON public.vendor_service_areas;
DROP POLICY IF EXISTS "vendor_service_areas_manage_own" ON public.vendor_service_areas;
DROP POLICY IF EXISTS "vendor_availability_public_read" ON public.vendor_availability;
DROP POLICY IF EXISTS "vendor_availability_manage_own" ON public.vendor_availability;

-- Step 3: Create RLS policies for vendors table
-- Policy 1: Public read access to all vendors (for browsing)
CREATE POLICY "vendors_public_read" ON public.vendors
FOR SELECT TO anon, authenticated
USING (true);

-- Policy 2: Authenticated users can update their own vendor data
CREATE POLICY "vendors_update_own" ON public.vendors
FOR UPDATE TO authenticated
USING (id IN (SELECT vendor_id FROM public.vendor_user_vendors WHERE user_id = auth.uid()))
WITH CHECK (id IN (SELECT vendor_id FROM public.vendor_user_vendors WHERE user_id = auth.uid()));

-- Step 4: Create RLS policies for vendor_profiles table
-- Policy 1: Public read access to public profiles
CREATE POLICY "vendor_profiles_public_read" ON public.vendor_profiles
FOR SELECT TO anon, authenticated
USING (visibility = 'public' OR visibility IS NULL);

-- Policy 2: Authenticated users can update their own profile
CREATE POLICY "vendor_profiles_update_own" ON public.vendor_profiles
FOR UPDATE TO authenticated
USING (vendor_id IN (SELECT vendor_id FROM public.vendor_user_vendors WHERE user_id = auth.uid()))
WITH CHECK (vendor_id IN (SELECT vendor_id FROM public.vendor_user_vendors WHERE user_id = auth.uid()));

-- Step 5: Create RLS policies for vendor_services table
-- Policy 1: Public read access to active services
CREATE POLICY "vendor_services_public_read" ON public.vendor_services
FOR SELECT TO anon, authenticated
USING (is_active = true);

-- Policy 2: Authenticated users can manage their own services
CREATE POLICY "vendor_services_manage_own" ON public.vendor_services
FOR ALL TO authenticated
USING (vendor_id IN (SELECT vendor_id FROM public.vendor_user_vendors WHERE user_id = auth.uid()));

-- Step 6: Create RLS policies for vendor_service_areas table
-- Policy 1: Public read access to service areas
CREATE POLICY "vendor_service_areas_public_read" ON public.vendor_service_areas
FOR SELECT TO anon, authenticated
USING (true);

-- Policy 2: Authenticated users can manage their own service areas
CREATE POLICY "vendor_service_areas_manage_own" ON public.vendor_service_areas
FOR ALL TO authenticated
USING (vendor_id IN (SELECT vendor_id FROM public.vendor_user_vendors WHERE user_id = auth.uid()));

-- Step 7: Create RLS policies for vendor_availability table
-- Policy 1: Public read access to availability
CREATE POLICY "vendor_availability_public_read" ON public.vendor_availability
FOR SELECT TO anon, authenticated
USING (true);

-- Policy 2: Authenticated users can manage their own availability
CREATE POLICY "vendor_availability_manage_own" ON public.vendor_availability
FOR ALL TO authenticated
USING (vendor_id IN (SELECT vendor_id FROM public.vendor_user_vendors WHERE user_id = auth.uid()));

-- Step 8: Grant necessary permissions to ensure access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Step 9: Set default privileges for future tables
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public 
GRANT SELECT ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public 
GRANT ALL ON TABLES TO authenticated;

-- Verification: Check that policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
