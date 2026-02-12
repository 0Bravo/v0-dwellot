-- Create saved_searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  search_query TEXT,
  location VARCHAR(255),
  min_price DECIMAL(12, 2),
  max_price DECIMAL(12, 2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  property_type VARCHAR(100),
  listing_type VARCHAR(20),
  email_alerts BOOLEAN DEFAULT true,
  alert_frequency VARCHAR(20) DEFAULT 'daily', -- 'instant', 'daily', 'weekly'
  last_alert_sent TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved searches
CREATE POLICY "Users can view own saved searches" ON saved_searches
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own saved searches
CREATE POLICY "Users can insert own saved searches" ON saved_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved searches
CREATE POLICY "Users can update own saved searches" ON saved_searches
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own saved searches
CREATE POLICY "Users can delete own saved searches" ON saved_searches
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_created_at ON saved_searches(created_at DESC);
