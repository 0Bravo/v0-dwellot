-- Admin Dashboard Schema Updates
-- Add missing columns to properties table for full admin functionality

-- Basic property fields
ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS developer text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS estate_name text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS region text DEFAULT 'Greater Accra';

-- Property details
ALTER TABLE properties ADD COLUMN IF NOT EXISTS furnished text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking_spaces integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS year_built integer;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floors integer DEFAULT 1;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_size numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS negotiable boolean DEFAULT true;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS payment_plans text;

-- Agent/contact fields
ALTER TABLE properties ADD COLUMN IF NOT EXISTS agent_name text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS agent_phone text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS agent_whatsapp text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS agent_email text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS agent_company text;

-- Coordinates
ALTER TABLE properties ADD COLUMN IF NOT EXISTS latitude numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS longitude numeric;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS properties_slug_idx ON properties(slug);
CREATE INDEX IF NOT EXISTS properties_status_idx ON properties(status);
CREATE INDEX IF NOT EXISTS properties_location_idx ON properties(location);
CREATE INDEX IF NOT EXISTS properties_developer_idx ON properties(developer);

-- Update profiles RLS to allow admins to view all profiles
DROP POLICY IF EXISTS profiles_admin_all ON profiles;
CREATE POLICY profiles_admin_all ON profiles
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Add admin policies for properties management
DROP POLICY IF EXISTS properties_admin_all ON properties;
CREATE POLICY properties_admin_all ON properties
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Add admin policies for enquiries
DROP POLICY IF EXISTS enquiries_admin_all ON property_enquiries;
CREATE POLICY enquiries_admin_all ON property_enquiries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Add admin policies for newsletter subscribers
DROP POLICY IF EXISTS newsletter_admin_all ON newsletter_subscribers;
CREATE POLICY newsletter_admin_all ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Add admin policies for agent applications
DROP POLICY IF EXISTS agent_applications_admin_all ON agent_applications;
CREATE POLICY agent_applications_admin_all ON agent_applications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
