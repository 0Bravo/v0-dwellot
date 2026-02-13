-- Create property_enquiries table
CREATE TABLE IF NOT EXISTS property_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id integer NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  enquiry_type text NOT NULL CHECK (enquiry_type IN ('whatsapp_click', 'phone_click', 'email_click', 'contact_form', 'viewing_request')),
  visitor_name text,
  visitor_email text,
  visitor_phone text,
  message text,
  source_page text NOT NULL DEFAULT 'property_detail',
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_enquiries_property_id ON property_enquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON property_enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON property_enquiries(enquiry_type);

-- Add enquiry_count column to properties if not exists
ALTER TABLE properties ADD COLUMN IF NOT EXISTS enquiry_count integer DEFAULT 0;

-- Create trigger function to auto-increment enquiry_count
CREATE OR REPLACE FUNCTION increment_enquiry_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties
  SET enquiry_count = COALESCE(enquiry_count, 0) + 1
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_increment_enquiry_count ON property_enquiries;
CREATE TRIGGER trigger_increment_enquiry_count
  AFTER INSERT ON property_enquiries
  FOR EACH ROW
  EXECUTE FUNCTION increment_enquiry_count();

-- RLS policies
ALTER TABLE property_enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public enquiries)
CREATE POLICY "enquiries_insert_anyone" ON property_enquiries
  FOR INSERT WITH CHECK (true);

-- Only admin/service role can read
CREATE POLICY "enquiries_select_admin" ON property_enquiries
  FOR SELECT USING (auth.role() = 'service_role');
