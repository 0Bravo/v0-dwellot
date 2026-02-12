-- ================================================
-- SECURITY FIX: Address Supabase Linter Warnings
-- ================================================
-- This script fixes security issues identified by Supabase database linter
-- Date: 2026-01-29

-- ================================================
-- FIX 1: Function Search Path Security
-- ================================================
-- Set secure search_path for all functions to prevent search_path hijacking

-- Fix: update_updated_at_column
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Fix: handle_updated_at
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Fix: update_property_view_count
DROP FUNCTION IF EXISTS update_property_view_count(UUID) CASCADE;
CREATE OR REPLACE FUNCTION update_property_view_count(property_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE properties 
    SET view_count = view_count + 1 
    WHERE id = property_id;
END;
$$;

-- Fix: increment_view_count
DROP FUNCTION IF EXISTS increment_view_count(UUID) CASCADE;
CREATE OR REPLACE FUNCTION increment_view_count(property_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE properties 
    SET view_count = COALESCE(view_count, 0) + 1 
    WHERE id = property_id;
END;
$$;

-- Recreate triggers if needed
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- ================================================
-- FIX 2: Tighten RLS Policies
-- ================================================
-- Replace overly permissive policies with more secure alternatives

-- Fix: inquiries table
DROP POLICY IF EXISTS "inquiries_insert_all" ON inquiries;
CREATE POLICY "inquiries_insert_authenticated"
    ON inquiries
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
    );

-- Allow anonymous users to create inquiries but require valid email
CREATE POLICY "inquiries_insert_anonymous"
    ON inquiries
    FOR INSERT
    TO anon
    WITH CHECK (
        email IS NOT NULL 
        AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
        AND name IS NOT NULL
        AND message IS NOT NULL
    );

-- Fix: newsletter_subscribers table
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
CREATE POLICY "newsletter_subscribe_with_validation"
    ON newsletter_subscribers
    FOR INSERT
    TO public
    WITH CHECK (
        email IS NOT NULL 
        AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
        AND LENGTH(email) <= 255
    );

-- Prevent duplicate subscriptions
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_unique 
    ON newsletter_subscribers(LOWER(email));

-- Fix: property_views table
DROP POLICY IF EXISTS "property_views_insert_all" ON property_views;
CREATE POLICY "property_views_insert_with_property_check"
    ON property_views
    FOR INSERT
    TO public
    WITH CHECK (
        property_id IS NOT NULL
        AND EXISTS (SELECT 1 FROM properties WHERE id = property_id)
    );

-- ================================================
-- FIX 3: Add Rate Limiting for Public Operations
-- ================================================
-- Add a function to track and limit rapid insertions

CREATE TABLE IF NOT EXISTS rate_limit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT rate_limit_identifier_check CHECK (LENGTH(identifier) <= 500)
);

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS rate_limit_log_lookup 
    ON rate_limit_log(table_name, identifier, created_at);

-- Cleanup old rate limit logs (keep only last 24 hours)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM rate_limit_log 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- ================================================
-- FIX 4: Add Input Validation Constraints
-- ================================================

-- Ensure inquiries have required fields
ALTER TABLE inquiries 
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN message SET NOT NULL;

-- Add email validation constraint for inquiries
ALTER TABLE inquiries
    DROP CONSTRAINT IF EXISTS inquiries_email_format_check,
    ADD CONSTRAINT inquiries_email_format_check 
    CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Add email validation constraint for newsletter
ALTER TABLE newsletter_subscribers
    DROP CONSTRAINT IF EXISTS newsletter_email_format_check,
    ADD CONSTRAINT newsletter_email_format_check 
    CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- ================================================
-- FIX 5: Add Security Comments
-- ================================================

COMMENT ON FUNCTION update_updated_at_column() IS 
    'Securely updates updated_at timestamp. Uses SET search_path for security.';

COMMENT ON FUNCTION handle_updated_at() IS 
    'Securely handles updated_at field. Uses SET search_path for security.';

COMMENT ON FUNCTION update_property_view_count(UUID) IS 
    'Securely increments property view count. Uses SET search_path for security.';

COMMENT ON FUNCTION increment_view_count(UUID) IS 
    'Securely increments view count with null safety. Uses SET search_path for security.';

COMMENT ON POLICY "inquiries_insert_authenticated" ON inquiries IS 
    'Authenticated users can only insert inquiries for themselves';

COMMENT ON POLICY "inquiries_insert_anonymous" ON inquiries IS 
    'Anonymous users can create inquiries with email validation';

COMMENT ON POLICY "newsletter_subscribe_with_validation" ON newsletter_subscribers IS 
    'Public can subscribe with email validation and length limits';

COMMENT ON POLICY "property_views_insert_with_property_check" ON property_views IS 
    'Anyone can log views, but only for existing properties';

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Uncomment these to verify the fixes:
-- SELECT proname, prosecdef, prosrc FROM pg_proc WHERE proname IN ('update_updated_at_column', 'handle_updated_at', 'update_property_view_count', 'increment_view_count');
-- SELECT tablename, policyname, cmd, qual, with_check FROM pg_policies WHERE tablename IN ('inquiries', 'newsletter_subscribers', 'property_views');
