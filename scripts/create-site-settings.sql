CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS site_settings_select_all ON site_settings;
CREATE POLICY site_settings_select_all ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS site_settings_admin_all ON site_settings;
CREATE POLICY site_settings_admin_all ON site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Seed default values
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Dwellot'),
  ('contact_email', 'support@dwellot.com'),
  ('whatsapp_number', '233201578429'),
  ('ghana_office_address', ''),
  ('uk_office_address', ''),
  ('facebook_url', ''),
  ('twitter_url', ''),
  ('instagram_url', ''),
  ('linkedin_url', ''),
  ('default_currency', 'USD'),
  ('default_listing_status', 'draft'),
  ('properties_per_page', '12')
ON CONFLICT (key) DO NOTHING;
