-- Fix Vendor User Link Issue - Run this in Supabase SQL Editor
-- This script fixes the RLS policies on the vendor_user_vendors table

-- Step 1: Check current state
SELECT 'Current vendor_user_vendors table state:' as info;
SELECT * FROM vendor_user_vendors;

-- Step 2: Check current RLS policies
SELECT 'Current RLS policies on vendor_user_vendors:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'vendor_user_vendors';

-- Step 3: Create RLS policy to allow users to read their own vendor links
-- This policy allows authenticated users to SELECT their own vendor links
CREATE POLICY "Users can view their own vendor links" ON vendor_user_vendors
FOR SELECT USING (auth.uid() = user_id);

-- Step 4: Create RLS policy to allow users to insert their own vendor links
-- This policy allows authenticated users to INSERT their own vendor links
CREATE POLICY "Users can insert their own vendor links" ON vendor_user_vendors
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 5: Create RLS policy to allow users to update their own vendor links
-- This policy allows authenticated users to UPDATE their own vendor links
CREATE POLICY "Users can update their own vendor links" ON vendor_user_vendors
FOR UPDATE USING (auth.uid() = user_id);

-- Step 6: Create RLS policy to allow users to delete their own vendor links
-- This policy allows authenticated users to DELETE their own vendor links
CREATE POLICY "Users can delete their own vendor links" ON vendor_user_vendors
FOR DELETE USING (auth.uid() = user_id);

-- Step 7: Verify the policies were created
SELECT 'New RLS policies on vendor_user_vendors:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'vendor_user_vendors';

-- Step 8: Test if the user can now read their vendor link
-- This should now work for authenticated users
SELECT 'Testing vendor user link access (run this after logging in):' as info;
SELECT 'SELECT * FROM vendor_user_vendors WHERE user_id = auth.uid();' as test_query;

-- Step 9: Final verification
SELECT 'Vendor user link fix completed!' as status;
SELECT 'The test user should now be able to log in and access their vendor data.' as next_steps;
