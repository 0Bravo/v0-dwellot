-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public contact form)
CREATE POLICY "contact_submissions_insert_anyone" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Only service role can read (admin only)
CREATE POLICY "contact_submissions_select_admin" ON contact_submissions
  FOR SELECT USING (false);
