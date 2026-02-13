CREATE TABLE IF NOT EXISTS agent_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  license_number TEXT,
  experience TEXT,
  areas TEXT[] DEFAULT '{}',
  bio TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE agent_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_applications_insert_anyone"
  ON agent_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "agent_applications_select_admin"
  ON agent_applications FOR SELECT
  USING (auth.role() = 'service_role');
