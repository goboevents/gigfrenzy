-- GigFrenzy Database Setup for Supabase (Fixed for UUID auth)
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Step 1: Create the main tables with proper UUID support
CREATE TABLE IF NOT EXISTS vendors (
    id BIGSERIAL PRIMARY KEY,
    business_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    business_type TEXT NOT NULL,
    website TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We'll use Supabase's built-in auth.users table instead of vendor_users
-- The auth.users table is automatically created by Supabase

CREATE TABLE IF NOT EXISTS vendor_user_vendors (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, vendor_id)
);

CREATE TABLE IF NOT EXISTS vendor_profiles (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL UNIQUE REFERENCES vendors(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    visibility TEXT NOT NULL DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_services (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    type TEXT NOT NULL DEFAULT 'service',
    duration TEXT DEFAULT 'per event',
    features TEXT[] DEFAULT '{}',
    is_popular BOOLEAN NOT NULL DEFAULT false,
    pricing_model TEXT DEFAULT 'fixed',
    hourly_rate INTEGER DEFAULT 0,
    deposit_required BOOLEAN NOT NULL DEFAULT false,
    deposit_percentage INTEGER DEFAULT 25,
    cancellation_policy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_service_areas (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    radius INTEGER DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_availability (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL UNIQUE REFERENCES vendors(id) ON DELETE CASCADE,
    monday BOOLEAN NOT NULL DEFAULT false,
    tuesday BOOLEAN NOT NULL DEFAULT false,
    wednesday BOOLEAN NOT NULL DEFAULT false,
    thursday BOOLEAN NOT NULL DEFAULT false,
    friday BOOLEAN NOT NULL DEFAULT false,
    saturday BOOLEAN NOT NULL DEFAULT false,
    sunday BOOLEAN NOT NULL DEFAULT false,
    start_time TIME DEFAULT '09:00:00',
    end_time TIME DEFAULT '17:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    service_id BIGINT REFERENCES vendor_services(id) ON DELETE SET NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    event_location TEXT,
    guest_count INTEGER,
    special_requirements TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount_cents INTEGER NOT NULL,
    deposit_amount_cents INTEGER DEFAULT 0,
    deposit_paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_slug ON vendor_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_vendor_id ON vendor_profiles(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_services_vendor_id ON vendor_services(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_services_active ON vendor_services(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_user_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for security (using auth.uid() for UUID user IDs)
-- Vendors: Users can only see their own vendor data
CREATE POLICY "Users can view own vendor data" ON vendors
    FOR SELECT USING (
        id IN (
            SELECT vendor_id FROM vendor_user_vendors 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own vendor data" ON vendors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own vendor data" ON vendors
    FOR UPDATE USING (
        id IN (
            SELECT vendor_id FROM vendor_user_vendors 
            WHERE user_id = auth.uid()
        )
    );

-- Vendor profiles: Public read access, owner write access
CREATE POLICY "Public can view vendor profiles" ON vendor_profiles
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can manage own vendor profiles" ON vendor_profiles
    FOR ALL USING (
        vendor_id IN (
            SELECT vendor_id FROM vendor_user_vendors 
            WHERE user_id = auth.uid()
        )
    );

-- Vendor services: Public read access, owner write access
CREATE POLICY "Public can view active vendor services" ON vendor_services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own vendor services" ON vendor_services
    FOR ALL USING (
        vendor_id IN (
            SELECT vendor_id FROM vendor_user_vendors 
            WHERE user_id = auth.uid()
        )
    );

-- Bookings: Vendors can see their bookings, anyone can create
CREATE POLICY "Vendors can view their bookings" ON bookings
    FOR SELECT USING (
        vendor_id IN (
            SELECT vendor_id FROM vendor_user_vendors 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create bookings" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Vendors can update their bookings" ON bookings
    FOR UPDATE USING (
        vendor_id IN (
            SELECT vendor_id FROM vendor_user_vendors 
            WHERE user_id = auth.uid()
        )
    );

-- Step 5: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Create triggers for updated_at
CREATE TRIGGER update_vendor_profiles_updated_at 
    BEFORE UPDATE ON vendor_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_services_updated_at 
    BEFORE UPDATE ON vendor_services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_availability_updated_at 
    BEFORE UPDATE ON vendor_availability 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Success message
SELECT 'GigFrenzy database setup completed successfully!' as status;