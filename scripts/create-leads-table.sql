-- Create leads table for qualified lead generation
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact information
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  
  -- Property preferences
  intent TEXT CHECK (intent IN ('buy', 'rent', 'invest', 'sell')),
  property_type TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  bedrooms INTEGER,
  preferred_locations TEXT[], -- Array of locations
  timeline TEXT CHECK (timeline IN ('immediately', '1-3_months', '3-6_months', '6-12_months', 'just_browsing')),
  
  -- Lead metadata
  source TEXT DEFAULT 'modal',
  ip_address TEXT,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  assigned_to UUID REFERENCES profiles(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_intent_idx ON leads(intent);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert leads (public form submission)
CREATE POLICY leads_insert_anyone ON leads
  FOR INSERT TO public
  WITH CHECK (true);

-- Policy: Only admins can view all leads
CREATE POLICY leads_select_admin ON leads
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update leads
CREATE POLICY leads_update_admin ON leads
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete leads
CREATE POLICY leads_delete_admin ON leads
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();
