-- Add missing columns to newsletter_subscribers table
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS source text DEFAULT 'footer';
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS ip_address text;

-- Ensure RLS is enabled
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the subscribe form)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'newsletter_subscribers' AND policyname = 'newsletter_public_insert'
  ) THEN
    CREATE POLICY newsletter_public_insert ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
END $$;

-- Allow authenticated reads for admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'newsletter_subscribers' AND policyname = 'newsletter_admin_read'
  ) THEN
    CREATE POLICY newsletter_admin_read ON newsletter_subscribers FOR SELECT TO authenticated USING (true);
  END IF;
END $$;
